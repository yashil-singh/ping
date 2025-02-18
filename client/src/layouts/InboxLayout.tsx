import { NavLink, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { SquarePen } from "lucide-react";
import ChatBox from "@/components/ChatBox.tsx";

const InboxLayout = () => {
  const location = useLocation();
  const isInbox = location.pathname === "/inbox";
  return (
    <div className="flex h-full">
      <div
        className={cn(
          "border-r flex flex-col gap-4 md:w-[300px] xl:w-[400px]",
          isInbox ? "w-full" : "max-md:hidden",
        )}
      >
        <header className="border-b p-4 flex items-center justify-between">
          <span className="font-bold text-xl">yaashil.s</span>

          <Button variant="ghost" size="icon">
            <SquarePen className="size-6!" />
          </Button>
        </header>

        <h1 className="font-bold text-lg ml-4">Messages</h1>

        <div className="h-full overflow-y-auto">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
            (value) => (
              <NavLink
                key={`chat-${value}`}
                to={`/inbox/chat/${value}`}
                className={({ isActive }) =>
                  cn(
                    "hover:bg-accent transition-colors duration-150 flex",
                    isActive && "bg-accent/60",
                  )
                }
              >
                <ChatBox isSeen={value % 3 === 0} />
              </NavLink>
            ),
          )}
        </div>
      </div>
      <div className={cn("flex-1 flex flex-col", isInbox && "max-md:hidden")}>
        <Outlet />
      </div>
    </div>
  );
};

export default InboxLayout;
