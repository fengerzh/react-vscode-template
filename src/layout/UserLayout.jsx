import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';

const propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape()),
};
const defaultProps = {
  routes: [],
};

const UserLayout = ({ routes }) => (
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
  </Switch>
);

UserLayout.propTypes = propTypes;
UserLayout.defaultProps = defaultProps;

export default UserLayout;
