import { RouterProvider } from "react-router-dom";
import { router } from "@/app/config/router";

export const RouterDomProvider = () => {
  return <RouterProvider router={router} />;
};
