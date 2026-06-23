import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
}

export default function Button({ variant = "primary", loading = false, disabled, className = "", children, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-200";
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 active:scale-[0.98]",
    secondary: "bg-slate-200 text-slate-800 hover:bg-slate-700 hover:text-white active:bg-slate-800 active:scale-[0.98]",
    danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 active:scale-[0.98]",
    ghost: "text-slate-600 hover:bg-slate-100 active:scale-[0.98]",
  };
  const disabledStyles = "bg-slate-300 text-slate-500 cursor-not-allowed";

  return (
    <button className={`${base} ${disabled || loading ? disabledStyles : variants[variant]} ${className}`} disabled={disabled || loading} {...props}>
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
