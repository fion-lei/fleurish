import { useState } from "react";
import { useNavigate } from "react-router";
import { AuthLayout } from "../components/AuthLayout";
import { FormInput } from "../components/FormInput";
import { SubmitButton } from "../components/SubmitButton";
import { useAuth } from "../components/AuthContext";
import type { Route } from "./+types/register";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Register - Fleurish" },
    { name: "description", content: "Create a new Fleurish account" },
  ];
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      await register(email, password);
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
        <h2 className="text-[22.95px] md:text-[27.54px] font-semibold text-fleur-green text-center">
          Register Now
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <FormInput
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            required
            aria-label="Password"
            autoComplete="new-password"
            minLength={8}
            disabled={isSubmitting}
          />

          <FormInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
            aria-label="Confirm password"
            autoComplete="new-password"
            minLength={8}
            disabled={isSubmitting}
          />

          <SubmitButton disabled={isSubmitting}>
            {isSubmitting ? "REGISTERING..." : "REGISTER"}
          </SubmitButton>
        </form>
      </div>
    </AuthLayout>
  );
}

