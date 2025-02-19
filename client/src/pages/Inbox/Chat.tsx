import { Button } from "@/components/ui/button.tsx";
import { ChevronLeft, Ellipsis, Image } from "lucide-react";
import AccountAvatar from "@/components/AccountAvatar.tsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import MessageBubble from "@/components/MessageBubble.tsx";
import messages from "@/assets/data/Messages.ts";
import { format } from "date-fns";
import { chats } from "@/assets/data/Chats.ts";

const Chat = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();

  const user = { id: "user1" };
  const chat = chats[0];
  const chatMember = chat.members[0];

  const [content, setContent] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  function handleContentChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const textarea = e.target;
    setContent(textarea.value);
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  return (
    <>
      <header className="border-b p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => navigate("/inbox")}
          >
            <ChevronLeft className="size-6!" />
          </Button>
          <Link
            to={`/${chatMember.username}`}
            className="flex items-center gap-4"
          >
            <AccountAvatar avatarUrl={chatMember.avatarUrl} />
            <div className="flex flex-col">
              <span className="font-bold">{chatMember.name}</span>
              <span className="text-sm text-muted-foreground">
                {chatMember.username}
              </span>
            </div>
          </Link>
        </div>

        <Button variant="ghost" size="icon" asChild>
          <Link to={`/inbox/chat/${chatId}/more`}>
            <Ellipsis className="size-6!" />
          </Link>
        </Button>
      </header>

      <div className="h-full overflow-y-auto no-scrollbar flex flex-col gap-5">
        <div className="px-2 pt-2 space-y-2 mt-auto w-full">
          <div className="flex flex-col gap-2">
            <div className="w-full flex flex-col gap-5 items-center justify-center py-4">
              <AccountAvatar
                className="size-32"
                avatarUrl={chatMember.avatarUrl}
              />

              <h1 className="font-semibold text-xl">{chatMember.name}</h1>
            </div>
            {messages.map((message, index) => {
              const isSender = message.sender.id === user.id;
              const nextMessage = messages[index + 1];
              const isNextMessageSameUser =
                nextMessage?.sender.id === message.sender.id;
              const prevMessage = messages[index - 1];

              const showDate =
                index === 0 ||
                format(new Date(message.createdAt), "yyyy-MM-dd") !==
                  format(new Date(prevMessage?.createdAt), "yyyy-MM-dd");

              const showAvatar = !isNextMessageSameUser && !isSender;

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  showAvatar={showAvatar}
                  isSender={isSender}
                  showDate={showDate}
                />
              );
            })}
          </div>

          <div ref={chatEndRef} />

          <div className="pb-2 bg-background sticky bottom-0">
            <div className="w-full rounded-xl overflow-hidden border min-h-[48px] flex pr-2">
              <textarea
                placeholder="Message..."
                className="outline-none w-full pt-2.5 pb-1.5 px-4 max-h-[150px] resize-none no-scrollbar"
                rows={1}
                value={content}
                onChange={handleContentChange}
              />
              {content.length > 0 ? (
                <Button variant="ghost" size="icon" className="mb-1 self-end">
                  Send
                </Button>
              ) : (
                <Button variant="ghost" size="icon" className="mb-1 self-end">
                  <Image className="size-5!" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
