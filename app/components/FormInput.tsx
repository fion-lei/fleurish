import { forwardRef } from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

// Reusable form input component with consistent styling
// Uses forwardRef to allow parent components to access the input element
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full bg-white/70 rounded-xl shadow-soft px-[14px] py-[9px] text-[11.2px] placeholder:text-[#caaec2] focus:outline-none focus:ring-2 focus:ring-fleur-purple/50 transition ${className}`}
        style={{ caretColor: 'transparent' }}
        {...props}
      />
    );
  }
);

FormInput.displayName = "FormInput";