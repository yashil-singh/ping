import AccountAvatar from "@/components/AccountAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Following = () => {
  return (
    <div className="mt-4 space-y-5">
      <form className="px-4">
        <Input placeholder="Search..." />
      </form>

      <h3 className="font-bold text-xl ml-4">All followings</h3>

      <div>
        <Link
          to={`/yaashil.s`}
          className="flex items-center justify-between gap-4 p-4 md:rounded-xl"
        >
          <div className="flex items-center gap-4">
            <AccountAvatar />

            <div className="flex flex-col text-sm">
              <span>sangyavaidya</span>
              <span className="text-muted-foreground font-normal">Sangya</span>
            </div>
          </div>

          <Link to={`/inbox/chat/chat1`}>
            <Button>Message</Button>
          </Link>
        </Link>
      </div>
    </div>
  );
};

export default Following;
