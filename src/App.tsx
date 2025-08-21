import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "mobx-react";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "antd/dist/reset.css";
import userStore from "@/store";
import router from "@/routes";

// 设置dayjs为中文
dayjs.locale("zh-cn");

// 错误边界组件
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  override componentDidCatch() {
  }

  override render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>应用出现了错误</h2>
          <p>请刷新页面重试</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: "8px 16px",
              backgroundColor: "#1890ff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            刷新页面
          </button>
        </div>
      );
    }

    return children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <ConfigProvider locale={zhCN}>
        <BrowserRouter>
          <Provider userStore={userStore}>
            {router}
          </Provider>
        </BrowserRouter>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default App;
