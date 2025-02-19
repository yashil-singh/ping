import Logo from "@/components/Logo.tsx";
import { Link } from "react-router-dom";
import Navlinks from "@/components/Navlinks.tsx";
import PingIcon from "@/components/PingIcon.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button.tsx";
import { LogOut, Menu, Settings, Sun } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Navbar = () => {
  return (
    <nav className="w-[60px] xl:w-[300px] border-r bg-background hidden md:flex px-1 xl:px-4 py-8 flex-col justify-between">
      <div>
        <Link to="/">
          <Logo className="h-10 hidden xl:block" />
          <PingIcon className="h-8 xl:hidden mx-auto" />
        </Link>
        <div className="mt-4 space-y-1">
          <Navlinks />
        </div>
      </div>

      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="w-full py-3 xl:justify-start font-normal text-base"
            >
              <Menu className="size-6!" />
              <span className="hidden xl:block">More</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-2 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start py-3"
              asChild
            >
              <Link to="/settings">
                <Settings className="size-5!" />
                Settings
              </Link>
            </Button>
            <Button variant="ghost" className="w-full py-3 justify-start">
              <Sun className="size-5!" /> Switch Appearance
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="w-full py-3 justify-start">
                  <LogOut className="size-5!" /> Logout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>You are logging out</DialogTitle>
                  <DialogDescription>
                    You will need to re-enter your username and password to
                    login.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="justify-end">
                  <DialogClose asChild>
                    <Button type="button" variant="ghost">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="button" variant="destructive">
                    Logout
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
};

export default Navbar;
