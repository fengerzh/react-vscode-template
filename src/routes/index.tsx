import React, { Suspense, useMemo } from "react";
import {
  Routes, Route, Navigate, useLocation, Outlet,
} from "react-router-dom";
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
  guest?: boolean; // 游客页面，已登录用户自动跳转
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

// 认证守卫组件
interface AuthGuardProps {
  children: React.ReactNode;
  auth: boolean;
  guest: boolean; // 用于登录页，已登录用户自动跳转
}

function AuthGuard({ children, auth = false, guest = false }: AuthGuardProps) {
  const location = useLocation();

  // 每次渲染都直接读取 cookie，确保获取最新状态
  const isAuthenticated = checkAuth();

  // 需要登录但未登录，跳转到登录页
  if (auth && !isAuthenticated) {
    return <Navigate to="/user" replace state={{ from: location }} />;
  }

  // 游客页面（如登录页），已登录用户自动跳转到首页
  if (guest && isAuthenticated) {
    return <Navigate to="/dashboard/home" replace />;
  }

  return children as React.ReactElement;
}

function renderRoutes(configs: RouteConfig[]) {
  return configs.map((config) => {
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
          element={(
            <AuthGuard auth={config.auth ?? false} guest={config.guest ?? false}>
              {Comp ? <Comp /> : <Outlet />}
            </AuthGuard>
          )}
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
          element={(
            <AuthGuard auth={config.auth ?? false} guest={config.guest ?? false}>
              <Comp />
            </AuthGuard>
          )}
        />
      );
    }
    return null;
  });
}

// 路由组件
function AppRouter() {
  const location = useLocation();
  const isAuthenticated = useMemo(() => checkAuth(), [location.pathname]);

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
