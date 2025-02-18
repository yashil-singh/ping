import pingIcon from "@/assets/images/icon.png";
import { cn } from "@/lib/utils.ts";

export const PingIcon = ({ className }: { className?: string }) => {
  return (
    <span>
      <img
        src={pingIcon}
        alt="logo"
        className={cn("object-contain", className)}
      />
    </span>
  );
};

export default PingIcon;
