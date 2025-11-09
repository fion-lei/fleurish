import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "./AuthContext";

export function Navbar() {
  const currentPath = useLocation().pathname;
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { path: "/garden", label: "Garden" },
    { path: "/my-tasks", label: "My tasks" },
    { path: "/community-tasks", label: "Community Tasks" },
    { path: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-4">
      <div className="max-w-[1536px] mx-auto pl-4 pr-8 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-16">
        <div className="flex items-center justify-center h-[57.6px] relative">
          {/* Brand logo and title - links to garden page */}
          <Link to="/garden" className="flex items-end gap-2 absolute left-0">
            <h1 className="text-[26.46px] font-bold leading-none">
              <span className="text-fleur-green">fleur</span>
              <span className="text-fleur-purple">ish</span>
            </h1>
            <img
              src="/images/logo.png"
              alt=""
              className="w-[58.88px] h-[58.88px] object-contain"
              aria-hidden="true"
            />
          </Link>

          {/* Navigation links with active state highlighting - centered */}
          <div className="flex items-center rounded-pill border border-fleur-green/60 bg-white px-2 py-1 gap-2">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-pill transition-all duration-300 ease-in-out ${
                    isActive
                      ? "bg-fleur-green text-white font-semibold"
                      : "text-fleur-green hover:text-fleur-green/80"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div 
            className={`flex items-center rounded-full transition-all duration-300 ease-in-out ${
              showDropdown ? "bg-fleur-purple/10" : ""
            }`}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showDropdown ? 'w-[88px] pl-2' : 'w-0'
              }`}
            >
              <button
                onClick={handleLogout}
                className="whitespace-nowrap text-fleur-purple transition-colors focus:outline-none bg-white/80 px-3 py-1 rounded-full mr-1"
              >
                Logout
              </button>
            </div>

            <Link
              to="/profile"
              className={`p-2 rounded-full transition-all duration-300 ease-in-out flex focus:outline-none ${
                showDropdown ? "text-fleur-purple" : "text-fleur-green hover:text-fleur-purple"
              }`}
              aria-label="Profile"
              onClick={(e) => {
                e.currentTarget.blur();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}