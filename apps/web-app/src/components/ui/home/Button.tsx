import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`cursor-pointer transition-all bg-teal-700 text-white px-6 py-2 rounded-lg
        border-teal-800 border-b-[4px]
        hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
        active:border-b-[2px] active:brightness-90 active:translate-y-[2px]
        ${className}`}
    >
      {children}
    </button>
  );
}

export { Button };
