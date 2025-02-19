import AccountAvatar from "@/components/AccountAvatar.tsx";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils.ts";
import { MessageType } from "@/lib/types.ts";
import { format } from "date-fns";

const MessageBubble = ({
  message,
  showAvatar,
  isSender,
  showDate,
}: {
  message: MessageType;
  showAvatar: boolean;
  isSender: boolean;
  showDate: boolean;
}) => {
  const { content, sender, createdAt, updatedAt } = message;
  const { username, avatarUrl } = sender;
  return (
    <div className="w-full space-y-4">
      {showDate && (
        <p className="text-xs text-center text-muted-foreground">
          {format(createdAt, "do MMM, yyyy")}
        </p>
      )}
      <div className={cn("flex gap-4 max-w-[80%]", isSender && "ml-auto")}>
        {!isSender &&
          (showAvatar ? (
            <Link to={`/${username}`} className="mt-1">
              <AccountAvatar className="size-8" avatarUrl={avatarUrl} />
            </Link>
          ) : (
            <div className="size-8" />
          ))}
        <div
          className={cn(
            "flex flex-col gap-2",
            isSender ? "items-end ml-auto" : "",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-1",
              isSender && "flex-row-reverse",
            )}
          >
            <div
              className={cn(
                "py-2 px-4 bg-primary text-primary-foreground rounded-3xl text-sm",
                isSender && "bg-accent text-accent-foreground",
              )}
            >
              <span>{content}</span>
            </div>
            {createdAt !== updatedAt && (
              <span className="text-xs text-muted-foreground">(Edited)</span>
            )}
          </div>

          <span className="text-xs text-muted-foreground">
            {format(createdAt, "h:mm a")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
