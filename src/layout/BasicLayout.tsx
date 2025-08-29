import React, { memo, useCallback, useMemo } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Avatar, Dropdown, Button, message, FloatButton,
} from "antd";
import { ProLayout, MenuDataItem } from "@ant-design/pro-components";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  HomeOutlined,
  BellOutlined,
  UpOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import useUserStore from "@/store";
import logo from "../logo.svg";

// 菜单数据类型
interface MenuItem extends MenuDataItem {
  key: string;
  name: string;
  path: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

const BasicLayout: React.FC = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();

  // 从 Zustand store 获取状态和方法
  const userInfo = useUserStore((state) => state.userInfo);
  const appState = useUserStore((state) => state.appState);
  const clearUserInfo = useUserStore((state) => state.clearUserInfo);
  const toggleCollapsed = useUserStore((state) => state.toggleCollapsed);
  const displayName = useUserStore((state) => state.displayName());

  // 菜单数据
  const menuData: MenuItem[] = useMemo(() => [
    {
      key: "home",
      name: "首页",
      path: "/dashboard/home",
      icon: <HomeOutlined />,
    },
    // 可以在这里添加更多菜单项
  ], []);

  // 退出登录处理
  const handleLogout = useCallback(() => {
    clearUserInfo();
    message.success("退出登录成功");
    navigate("/user", { replace: true });
  }, [clearUserInfo, navigate]);

  // 用户设置处理
  const handleSettings = useCallback(() => {
    message.info("设置功能开发中...");
  }, []);

  // 通知处理
  const handleNotifications = useCallback(() => {
    message.info("通知功能开发中...");
  }, []);

  // 返回顶部处理
  const handleBackToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // 快速添加用户处理
  const handleQuickAdd = useCallback(() => {
    message.info("快速添加用户功能开发中...");
  }, []);

  // 帮助处理
  const handleHelp = useCallback(() => {
    message.info("帮助功能开发中...");
  }, []);

  // 用户下拉菜单
  const userMenuItems = useMemo(() => [
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "个人设置",
      onClick: () => navigate("/dashboard/settings"),
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
      onClick: handleLogout,
    },
  ], [handleSettings, handleLogout]);

  // 右侧操作栏
  const actionsRender = useCallback(() => [
    <Button
      key="notifications"
      type="text"
      icon={<BellOutlined />}
      onClick={handleNotifications}
    />,
    <Dropdown
      key="user"
      menu={{ items: userMenuItems }}
      placement="bottomRight"
    >
      <div style={{
        cursor: "pointer",
        padding: "0 8px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
      >
        <Avatar
          shape="circle"
          size="small"
          icon={<UserOutlined />}
          style={{ backgroundColor: "#1890ff" }}
        />
        <span style={{ fontSize: "14px" }}>
          {displayName}
        </span>
      </div>
    </Dropdown>,
  ], [userMenuItems, userInfo, handleNotifications]);

  // 菜单点击处理
  const handleMenuClick = useCallback((menuInfo: { key: string }) => {
    const menuItem = menuData.find((item) => item.key === menuInfo.key);
    if (menuItem?.path) {
      navigate(menuItem.path);
    }
  }, [menuData, navigate]);

  // 菜单项渲染处理
  const handleMenuItemRender = useCallback((
    menuItemProps: MenuDataItem,
    defaultDom: React.ReactNode,
  ) => {
    if (menuItemProps.isUrl || !menuItemProps.path) {
      return defaultDom;
    }
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => handleMenuClick({ key: menuItemProps.key || "" })}
        onKeyDown={() => {
        }}
      >
        {defaultDom}
      </div>
    );
  }, [handleMenuClick]);

  return (
    <ProLayout
      title="React Template"
      logo={logo}
      navTheme="light"
      layout="mix"
      contentWidth="Fluid"
      fixedHeader
      fixSiderbar
      collapsed={appState.collapsed}
      onCollapse={toggleCollapsed}
      menuDataRender={() => menuData}
      menuItemRender={handleMenuItemRender}
      location={{
        pathname: location.pathname,
      }}
      actionsRender={actionsRender}
      contentStyle={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 64px)",
      }}
      waterMarkProps={{
        content: userInfo.userName || "React Template",
      }}
    >
      <Outlet />

      {/* 浮动按钮组 */}
      <FloatButton.Group
        trigger="hover"
        style={{
          right: 24,
          bottom: 24,
        }}
        icon={<UpOutlined />}
      >
        <FloatButton
          icon={<UpOutlined />}
          tooltip="返回顶部"
          onClick={handleBackToTop}
        />
        <FloatButton
          icon={<PlusOutlined />}
          tooltip="快速添加"
          onClick={handleQuickAdd}
        />
        <FloatButton
          icon={<QuestionCircleOutlined />}
          tooltip="帮助"
          onClick={handleHelp}
        />
      </FloatButton.Group>
    </ProLayout>
  );
});

BasicLayout.displayName = "BasicLayout";

export default BasicLayout;
