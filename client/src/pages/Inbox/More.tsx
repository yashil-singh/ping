import { ChevronLeft, Image, Repeat2, SquarePlay } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import AccountAvatar from "@/components/AccountAvatar.tsx";
import { useState } from "react";
import { cn } from "@/lib/utils.ts";

const More = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"media" | "shares">("media");
  return (
    <>
      <header className="fluid-container py-4 px-3.5 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="size-6!" />
        </Button>
      </header>

      <div className="flex flex-col items-center h-full overflow-y-auto">
        <div>
          <AccountAvatar className="size-32 md:size-40 mb-5" />
        </div>

        <h1 className="text-xl font-bold font-header">Sangya</h1>

        {/* Switch tabs */}
        <div className="w-full flex items-center justify-center gap-5 mt-8 sticky top-0 bg-background border-b">
          <button
            className={cn(
              "flex items-center justify-center h-[40px] w-full max-w-[200px] cursor-pointer border-b-2",
              tab === "media" ? "" : "border-background",
            )}
            onClick={() => setTab("media")}
          >
            <div className="relative h-full">
              <Image className="size-5 absolute translate-y-[30%] -translate-x-[60%] z-0" />
              <SquarePlay className="size-5 absolute transform translate-y-[60%] -translate-x-[20%] bg-background" />
            </div>
          </button>
          <button
            className={cn(
              "flex items-center justify-center h-[40px] w-full max-w-[200px] cursor-pointer border-b-2",
              tab === "shares" ? "" : "border-background",
            )}
            onClick={() => setTab("shares")}
          >
            <Repeat2 />
          </button>
        </div>

        <div className="fluid-container w-full grid grid-cols-3">
          <div className="aspect-square w-full border">Media</div>

          <div className="aspect-square w-full border">Shares</div>
        </div>
      </div>
    </>
  );
};

export default More;
