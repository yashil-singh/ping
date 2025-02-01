import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "@/pages/Auth/Login";
import AuthLayout from "./components/layouts/AuthLayout";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import RootLayout from "./components/layouts/RootLayout";
import Home from "./pages/Root/Home";
import Profile from "./pages/Root/Profile/Profile";
import ResetPassword from "./pages/Auth/ResetPassword";
import NotFound from "./pages/NotFound";
import Inbox from "./pages/Root/Inbox/Inbox";
import Notifications from "./pages/Root/Notifications";
import Create from "./pages/Root/Create";
import Discover from "./pages/Root/Discover";
import Settings from "./pages/Root/Profile/Settings";
import InboxLayout from "./components/layouts/InboxLayout";
import Chat from "./pages/Root/Inbox/Chat";
import { useAuthStore } from "./lib/store/authStore";
import { useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";
import NonVerifiedLayout from "./components/layouts/NonVerifiedLayout";
import VerifyAccount from "./pages/Auth/VerifyAccount";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/profile/settings",
        element: <Settings />,
      },
      {
        path: "/create",
        element: <Create />,
      },
      {
        path: "/discover",
        element: <Discover />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
      {
        path: "/inbox",
        element: <InboxLayout />,
        children: [
          {
            index: true,
            element: <Inbox />,
          },
          {
            path: "chat/:id",
            element: <Chat />,
          },
        ],
      },
      {
        path: "/:username",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/verify-account",
    element: <NonVerifiedLayout />,
    children: [
      {
        index: true,
        element: <VerifyAccount />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
      },
    ],
  },
]);

function App() {
  const { fetchUser, isLoading } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
