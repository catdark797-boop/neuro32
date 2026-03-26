import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20",
        secondary: "bg-[#27272a] text-[#a1a1aa]",
        accent: "bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20",
        pink: "bg-[#EC4899]/10 text-[#EC4899] border border-[#EC4899]/20",
        outline: "border border-[#27272a] text-[#a1a1aa]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
