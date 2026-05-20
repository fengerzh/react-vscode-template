import React, { Suspense, useMemo } from 'react';
import {
  Routes, Route, Navigate, useLocation, Outlet,
} from 'react-router-dom';
import { Spin } from 'antd';
import { supabase } from '@/lib/supabase';
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

// 用 Supabase session 检查认证状态
function useAuth(): boolean | null {
  const [authed, setAuthed] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => setAuthed(!!session))
      .catch(() => setAuthed(false)); // CI 环境无 Supabase → 视为未登录
  }, []);
  return authed;
}

interface AuthGuardProps {
  children: React.ReactNode;
  auth: boolean;
  guest: boolean;
}

function AuthGuard({ children, auth = false, guest = false }: AuthGuardProps) {
  const location = useLocation();
  const isAuthenticated = useAuth();

  if (isAuthenticated === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (auth && !isAuthenticated) {
    return <Navigate to="/user" replace state={{ from: location }} />;
  }

  if (guest && isAuthenticated) {
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
  const location = useLocation();
  const isAuthenticated = useAuth();

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
              to={isAuthenticated ? '/dashboard/404' : '/exception/404'}
              replace
            />
          )}
        />
      </Routes>
    </Suspense>
  );
}

export default <AppRouter />;