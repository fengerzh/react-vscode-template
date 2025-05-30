import { lazy } from "react";

const UserLayout = lazy(() => import("@/layout/UserLayout"));
const NotFound = lazy(() => import("@/pages/Exception/404"));

export default [
  {
    path: "/exception",
    key: "exception",
    component: UserLayout,
    auth: false,
    routes: [
      {
        path: "/exception",
        key: "exception",
        redirect: "/exception/404",
      },
      {
        name: "404",
        path: "/exception/404",
        key: "404",
        component: NotFound,
      },
    ],
  },
];
