import { Outlet, useLocation, useRouteError } from "react-router-dom";
import Navbar from "@/components/Navbar.tsx";
import MobileNavbar from "@/components/MobileNavbar.tsx";
import { cn } from "@/lib/utils.ts";
import NotFound from "@/pages/NotFound.tsx";

const RootLayout = () => {
  const location = useLocation();
  const isChat = location.pathname.includes("/chat");

  const isError = useRouteError();

  if (isError)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <NotFound />
      </div>
    );

  return (
    <div className="flex bg-background text-foreground">
      <Navbar />
      <div className="flex flex-col flex-1 bg-background">
        <div
          className={cn(
            "md:h-screen overflow-y-auto",
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
