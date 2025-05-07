"use client";

import React from "react";
import { Slot } from "@radix-ui/react-slot";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

export default function Button({ children, className = "", asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      {...props}
      className={`cursor-pointer transition-all bg-teal-700 text-white px-6 py-2 rounded-lg
        border-teal-800 border-b-[4px]
        hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
        active:border-b-[2px] active:brightness-90 active:translate-y-[2px]
        ${className}`}
    >
      {children}
    </Comp>
  );
}

export { Button };
