import AccountAvatar from "@/components/AccountAvatar.tsx";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils.ts";

const MessageBubble = ({
  username,
  content,
  showAvatar,
  isSender,
  showDate,
}: {
  username: string;
  content: string;
  showAvatar: boolean;
  isSender: boolean;
  showDate: boolean;
}) => {
  return (
    <div className="w-full space-y-4">
      {showDate && (
        <p className="text-xs text-center text-muted-foreground">
          14th March, 2025
        </p>
      )}
      <div
        className={cn(
          "flex items-center gap-4 max-w-[80%]",
          isSender && "ml-auto",
        )}
      >
        {!isSender &&
          (showAvatar ? (
            <Link to={`/${username}`}>
              <AccountAvatar className="size-8" />
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
          <div className="flex">
            <div
              className={cn(
                "py-2 px-4 bg-accent text-accent-foreground rounded-3xl text-sm",
                !isSender && "bg-primary text-primary-foreground",
              )}
            >
              <span>{content}</span>
            </div>
          </div>

          <span className="text-xs text-muted-foreground">12:00 AM</span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
