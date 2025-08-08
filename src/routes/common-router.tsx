import { lazy } from "react";
import { HomeOutlined, SettingOutlined } from "@ant-design/icons";

const BasicLayout = lazy(() => import("@/layout/BasicLayout"));
const Home = lazy(() => import("@/pages/home"));
const Settings = lazy(() => import("@/pages/Settings"));

export default [
  {
    path: "/dashboard/*",
    key: "dashboard",
    component: BasicLayout,
    auth: true,
    children: [
      {
        index: true,
        redirect: "home",
      },
      {
        name: "首页",
        path: "home",
        key: "home",
        icon: <HomeOutlined />,
        component: Home,
      },
      {
        name: "个人设置",
        path: "settings",
        key: "settings",
        icon: <SettingOutlined />,
        component: Settings,
      },
    ],
  },
  {
    path: "/",
    key: "root",
    redirect: "/dashboard",
  },
];
