import React, { Suspense, useEffect, useMemo } from 'react';
import {
  Routes, Route, Navigate, useLocation, Outlet,
} from 'react-router-dom';
import { Spin } from 'antd';
import useUserStore from '@/store';
import userRouterConfig from './user-router';
import commonRouterConfig from './common-router';
import exceptionRouterConfig from './exception-router';

const routerConfig = [
  ...exceptionRouterConfig,
  ...userRouterConfig,
  ...commonRouterConfig,
];

interface RouteConfig {
  path?: string;
  key?: string;
  component?:
    | React.ComponentType<Record<string, unknown>>
    | React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>>;
  auth?: boolean;
  guest?: boolean;
  redirect?: string;
  index?: boolean;
  children?: RouteConfig[];
  name?: string;
  icon?: React.ReactNode;
}

// 初始化认证状态（只调用一次 getSession）
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initAuth = useUserStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return children as React.ReactElement;
}

interface AuthGuardProps {
  children: React.ReactNode;
  auth: boolean;
  guest: boolean;
}

function AuthGuard({ children, auth = false, guest = false }: AuthGuardProps) {
  const location = useLocation();
  const authed = useUserStore((s) => s.authed);

  if (authed === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (auth && !authed) {
    return <Navigate to="/user" replace state={{ from: location }} />;
  }

  if (guest && authed) {
    return <Navigate to="/dashboard/home" replace />;
  }

  return children as React.ReactElement;
}

function renderRoutes(configs: RouteConfig[]) {
  return configs.map((config) => {
    if (config.redirect) {
      return (
        <Route
          key={config.key || config.redirect}
          {...(config.index ? { index: true } : { path: config.path })}
          element={<Navigate to={config.redirect} replace />}
        />
      );
    }
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

function AppRouter() {
  const authed = useUserStore((s) => s.authed);

  return (
    <Suspense
      fallback={(
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
              to={authed ? '/dashboard/404' : '/exception/404'}
              replace
            />
          )}
        />
      </Routes>
    </Suspense>
  );
}

// 在顶层用 AuthInitializer 包裹，确保 getSession 只调用一次
export default (
  <AuthInitializer>
    <AppRouter />
  </AuthInitializer>
);
