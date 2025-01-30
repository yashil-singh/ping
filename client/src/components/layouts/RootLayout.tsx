import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

const RootLayout = () => {
  return (
    <div className="flex">
      <Navbar />
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
