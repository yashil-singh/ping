import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout.tsx";
import Home from "@/pages/Home.tsx";
import Profile from "@/pages/Profile/Profile.tsx";
import Inbox from "@/pages/Inbox/Inbox.tsx";
import InboxLayout from "@/layouts/InboxLayout.tsx";
import Chat from "@/pages/Inbox/Chat.tsx";
import Discover from "@/pages/Discover.tsx";
import Create from "@/pages/Create.tsx";
import Notification from "@/pages/Notification.tsx";
import Settings from "@/pages/Settings.tsx";
import More from "@/pages/Inbox/More.tsx";
import NotFound from "@/pages/NotFound.tsx";
import Posts from "@/pages/Profile/Posts.tsx";
import Saved from "@/pages/Profile/Saved.tsx";
import Followers from "./pages/Profile/Followers";
import Following from "./pages/Profile/Following";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: (
        <div className="h-screen w-full flex items-center justify-center p-4 overflow-y-auto">
          <NotFound />
        </div>
      ),
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
          children: [
            {
              index: true,
              element: <Posts />,
            },
            {
              path: "saved",
              element: <Saved />,
            },
            {
              path: "followers",
              element: <Followers />,
            },
            {
              path: "following",
              element: <Following />,
            },
          ],
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
