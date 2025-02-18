import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

const Inbox = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-5">
      <MessageCircle className="size-20" />

      <span className="text-center">
        <h1 className="font-bold text-2xl">Your messages</h1>
        <p className="text-muted-foreground text-sm">
          Send a message or start a chat.
        </p>
      </span>

      <Button>Send a message</Button>
    </div>
  );
};

export default Inbox;
