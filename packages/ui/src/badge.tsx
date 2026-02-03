import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-100 text-primary-700 hover:bg-primary-200",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        success:
          "border-transparent bg-accent-100 text-accent-700 hover:bg-accent-200",
        warning:
          "border-transparent bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
        destructive:
          "border-transparent bg-red-100 text-red-700 hover:bg-red-200",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
