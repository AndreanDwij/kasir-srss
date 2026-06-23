import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, required, className = "", ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-3 py-2 text-sm text-slate-900 placeholder-slate-400 bg-white border rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-200 ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-slate-300 focus:border-emerald-500"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
