import { AuthLayout } from "../components/AuthLayout";
import { FormInput } from "../components/FormInput";
import { SubmitButton } from "../components/SubmitButton";
import type { Route } from "./+types/register";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Register - Fleurish" },
    { name: "description", content: "Create a new Fleurish account" },
  ];
}

export default function Register() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());
    console.log("Register form values:", values);
  };

  return (
    <AuthLayout>
      <div className="w-full space-y-6">
        <h2 className="text-[22.95px] md:text-[27.54px] font-semibold text-fleur-green text-center">
          Register Now
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
            autoComplete="new-password"
            minLength={8}
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
          />

          <SubmitButton>REGISTER</SubmitButton>
        </form>
      </div>
    </AuthLayout>
  );
}

