import React from "react";
import { cn } from "../../lib/utils";

export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("panel rounded-xl", className)} {...props} />
));
Card.displayName = "Card";

export const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />
);
export const CardTitle = ({ className, ...props }) => (
  <h3 className={cn("text-lg font-semibold text-foreground", className)} {...props} />
);
export const CardDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);
export const CardContent = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);
export const CardFooter = ({ className, ...props }) => (
  <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
);
