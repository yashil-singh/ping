import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import error from "@/assets/images/404.svg";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-4">
      <h3 className="text-2xl font-medium">Oops!</h3>

      {/* <h1 className="text-8xl font-bold text-primary">404</h1> */}

      <img src={error} className="w-[400px] my-5" />

      <h2 className="text-4xl font-medium mb-4 text-center">Page Not Found</h2>
      <Button onClick={() => navigate(-1)}>Go back</Button>
    </div>
  );
};

export default NotFound;
