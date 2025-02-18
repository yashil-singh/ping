import pingLogo from "@/assets/images/logo.png";
import { cn } from "@/lib/utils.ts";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <span>
      <img
        src={pingLogo}
        alt="logo"
        className={cn("object-contain", className)}
      />
    </span>
  );
};

export default Logo;
