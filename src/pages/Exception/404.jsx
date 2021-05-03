import { Result, Button } from 'antd';

const NotFound = () => (
  <Result
    status="404"
    title="404"
    subTitle="对不起，您访问的页面不存在"
    extra={(
      <Button
        type="primary"
        onClick={() => { window.location.href = '/'; }}
      >
        回到首页
      </Button>
    )}
  />
);

export default NotFound;
