import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center py-12 px-4">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
