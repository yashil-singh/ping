import AccountAvatar from "@/components/AccountAvatar.tsx";
import { cn } from "@/lib/utils.ts";

const ChatBox = ({ isSeen }: { isSeen: boolean }) => {
  return (
    <div className="flex items-center gap-5 p-4 w-full">
      <AccountAvatar className="size-14" />

      <div className={cn(isSeen ? "" : "font-bold")}>
        {/* Name */}
        <span className="text-sm">Sangya</span>

        {/* Latest message and time */}
        <div
          className={cn(
            "text-sm space-x-1 flex",
            isSeen && "text-muted-foreground",
          )}
        >
          {/* Message */}
          <span className="line-clamp-1 text-ellipsis">You: Hey</span>
          <span>·</span>
          {/* Time */}
          <span>15m</span>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
