import { Compass, Home, PlusCircle, MessageCircle, Heart } from "lucide-react";
import Navlink from "@/components/Navlink.tsx";

const Navlinks = () => {
  const links = [
    {
      name: "Home",
      path: "/",
      Icon: Home,
    },
    {
      name: "Discover",
      path: "/discover",
      Icon: Compass,
    },
    {
      name: "Create",
      path: "/create",
      Icon: PlusCircle,
    },
    {
      name: "Notifications",
      path: "/notifications",
      Icon: Heart,
    },
    {
      name: "Messages",
      path: "/inbox",
      Icon: MessageCircle,
    },
    {
      name: "Profile",
      path: "yaashil.s",
    },
  ];

  return (
    <>
      {links.map((link) => (
        <Navlink
          key={`navlinks-${link.name}`}
          name={link.name}
          path={link.path}
          Icon={link.Icon}
        />
      ))}
    </>
  );
};

export default Navlinks;
