import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { twMerge } from "tailwind-merge";

const Button: React.FC<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = ({ children, className, ...props }) => {
  return (
    <button
      className={twMerge(
        "bg-blue-700 hover:bg-blue-600 text-slate-100 w-full rounded-md p-4 text-2xl font-semibold disabled:bg-blue-300",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
