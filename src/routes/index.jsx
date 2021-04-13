import { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import commonRouterConfig from './common-router';

const routerConfig = [
  ...commonRouterConfig,
];

function getRouteByConfig() {
  const route = routerConfig.map(
    (config) => (
      <Route
        key={config.key}
        path={config.path}
        exact={config.exact || false}
        component={config.component}
      />
    ),
  );
  // 把首页缺省重定向
  route.push(
    <Route
      exact
      key="home"
      path="/"
    >
      <Redirect to="/home" />
    </Route>,
  );
  return route;
}

export default (
  <Suspense fallback={<div>Loading...</div>}>
    <Switch>
      {getRouteByConfig()}
    </Switch>
  </Suspense>
);
