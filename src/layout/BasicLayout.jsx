import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import ProLayout from '@ant-design/pro-layout';

const propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape()),
};
const defaultProps = {
  routes: [],
};

const BasicLayout = ({ routes }) => (
  <ProLayout
    navTheme="light"
    menuHeaderRender={false}
    route={{ routes }}
    contentStyle={{ display: 'flex', flexDirection: 'column' }}
    headerRender={false}
    disableContentMargin
  >
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
  </ProLayout>
);

BasicLayout.propTypes = propTypes;
BasicLayout.defaultProps = defaultProps;

export default BasicLayout;
