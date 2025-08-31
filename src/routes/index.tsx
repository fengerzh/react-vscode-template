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
  component?:
    | React.ComponentType<Record<string, unknown>>
    | React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>>;
  auth?: boolean;
  redirect?: string;
  index?: boolean;
  children?: RouteConfig[];
  name?: string;
  icon?: React.ReactNode;
}

// 权限检查函数
const checkAuth = (): boolean => {
  const cookies = Object.fromEntries(
    document.cookie.split("; ").map((x) => x.split(/=(.*)$/, 2).map(decodeURIComponent)),
  );
  return !!cookies.token;
};

function renderRoutes(configs: RouteConfig[]) {
  const isAuthenticated = checkAuth();

  return configs.map((config) => {
    // 权限拦截
    if (config.auth && !isAuthenticated) {
      return <Route key={config.key || config.path} path={config.path} element={<Navigate to="/user" replace />} />;
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
          key={config.key || config.path}
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
          key={config.key || config.path}
          path={config.path}
          element={<Comp />}
        />
      );
    }
    return null;
  });
}

// 路由组件
function AppRouter() {
  const isAuthenticated = checkAuth();

  return (
    <Suspense
      fallback={(
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
        >
          <Spin size="large" />
        </div>
      )}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {renderRoutes(routerConfig)}
        <Route
          path="*"
          element={(
            <Navigate
              to={isAuthenticated ? "/dashboard/404" : "/exception/404"}
              replace
            />
          )}
        />
      </Routes>
    </Suspense>
  );
}

export default <AppRouter />;
