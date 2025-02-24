import AccountAvatar from "@/components/AccountAvatar";
import Badge from "@/components/Badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Followers = () => {
  return (
    <div className="mt-4 space-y-5">
      <form className="px-4">
        <Input placeholder="Search..." />
      </form>

      <Link
        to="/follow-requests"
        className="flex items-center gap-4 hover:bg-accent p-4 transition-colors md:rounded-xl"
      >
        <div className="relative">
          <AccountAvatar />
          <Badge className="absolute top-0 right-0">26</Badge>
        </div>

        <div className="flex flex-col text-sm">
          <span>Follow requests</span>
          <span className="text-muted-foreground font-normal">
            Approve or remove requests.
          </span>
        </div>
      </Link>

      <h3 className="font-bold text-xl ml-4">All followers</h3>

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

export default Followers;
