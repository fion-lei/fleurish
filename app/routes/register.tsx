import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthLayout } from "../components/AuthLayout";
import { FormInput } from "../components/FormInput";
import { PasswordInput } from "../components/PasswordInput";
import { SubmitButton } from "../components/SubmitButton";
import { useAuth } from "../components/AuthContext";
import { getAllCommunities, type Community } from "../api/communities";
import type { Route } from "./+types/register";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Register - Fleurish" }, { name: "description", content: "Create a new Fleurish account" }];
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(null);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true);

  // Fetch communities on mount
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const data = await getAllCommunities();
        setCommunities(data);
      } catch (err) {
        console.error("Failed to fetch communities:", err);
        setError("Failed to load communities. Please try again later.");
      } finally {
        setLoadingCommunities(false);
      }
    };

    fetchCommunities();
  }, []);

  // Check if passwords match in real-time
  const checkPasswordMatch = (pwd: string, confirmPwd: string) => {
    if (confirmPwd && pwd !== confirmPwd) {
      setPasswordMatchError("Passwords do not match");
    } else {
      setPasswordMatchError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const communityId = formData.get("communityId") as string;

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    // Validate community selection
    if (!communityId) {
      setError("Please select a community");
      setIsSubmitting(false);
      return;
    }

    try {
      await register(email, password, communityId);
      // Redirect to garden page after successful registration
      navigate("/garden");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full space-y-6">
        <h2 className="text-[22.95px] md:text-[27.54px] font-semibold text-fleur-green text-center">Register Now</h2>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-[11.2px]">{error}</div>}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <FormInput
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            required
            aria-label="Email address"
            autoComplete="email"
            disabled={isSubmitting}
          />

          <div>
            <select
              id="communityId"
              name="communityId"
              required
              disabled={isSubmitting || loadingCommunities}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-[11.2px] text-black focus:outline-none focus:ring-2 focus:ring-fleur-green focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              aria-label="Select community"
            >
              <option value="" className="text-gray-600">
                {loadingCommunities ? "Loading communities..." : "Select your community"}
              </option>
              {communities.map((community) => (
                <option
                  key={community._id}
                  value={community._id}
                  className="text-black"
                >
                  {community.name}
                </option>
              ))}
            </select>
          </div>

          <PasswordInput
            id="password"
            name="password"
            placeholder="Password"
            required
            aria-label="Password"
            autoComplete="new-password"
            minLength={8}
            disabled={isSubmitting}
            onChange={(e) => {
              const newPassword = e.target.value;
              setPassword(newPassword);
              checkPasswordMatch(newPassword, confirmPassword);
            }}
          />

          <div>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              aria-label="Confirm password"
              autoComplete="new-password"
              minLength={8}
              disabled={isSubmitting}
              onChange={(e) => {
                const newConfirmPassword = e.target.value;
                setConfirmPassword(newConfirmPassword);
                checkPasswordMatch(password, newConfirmPassword);
              }}
            />
            {passwordMatchError && <p className="text-red-500 text-[10px] mt-1 ml-1">{passwordMatchError}</p>}
          </div>

          <SubmitButton disabled={isSubmitting}>{isSubmitting ? "REGISTERING..." : "REGISTER"}</SubmitButton>
        </form>
      </div>
    </AuthLayout>
  );
}
