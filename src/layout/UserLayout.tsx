import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

interface Props {
  routes: {
    key: string,
    path: string,
    redirect: string,
    component: React.ComponentType<any>,
    routes: {}[]
  }[],
}

const UserLayout: React.VFC<Props> = ({ routes }: Props) => (
  <Switch>
    {routes.map((route) => (
      <Route
        key={route.key}
        path={route.path}
        exact
        render={({ location, ...props }) => (route.component ? (
          <route.component
          // eslint-disable-next-line
          {...props}
            routes={route.routes}
          />
        ) : (
          <Redirect
            to={{
              pathname: route.redirect,
              state: { from: location },
            }}
          />
        ))}
      />
    ))}
    <Route path="*">
      <Redirect to="/exception/404" />
    </Route>
  </Switch>
);

export default UserLayout;
