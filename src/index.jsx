import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/antd.less';
import './tailwind.css';

ReactDOM.render(
  // 临时禁用StrictMode，等待antd团队解决问题
  // <React.StrictMode>
  <App />, // </React.StrictMode>
  document.getElementById('root'),
);
