import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { ErrorBoundary } from "react-error-boundary";
import "antd/dist/reset.css";
import router from "@/routes";

// 设置dayjs为中文
dayjs.locale("zh-cn");

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <ErrorBoundary fallback={<div>Error</div>}>
        <BrowserRouter>
          {router}
        </BrowserRouter>
      </ErrorBoundary>
    </ConfigProvider>
  );
}

export default App;
