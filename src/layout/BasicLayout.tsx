import { Outlet, useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Menu } from 'antd';
import { ProLayout } from '@ant-design/pro-components';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

const BasicLayout = () => {
  const userName = localStorage.getItem('userName');
  const navigate = useNavigate();
  return (
    <ProLayout
      navTheme="light"
      menuHeaderRender={false}
      contentStyle={{ display: 'flex', flexDirection: 'column' }}
      actionsRender={() => [
        <Dropdown
          menu={{
            items: [
              {
                key: 'logout',
                // @ts-expect-error antd icon 类型不兼容
                icon: <LogoutOutlined />,
                label: '退出登录',
                onClick: () => {
                  document.cookie = 'token=;path=/';
                  localStorage.removeItem('userName');
                  navigate('/user', { replace: true });
                },
              },
            ],
          }}
        >
          <div>
            {/* @ts-expect-error antd icon 类型不兼容 */}
            <Avatar shape="square" size="small" icon={<UserOutlined />} />
            {userName || ''}
          </div>
        </Dropdown>
      ]}
    >
      <Outlet />
    </ProLayout>
  );
};

export default BasicLayout;
