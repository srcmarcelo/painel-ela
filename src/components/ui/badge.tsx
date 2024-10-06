import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-primary",

        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        success:
          "border-transparent bg-green-500 text-destructive-foreground hover:bg-green-500/80",
        outline: "text-foreground",
        green:
          "border-transparent bg-green-500 text-destructive-foreground hover:bg-green-500/80",
        red: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        yellow:
          "border-transparent bg-yellow-500 text-destructive-foreground hover:bg-yellow-500/80",
        purple:
          "border-transparent bg-purple-600 text-destructive-foreground hover:bg-purple-600/80",
        gray: "border-transparent bg-gray-600 text-destructive-foreground hover:bg-gray-600/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
