import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout.tsx";
import Home from "@/pages/Home.tsx";
import Profile from "@/pages/Profile.tsx";
import Inbox from "@/pages/Inbox/Inbox.tsx";
import InboxLayout from "@/layouts/InboxLayout.tsx";
import Chat from "@/pages/Inbox/Chat.tsx";
import Discover from "@/pages/Discover.tsx";
import Create from "@/pages/Create.tsx";
import Notification from "@/pages/Notification.tsx";
import Settings from "@/pages/Settings.tsx";
import More from "@/pages/Inbox/More.tsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/discover",
          element: <Discover />,
        },
        {
          path: "/create",
          element: <Create />,
        },
        {
          path: "/notifications",
          element: <Notification />,
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
              path: "chat/:chatId",
              children: [
                {
                  index: true,
                  element: <Chat />,
                },
                {
                  path: "more",
                  element: <More />,
                },
              ],
            },
          ],
        },
        {
          path: "/settings",
          element: <Settings />,
        },
        {
          path: "/:username",
          element: <Profile />,
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
