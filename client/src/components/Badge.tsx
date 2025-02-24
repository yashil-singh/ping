import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const Badge = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "bg-destructive text-destructive-foreground font-bold rounded-full size-4 flex items-center justify-center text-[10px]",
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
