import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

interface AuthLayoutProps {
  children: React.ReactNode;
}

// Shared layout for login and register pages with two-column responsive design
export function AuthLayout({ children }: AuthLayoutProps) {
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const [formWidth, setFormWidth] = useState<number | null>(null);

  // Dynamically match form width to logo container width for visual alignment
  useEffect(() => {
    const updateFormWidth = () => {
      if (logoContainerRef.current) {
        setFormWidth(logoContainerRef.current.offsetWidth);
      }
    };

    // Use requestAnimationFrame + setTimeout to ensure DOM is fully rendered
    requestAnimationFrame(() => {
      setTimeout(updateFormWidth, 0);
    });
    
    window.addEventListener('resize', updateFormWidth);
    return () => window.removeEventListener('resize', updateFormWidth);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8ED] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {/* Left Column - Form */}
          <div className="w-full md:w-1/2 flex flex-col items-center space-y-6 md:pl-20">
            {/* Logo */}
            <div ref={logoContainerRef} className="flex items-end gap-2 mb-4 w-fit justify-center md:justify-start">
              <h1 className="text-[50.6px] md:text-[60.72px] font-bold leading-none">
                <span className="text-fleur-green">fleur</span>
                <span className="text-fleur-purple">ish</span>
              </h1>
              <img
                src="/images/logo.png"
                alt=""
                className="w-[101.2px] h-[101.2px] md:w-[121.44px] md:h-[121.44px] object-contain"
                aria-hidden="true"
              />
            </div>

            {/* Tab selector - matches logo width for alignment */}
            <div className="w-fit" style={formWidth ? { width: `${formWidth}px` } : undefined}>
              <div className="flex rounded-pill border border-fleur-purple/40 p-0.5 bg-white/50">
                <Link
                  to="/register"
                  className={`flex-1 text-center py-1.5 px-3 rounded-pill transition-all duration-300 ease-in-out text-sm ${
                    isRegister
                      ? "bg-fleur-purple text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.06)]"
                      : "bg-white text-fleur-purple border border-fleur-purple/50"
                  }`}
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className={`flex-1 text-center py-1.5 px-3 rounded-pill transition-all duration-300 ease-in-out text-sm ${
                    isLogin
                      ? "bg-fleur-purple text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.06)]"
                      : "bg-white text-fleur-purple border border-fleur-purple/50"
                  }`}
                >
                  Log In
                </Link>
              </div>
            </div>

            {/* Form content - matches logo width for alignment */}
            <div className="w-fit" style={formWidth ? { width: `${formWidth}px` } : undefined}>
              {children}
            </div>
          </div>

          {/* Right column - decorative island image */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <img
              src="/images/login_island.png"
              alt="Garden island"
              className="w-full max-w-[1230px] h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}