import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name?: string;
  communityId?: string;
  gardenId?: string;
  gems?: number;
  coins?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token) {
          const response = await fetch(`${API_BASE_URL}users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            const userData = data.data?.user || data.user || data;
            if (userData.userId && !userData.id) {
              userData.id = userData.userId;
            }
            setUser(userData);
          } else {
            localStorage.removeItem("auth_token");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("auth_token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    localStorage.setItem("auth_token", data.token || data.data?.token);
    const userData = data.data?.user || data.user || data;
    if (userData.userId && !userData.id) {
      userData.id = userData.userId;
    }
    setUser(userData);
  };

  const register = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    const data = await response.json();
    localStorage.setItem("auth_token", data.token || data.data?.token);
    const userData = data.data?.user || data.user || data;
    if (userData.userId && !userData.id) {
      userData.id = userData.userId;
    }
    setUser(userData);
  };

  const logout = async () => {
    try {
      localStorage.removeItem("auth_token");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        const response = await fetch(`${API_BASE_URL}users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const userData = data.data?.user || data.user || data;
          if (userData.userId && !userData.id) {
            userData.id = userData.userId;
          }
          setUser(userData);
        }
      }
    } catch (error) {
      console.error("Refresh user failed:", error);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
