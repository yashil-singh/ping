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
  return (
    <Avatar className={cn("", className)}>
      <AvatarImage src={avatarUrl} className="object-cover" />
      <AvatarFallback>
        <img src={placeholder} />
      </AvatarFallback>
    </Avatar>
  );
};

export default AccountAvatar;
