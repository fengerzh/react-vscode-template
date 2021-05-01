import { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import {Spin} from 'antd'
import userRouterConfig from './user-router';
import commonRouterConfig from './common-router';

const routerConfig = [
  ...userRouterConfig,
  ...commonRouterConfig,
];

function getRouteByConfig() {
  const route = routerConfig.map(
    (config) => (
      <Route
        key={config.key}
        path={config.path}
        exact={false}
        render={({ location, ...props }) => (config.component ? (
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
        ))}
      />
    ),
  );
  return route;
}

export default (
  <Suspense fallback={<Spin spinning={true}/>}>
    <Switch>
      {getRouteByConfig()}
    </Switch>
  </Suspense>
);
