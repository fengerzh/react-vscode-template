import { Result, Button } from "antd";

function NotFound() {
  return (
    <div style={{ padding: "24px" }}>
      <Result
        status="404"
        title="404"
        subTitle="对不起，您访问的页面不存在"
        extra={(
          <Button
            type="primary"
            onClick={() => { window.location.href = "/"; }}
          >
            回到首页
          </Button>
        )}
      />
    </div>
  );
}

export default NotFound;
