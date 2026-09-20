import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import AuthProtect from "./AuthProtect";
import AuthLayout from "../layout/AuthLayout";
import MainProtect from "./MainProtect";
import MainLayout from "../layout/MainLayout";

const Login = lazy(() => import("../auth/ui/pages/Login"));
const Register = lazy(() => import("../auth/ui/pages/Register"));
const MainPage = lazy(() => import("../main/ui/pages/MainPage"));

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <AuthProtect />,
    children: [
      {
        path: "",
        element: <AuthLayout />,
        children: [
          {
            path: "",
            element: <Login />,
          },
          {
            path: "/register",
            element: <Register />,
          },
        ],
      },
    ],
  },
  {
    path: "/home",
    element: <MainProtect />,
    children: [
      {
        path: "",
        element: <MainLayout />,
        children: [
          {
            path: "",
            element: <MainPage />,
          },
        ],
      },
    ],
  },
]);