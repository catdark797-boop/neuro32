import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#06B6D4] text-white hover:bg-[#0891b2] shadow-lg shadow-[#06B6D4]/25",
        secondary: "bg-[#27272a] text-white hover:bg-[#3f3f46]",
        outline: "border border-[#27272a] bg-transparent hover:bg-[#27272a] hover:text-white",
        ghost: "hover:bg-[#27272a] hover:text-white",
        link: "text-[#06B6D4] underline-offset-4 hover:underline",
        accent: "bg-[#8B5CF6] text-white hover:bg-[#7c3aed] shadow-lg shadow-[#8B5CF6]/25",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
