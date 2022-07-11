import clsx from "clsx";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

const Button: React.FC<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = ({ children, className, ...props }) => {
  return (
    <button
      className={clsx(
        className,
        "bg-blue-700 hover:bg-blue-600 text-slate-100 w-full rounded-md p-4 text-2xl font-semibold disabled:bg-blue-300"
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
