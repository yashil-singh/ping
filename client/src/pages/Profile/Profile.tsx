import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import AccountAvatar from "@/components/AccountAvatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { Bookmark, Grid3X3, Lock } from "lucide-react";

const Profile = () => {
  const { username } = useParams();
  const location = useLocation();

  const currentUsername = "yaashil.s";
  const isPrivate = false;
  const isFollowing = false;
  const canViewProfile = !isPrivate || (isPrivate && isFollowing);
  console.log(canViewProfile);
  return (
    <div className="fluid-container flex flex-col h-full">
      <header className="flex p-4">
        <h1 className="font-bold text-2xl">{username}</h1>
      </header>

      <div className="space-y-4 p-4">
        <div className="flex items-center gap-4 md:gap-20">
          <AccountAvatar className="size-20 md:size-40" />

          <div className="flex-1 grid grid-cols-3 gap-4">
            <Button
              className="flex-col gap-0 p-3 md:max-w-[100px]"
              variant="ghost"
            >
              <span className="md:text-lg">4</span>
              <span>posts</span>
            </Button>
            <Button
              className="flex-col gap-0 p-3 md:max-w-[100px]"
              variant="ghost"
            >
              <span className="md:text-lg">832</span>
              <span>followers</span>
            </Button>
            <Button
              className="flex-col gap-0 p-3 md:max-w-[100px]"
              variant="ghost"
            >
              <span className="md:text-lg">640</span>
              <span>following</span>
            </Button>
          </div>
        </div>

        <span className="font-medium">Yashil</span>

        <p>{"ys<3"}</p>

        <div className="flex gap-2">
          {currentUsername === username ? (
            <>
              <Button variant="outline" className="flex-1" asChild>
                <Link to="/settings">Edit Profile</Link>
              </Button>
              <Button variant="outline" className="flex-1">
                Share Profile
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={isFollowing ? "outline" : "default"}
                className="flex-1"
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
              {canViewProfile && (
                <Button variant="outline" className="flex-1" asChild>
                  <Link to={`/inbox/chat/chat1`}>Message</Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Switch tabs */}
      {canViewProfile ? (
        <>
          <div className="flex items-center justify-center gap-5 px-5 sticky top-0 bg-background mb-0.5 mt-4">
            <Link
              to={`/${username}`}
              className={cn(
                "flex items-center justify-center h-[40px] w-full max-w-[150px] cursor-pointer",
                location.pathname === `/${username}` &&
                  "border-b border-foreground",
              )}
            >
              <Grid3X3 />
            </Link>
            <Link
              to={`/${username}/saved`}
              className={cn(
                "flex items-center justify-center h-[40px] w-full max-w-[150px] cursor-pointer",
                location.pathname.includes("saved") &&
                  "border-b border-foreground",
              )}
            >
              <Bookmark />
            </Link>
          </div>
          <Outlet />
        </>
      ) : (
        <div className="flex flex-col gap-5 items-center justify-center h-full">
          <Lock className="size-14" />
          <span className="text-lg font-medium text-center">
            This account is private.
          </span>
        </div>
      )}
    </div>
  );
};

export default Profile;
