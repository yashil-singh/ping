import { NavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { buttonVariants } from "@/components/ui/button.tsx";
import AccountAvatar from "@/components/AccountAvatar.tsx";

const Navlink = ({
  name,
  path,
  Icon,
  isMobileNav = false,
}: {
  name: string;
  path: string;
  Icon?: LucideIcon;
  isMobileNav?: boolean;
}) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn(
          buttonVariants({ variant: "ghost" }),
          "w-full xl:justify-start text-base py-3",
          isActive &&
            "bg-accent/60 text-primary md:text-accent-foreground font-semibold",
        )
      }
    >
      {({ isActive }) => (
        <>
          {Icon ? (
            <Icon className="size-6!" />
          ) : (
            <AccountAvatar
              className={cn("size-6", isActive && "ring-2 ring-primary")}
            />
          )}
          {!isMobileNav && <span className="hidden xl:block">{name}</span>}
        </>
      )}
    </NavLink>
  );
};

export default Navlink;
