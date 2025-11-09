import { useNavigate } from "react-router";
import { AuthLayout } from "../components/AuthLayout";
import { FormInput } from "../components/FormInput";
import { SubmitButton } from "../components/SubmitButton";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Log In - Fleurish" },
    { name: "description", content: "Log in to your Fleurish account" },
  ];
}

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());
    console.log("Login form values:", values);
    // Redirect to garden page after successful login
    navigate("/garden");
  };

  return (
    <AuthLayout>
      <div className="w-full space-y-6">
        <h2 className="text-[22.95px] md:text-[27.54px] font-semibold text-fleur-green text-center">
          Log In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            required
            aria-label="Email address"
            autoComplete="email"
          />

          <FormInput
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            required
            aria-label="Password"
            autoComplete="current-password"
          />

          <SubmitButton>SIGN IN</SubmitButton>
        </form>
      </div>
    </AuthLayout>
  );
}

