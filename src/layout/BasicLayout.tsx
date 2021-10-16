import { Route, Switch, Redirect } from 'react-router-dom';
import { Avatar, Dropdown, Menu } from 'antd';
import ProLayout from '@ant-design/pro-layout';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

interface Props {
  routes: {
    key: string,
    path: string,
    redirect: string,
    component: any,
    routes: {}[]
  }[],
  history: {
    push: (val: string) => void
  }
}

const BasicLayout = ({
  routes, history,
}: Props) => {
  const userName = localStorage.getItem('userName');
  return (
    <ProLayout
      navTheme="light"
      menuHeaderRender={false}
      route={{ routes }}
      contentStyle={{ display: 'flex', flexDirection: 'column' }}
      disableContentMargin
      rightContentRender={() => (
        <Dropdown
          overlay={(
            <Menu>
              <Menu.Item
                key="logout"
                icon={<LogoutOutlined />}
                onClick={() => {
                  document.cookie = 'token=;path=/';
                  localStorage.removeItem('userName');
                  history.push('/user');
                }}
              >
                退出登录
              </Menu.Item>
            </Menu>
        )}
        >
          <div>
            <Avatar shape="square" size="small" icon={<UserOutlined />} />
            {userName}
          </div>
        </Dropdown>
      )}
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
        <Route path="*">
          <Redirect to="/exception/404" />
        </Route>
      </Switch>
    </ProLayout>
  );
};

export default BasicLayout;
