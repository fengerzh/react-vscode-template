import { Outlet, useNavigate } from "react-router-dom";
import { Avatar, Dropdown } from "antd";
import { ProLayout } from "@ant-design/pro-components";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

function BasicLayout() {
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();
  return (
    <ProLayout
      navTheme="light"
      menuHeaderRender={false}
      contentStyle={{ display: "flex", flexDirection: "column" }}
      actionsRender={() => [
        <Dropdown
          menu={{
            items: [
              {
                key: "logout",
                icon: <LogoutOutlined />,
                label: "退出登录",
                onClick: () => {
                  document.cookie = "token=;path=/";
                  localStorage.removeItem("userName");
                  navigate("/user", { replace: true });
                },
              },
            ],
          }}
        >
          <div>
            <Avatar shape="square" size="small" icon={<UserOutlined />} />
            {userName || ""}
          </div>
        </Dropdown>,
      ]}
    >
      <Outlet />
    </ProLayout>
  );
}

export default BasicLayout;
