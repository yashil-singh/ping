import {
  Compass,
  Heart,
  Home,
  LogOut,
  LucideIcon,
  Menu,
  MessageCircle,
  PlusCircle,
  Settings,
} from "lucide-react";
import Logo from "./Logo";
import { Link, NavLink } from "react-router-dom";
import { Button, buttonVariants } from "./ui/button";
import BrandIcon from "./BrandIcon";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import { useAuthStore } from "@/lib/store/authStore";
import avatarPlaceholder from "@/assets/images/avatar-placeholder.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type IconProps = {
  Icon: LucideIcon;
  size?: number;
  className?: string;
};

const NavIcon = ({ Icon, size = 24, className }: IconProps) => {
  return <Icon size={size} className={className} />;
};

const Navbar = () => {
  const { user, logout } = useAuthStore();

  const links = [
    {
      name: "Home",
      icon: Home,
      isIcon: true,
      path: "/",
    },
    {
      name: "Discover",
      icon: Compass,
      isIcon: true,
      path: "/discover",
    },
    {
      name: "Create",
      icon: PlusCircle,
      isIcon: true,
      path: "/create",
    },
    {
      name: "Messages",
      icon: MessageCircle,
      isIcon: true,
      path: "/inbox",
    },
    {
      name: "Notifications",
      icon: Heart,
      isIcon: true,
      path: "/notifications",
    },
    {
      name: "Profile",
      icon: (
        <Avatar className="size-6">
          <AvatarImage src={user?.avatarUrl} />
          <AvatarFallback>
            <img src={avatarPlaceholder} />
          </AvatarFallback>
        </Avatar>
      ),
      isIcon: false,
      path: `/${user?.username}`,
    },
  ];

  return (
    <nav className="bg-background max-md:border-t md:border-r md:w-[80px] lg:w-[280px] md:h-screen fixed bottom-0 left-0 right-0 md:sticky md:top-0">
      <div className="w-full h-full flex flex-col justify-between">
        <div>
          <div className="pt-8 px-2 md:px-4 hidden md:block">
            <Link to="/">
              <Logo className="h-10 hidden lg:block" />
              <BrandIcon className="h-10 mx-auto lg:hidden" />
            </Link>
          </div>

          <div className="px-4 max-md:py-2 md:pt-8 flex md:flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `w-full flex items-center justify-center md:justify-start gap-2 px-3 py-3 rounded transition-colors hover:bg-accent hover:text-accent-foreground active:opacity-50 ${
                    isActive ? "bg-accent/50 font-semibold" : ""
                  }`
                }
              >
                {link.isIcon ? <NavIcon Icon={link.icon} /> : <>{link.icon}</>}
                <span className="hidden lg:block">{link.name}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="pb-8 px-4 hidden md:block">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="w-full lg:justify-start py-6" variant="ghost">
                <Menu className="!size-6" />
                <span className="hidden lg:block">More</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="space-y-2">
              <Link
                to="/profile/settings"
                className="w-full flex items-center justify-center md:justify-start gap-2 px-3 py-3 rounded transition-colors hover:bg-accent hover:text-accent-foreground active:opacity-50"
              >
                <Settings />
                Settings
              </Link>
              <Separator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full lg:justify-start py-6"
                    variant="ghost"
                  >
                    <LogOut className="!size-6" />
                    <span className="hidden lg:block">Logout</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to logout?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You will have to re-enter your username and password to
                      login.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className={buttonVariants({ variant: "destructive" })}
                      onClick={logout}
                    >
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
