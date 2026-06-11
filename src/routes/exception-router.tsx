import { lazy } from "react";

const UserLayout = lazy(() => import("@/layout/UserLayout"));
const NotFound = lazy(() => import("@/pages/Exception/404"));

export default [
  {
    path: "/exception",
    key: "exception",
    component: UserLayout,
    auth: false,
    children: [
      {
        index: true,
        key: "exception-redirect",
        redirect: "/exception/404",
      },
      {
        name: "404",
        path: "404",
        key: "404",
        component: NotFound,
      },
    ],
  },
];
