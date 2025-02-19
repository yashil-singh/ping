import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import notFound from "@/assets/images/404.svg";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col lg:flex-row lg:gap-12">
        <h1 className="font-bold text-5xl md:text-[144px]">404</h1>
        <h1 className="font-bold text-4xl md:text-6xl text-left leading-snug">
          we couldn't find <br /> that page.
        </h1>
      </div>

      <img src={notFound} className="object-contain h-[350px] mx-auto mb-5" />

      <Button className="w-full md:w-fit">
        <Link to="/">Go to Homepage</Link>
      </Button>
    </div>
  );
};

export default NotFound;
