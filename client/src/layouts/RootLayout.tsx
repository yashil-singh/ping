import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar.tsx";
import MobileNavbar from "@/components/MobileNavbar.tsx";
import { cn } from "@/lib/utils.ts";

const RootLayout = () => {
  const location = useLocation();
  const isInbox = location.pathname.includes("/inbox");
  const isChat = location.pathname.includes("/chat");
  return (
    <div className="flex bg-background text-foreground">
      <Navbar />
      <div className="flex flex-col flex-1 bg-background">
        <div
          className={cn(
            "md:h-screen overflow-y-auto",
            !isInbox && "p-4",
            isChat ? "h-screen" : "h-[calc(100vh-50px)]",
          )}
        >
          <Outlet />
        </div>
        {!isChat && <MobileNavbar />}
      </div>
    </div>
  );
};

export default RootLayout;
