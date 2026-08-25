import { Toaster as Sonner } from "sonner";

// Themed to the DNS design tokens; dark-only.
export function Toaster(props) {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:rounded-lg group-[.toaster]:shadow-[var(--shadow-elev-2)]",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-md",
          cancelButton: "group-[.toast]:bg-secondary group-[.toast]:text-muted-foreground group-[.toast]:rounded-md",
          success: "group-[.toaster]:[&_svg]:text-success",
          error: "group-[.toaster]:[&_svg]:text-destructive",
        },
      }}
      {...props}
    />
  );
}
