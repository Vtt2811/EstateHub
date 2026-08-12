import HomePage from "./routes/homePage/homePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ListPage from "./routes/listPage/listPage";
import { Layout, RequireAuth, RequireAdmin } from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import VerifyEmailPage from "./routes/verifyEmail/VerifyEmailPage";
import UpdateEmailPage from "./routes/updateEmail/UpdateEmailPage";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import NewPostPage from "./routes/newPostPage/newPostPage";
import {
  listPageLoader,
  profilePageLoader,
  singlePageLoader,
} from "./lib/loaders";
import UpdatePostPage from "./routes/updatePostPage/updatePostPage";
import AdminDashboard from "./routes/adminDashboard/adminDashboard";
import ComparePage from "./routes/comparePage/comparePage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/list",
          element: <ListPage />,
          loader: listPageLoader,
        },
        {
          path: "/:id",
          element: <SinglePage />,
          loader: singlePageLoader,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/verify-email",
          element: <VerifyEmailPage />,
        },
        {
          path: "/update-email",
          element: <UpdateEmailPage />,
        },
        {
          // Compare is public — no login required
          path: "/compare",
          element: <ComparePage />,
        },
      ],
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/profile",
          element: <ProfilePage />,
          loader: profilePageLoader,
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />,
        },
        {
          path: "/add",
          element: <NewPostPage />,
        },
        {
          path: "/posts/update/:id",
          element: <UpdatePostPage />,
        },
      ],
    },
    {
      path: "/",
      element: <RequireAdmin />,
      children: [
        {
          path: "/admin",
          element: <AdminDashboard />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
