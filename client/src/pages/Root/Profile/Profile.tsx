import AccountAvatar from "@/components/AccountAvatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/authStore";
import { Ellipsis } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { username } = useParams<{ username: string }>();

  const { user } = useAuthStore();
  const { name, username: currentUsername, email, avatarUrl, bio } = user!;

  const [profile, setProfile] = useState([]);

  return (
    <div className="max-w-[1080px] h-full mx-auto md:px-6">
      {/* Account Details */}
      <div className="py-8">
        {/* Avatar */}
        <span>
          <AccountAvatar className="size-20 md:size-40" avatarUrl={avatarUrl} />
        </span>

        {/* Info */}
        <div>
          <div>
            <span>{username}</span>

            {/* Account action buttons */}
            {currentUsername === username ? (
              <Button variant="secondary">Edit Profile</Button>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Button variant="secondary">Follow</Button>
                <Button variant="secondary">Message</Button>
                {/* Options Menu */}
                <Button size="icon" variant="ghost">
                  <Ellipsis />
                </Button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Selector */}
      <div></div>

      {/* Posts */}
      <div></div>
    </div>
  );
};

export default Profile;
