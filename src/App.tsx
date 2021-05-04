import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import 'moment/dist/locale/zh-cn';
import userStore from './store';
import router from './routes';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Provider userStore={userStore}>
          {router}
        </Provider>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
