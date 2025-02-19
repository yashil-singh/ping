import AccountAvatar from "@/components/AccountAvatar.tsx";
import { cn, formatDateDistanceNoSuffix } from "@/lib/utils.ts";
import { ChatType } from "@/lib/types.ts";

const ChatBox = ({ chat }: { chat: ChatType }) => {
  const user = { id: "user1" };
  const { content, sender, isSeen, createdAt } = chat.messages[0];
  return (
    <div className="flex items-center gap-5 p-4 w-full">
      <AccountAvatar className="size-14" avatarUrl={sender.avatarUrl} />

      <div className={cn(isSeen ? "" : "font-bold")}>
        {/* Name */}
        <span className="text-sm">{sender.name}</span>

        {/* Latest message and time */}
        <div
          className={cn(
            "text-sm space-x-1 flex",
            isSeen && "text-muted-foreground",
          )}
        >
          {/* Message */}
          <span className="line-clamp-1 text-ellipsis">
            {sender.id === user.id ? "You" : sender.name}: {content}
          </span>
          <span>·</span>
          {/* Time */}
          <span>{formatDateDistanceNoSuffix(createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
