import logo from "@/assets/images/logo.png";
import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return <img src={logo} className={cn("object-contain", className)} />;
};

export default Logo;
