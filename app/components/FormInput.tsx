import { forwardRef } from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={props.id} className="sr-only">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-white/70 rounded-xl shadow-soft px-[14px] py-[9px] text-[11.2px] placeholder:text-[#caaec2] focus:outline-none focus:ring-2 focus:ring-fleur-purple/50 transition ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

