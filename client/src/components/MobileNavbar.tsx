import Navlinks from "@/components/Navlinks.tsx";

export const MobileNavbar = () => {
  return (
    <nav className="flex border bg-background z-10 md:hidden rounded-tl-2xl rounded-tr-2xl overflow-hidden">
      <Navlinks />
    </nav>
  );
};

export default MobileNavbar;
