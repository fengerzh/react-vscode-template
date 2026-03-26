import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 装饰性背景元素 */}
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          top: "-200px",
          right: "-200px",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.08)",
          bottom: "-100px",
          left: "-100px",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default UserLayout;
