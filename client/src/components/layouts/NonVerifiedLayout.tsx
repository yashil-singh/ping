import { useAuthStore } from "@/lib/store/authStore";
import { Navigate, Outlet } from "react-router-dom";

const NonVerifiedLayout = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-12 px-4">
      <Outlet />
    </div>
  );
};

export default NonVerifiedLayout;
