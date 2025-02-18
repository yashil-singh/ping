import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { cn } from "@/lib/utils.ts";
import placeholder from "@/assets/images/avatar-placeholder.png";

const AccountAvatar = ({
  avatarUrl,
  className,
}: {
  avatarUrl?: string;
  className?: string;
}) => {
  const currentUserAvatarUrl =
    "https://i.pinimg.com/736x/7f/34/fe/7f34fe36b7d51c6cd0c7e1c06de94566.jpg";

  return (
    <Avatar className={cn("", className)}>
      <AvatarImage
        src={avatarUrl ?? currentUserAvatarUrl}
        className="object-cover"
      />
      <AvatarFallback>
        <img src={placeholder} />
      </AvatarFallback>
    </Avatar>
  );
};

export default AccountAvatar;
