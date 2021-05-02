import { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Spin } from 'antd';
import userRouterConfig from './user-router';
import commonRouterConfig from './common-router';

const routerConfig = [
  ...userRouterConfig,
  ...commonRouterConfig,
];

function getRouteByConfig() {
  const cookies = Object.fromEntries(document.cookie.split('; ').map((x) => x.split(/=(.*)$/, 2).map(decodeURIComponent)));

  const route = routerConfig.map(
    (config) => (
      <Route
        key={config.key}
        path={config.path}
        exact={false}
        render={({ location, ...props }) => {
          if (config.auth && !cookies.token) {
            return (
              <Redirect
                to={{
                  pathname: '/user',
                  state: { from: location },
                }}
              />
            );
          }
          return (config.component ? (
            <config.component
            // eslint-disable-next-line
            {...props}
              routes={config.routes}
            />
          ) : (
            <Redirect
              to={{
                pathname: config.redirect,
                state: { from: location },
              }}
            />
          ));
        }}
      />
    ),
  );
  return route;
}

export default (
  <Suspense fallback={<Spin spinning />}>
    <Switch>
      {getRouteByConfig()}
    </Switch>
  </Suspense>
);
