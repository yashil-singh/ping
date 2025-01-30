import icon from "@/assets/images/icon.png";
import { cn } from "@/lib/utils";

const BrandIcon = ({ className }: { className?: string }) => {
  return <img src={icon} className={cn("object-contain", className)} />;
};

export default BrandIcon;
