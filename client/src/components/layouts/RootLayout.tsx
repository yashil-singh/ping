import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import { useAuthStore } from "@/lib/store/authStore";

const RootLayout = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-account" replace />;
  }

  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
