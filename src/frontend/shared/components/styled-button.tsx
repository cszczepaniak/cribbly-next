import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { twMerge } from "tailwind-merge";

const Button = React.forwardRef<
  HTMLButtonElement,
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
>((props, ref) => {
  const { className, children, ...rest } = props;
  return (
    <button
      ref={ref}
      className={twMerge(
        "bg-blue-700 hover:bg-blue-600 text-slate-100 w-full rounded-md p-4 text-2xl font-semibold disabled:bg-blue-300",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
});

Button.displayName = "styledButton";

export { Button };
