interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function SubmitButton({ children, className = "", ...props }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className={`w-full bg-fleur-purple text-white font-bold rounded-pill shadow-soft px-6 py-4 tracking-wide2 hover:opacity-95 active:translate-y-[1px] transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

