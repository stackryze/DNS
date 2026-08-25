import React from "react";
import { cn } from "../../lib/utils";

const base =
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none";

const variants = {
  primary:
    "text-primary-foreground bg-[linear-gradient(180deg,var(--primary-bright),var(--primary))] shadow-[inset_0_1px_0_0_oklch(1_0_0/25%),0_1px_2px_0_oklch(0_0_0/40%),0_10px_28px_-12px_color-mix(in_oklch,var(--primary)_75%,transparent)] hover:brightness-[1.08]",
  secondary:
    "bg-secondary text-secondary-foreground border border-border shadow-[inset_0_1px_0_0_oklch(1_0_0/5%)] hover:bg-accent hover:border-border-strong",
  outline:
    "border border-border bg-white/[0.02] text-foreground shadow-[inset_0_1px_0_0_oklch(1_0_0/4%)] hover:bg-white/[0.05] hover:border-border-strong",
  ghost: "bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
  destructive:
    "bg-destructive text-destructive-foreground shadow-[inset_0_1px_0_0_oklch(1_0_0/18%)] hover:brightness-110",
  link: "bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto",
};

const sizes = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-10 px-5",
  lg: "h-12 px-7 text-[15px]",
  icon: "h-10 w-10 p-0",
};

export const Button = React.forwardRef(
  ({ className, variant = "primary", size = "md", asChild = false, children, ...props }, ref) => {
    const classes = cn(base, variants[variant], sizes[size], className);
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ref,
        className: cn(classes, children.props.className),
        ...props,
      });
    }
    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { variants as buttonVariants };
