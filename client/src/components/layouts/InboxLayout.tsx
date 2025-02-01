import { cn } from "@/lib/utils";
import { Outlet, useLocation } from "react-router-dom";

const InboxLayout = () => {
  const location = useLocation();

  const isInbox = location.pathname === "/inbox";

  return (
    <div className="flex">
      <div
        className={cn(
          "md:w-[40%] border-r",
          isInbox ? "w-full" : "max-md:hidden"
        )}
      >
        <div className="h-20 border-b flex items-center px-4">yashil_singh</div>
        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          <div className=""></div>
        </div>
      </div>

      <div className={cn("md:w-[60%]", isInbox ? "max-md:hidden" : "w-full")}>
        <div className="h-20 border-b"></div>
        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default InboxLayout;
