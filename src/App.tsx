import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { ErrorBoundary } from 'react-error-boundary';
import 'antd/dist/reset.css';
import router from '@/routes';
import useUserStore from '@/store';

// 设置 dayjs 为中文
dayjs.locale('zh-cn');

function App() {
  const initAuth = useUserStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#667eea',
          colorPrimaryHover: '#764ba2',
          borderRadius: 8,
        },
      }}
    >
      <ErrorBoundary fallback={<div>Error</div>}>
        <BrowserRouter>
          {router}
        </BrowserRouter>
      </ErrorBoundary>
    </ConfigProvider>
  );
}

export default App;