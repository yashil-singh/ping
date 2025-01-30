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
        path: "/profile/:username",
        element: <Profile />,
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
        children: [
          {
            index: true,
            element: <Inbox />,
          },
        ],
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
        path: "/reset-password",
        element: <ResetPassword />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
