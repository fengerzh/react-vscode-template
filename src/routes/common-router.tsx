import { lazy } from "react";
import { HomeOutlined, SettingOutlined } from "@ant-design/icons";

const BasicLayout = lazy(() => import("@/layout/BasicLayout"));
const Home = lazy(() => import("@/pages/home"));
const Settings = lazy(() => import("@/pages/Settings"));
const NotFound = lazy(() => import("@/pages/Exception/404"));

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
      // 添加404子路由，在已登录状态下显示404页面
      {
        name: "404",
        path: "404",
        key: "dashboard-404",
        component: NotFound,
      },
      // 添加通配符路由处理未匹配的子路由，重定向到dashboard下的404页面
      {
        path: "*",
        key: "dashboard-wildcard",
        redirect: "/dashboard/404",
      },
    ],
  },
  {
    path: "/",
    key: "root",
    redirect: "/dashboard",
  },
];
