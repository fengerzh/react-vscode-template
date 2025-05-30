import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Spin } from "antd";
import userRouterConfig from "./user-router";
import commonRouterConfig from "./common-router";
import exceptionRouterConfig from "./exception-router";

const routerConfig = [
  ...exceptionRouterConfig,
  ...userRouterConfig,
  ...commonRouterConfig,
];

// 路由配置类型定义
interface RouteConfig {
  path?: string;
  key?: string;
  component?: React.ComponentType<unknown>;
  auth?: boolean;
  redirect?: string;
  index?: boolean;
  children?: RouteConfig[];
}

function renderRoutes(configs: RouteConfig[]) {
  const cookies = Object.fromEntries(document.cookie.split("; ").map((x) => x.split(/=(.*)$/, 2).map(decodeURIComponent)));
  return configs.map((config) => {
    // 权限拦截
    if (config.auth && !cookies.token) {
      return <Route key={config.key} path={config.path} element={<Navigate to="/user" replace />} />;
    }
    // 重定向
    if (config.redirect) {
      if (config.index) {
        return (
          <Route
            key={config.key || config.redirect}
            index
            element={<Navigate to={config.redirect} replace />}
          />
        );
      }
      return (
        <Route
          key={config.key || config.redirect}
          path={config.path}
          element={<Navigate to={config.redirect} replace />}
        />
      );
    }
    // 嵌套路由
    if (config.children && config.children.length > 0) {
      const Comp = config.component;
      return (
        <Route
          key={config.key}
          path={config.path}
          element={Comp ? <Comp /> : undefined}
        >
          {renderRoutes(config.children)}
        </Route>
      );
    }
    // 普通路由
    if (config.component) {
      const Comp = config.component;
      return (
        <Route
          key={config.key}
          path={config.path}
          element={<Comp />}
        />
      );
    }
    return null;
  });
}

export default (
  <Suspense
    fallback={(
      <Spin size="large" spinning style={{ margin: "auto" }} />
    )}
  >
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      {renderRoutes(routerConfig)}
      <Route path="*" element={<Navigate to="/exception/404" replace />} />
    </Routes>
  </Suspense>
);
