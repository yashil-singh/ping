import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import avatarPlaceholder from "@/assets/images/avatar-placeholder.png";

const AccountAvatar = ({
  avatarUrl,
  className,
}: {
  avatarUrl?: string;
  className?: string;
}) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={avatarUrl} />
      <AvatarFallback>
        <img src={avatarPlaceholder} />
      </AvatarFallback>
    </Avatar>
  );
};

export default AccountAvatar;
