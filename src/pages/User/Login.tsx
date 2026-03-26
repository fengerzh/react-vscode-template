import { message } from "antd";
import { ProForm, ProFormText, ProFormCaptcha } from "@ant-design/pro-components";
import { MobileOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { login } from "@/services/index";
import type { LoginParams } from "@/services/index";
import useUserStore from "@/store";

const waitTime = (time = 100) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, time);
});

function Login() {
  const navigate = useNavigate();

  // 获取 Zustand store 方法
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        padding: "48px 40px",
        width: "100%",
      }}
    >
      <ProForm
        onFinish={async (data: LoginParams) => {
          try {
            const res = await login(data);
            if (res) {
              message.success("登录成功");

              // 使用 Zustand store 设置用户信息，会自动持久化到 localStorage
              setUserInfo({
                userName: res.data.data.userName,
                ...(res.data.data.userId && { userId: res.data.data.userId }),
              });

              document.cookie = "token=abcde;path=/";
              navigate("/dashboard/home", { replace: true });
            }
          } catch (excetion) {
            message.error(`登录失败，请重试: ${excetion}`);
          }
        }}
        submitter={{
          searchConfig: {
            submitText: "登录",
          },
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            size: "large",
            style: {
              width: "100%",
              height: "48px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 500,
            },
          },
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 16px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
            }}
          >
            <img
              style={{
                height: "36px",
                filter: "brightness(0) invert(1)",
              }}
              alt="logo"
              src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            />
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#1a1a2e",
              margin: "0 0 8px 0",
            }}
          >
            欢迎回来
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              margin: 0,
            }}
          >
            用最新的技术，做最好的网站
          </p>
        </div>
        <ProFormText
          fieldProps={{
            size: "large",
            prefix: <MobileOutlined style={{ color: "#9ca3af" }} />,
            style: {
              borderRadius: "8px",
            },
          }}
          name="phone"
          placeholder="13912345678"
          rules={[
            {
              required: true,
              message: "请输入手机号!",
            },
            {
              pattern: /^1\d{10}$/,
              message: "不合法的手机号格式!",
            },
          ]}
        />
        <ProFormCaptcha
          fieldProps={{
            size: "large",
            prefix: <MailOutlined style={{ color: "#9ca3af" }} />,
            style: {
              borderRadius: "8px",
            },
          }}
          captchaProps={{
            size: "large",
            style: {
              borderRadius: "8px",
            },
          }}
          phoneName="phone"
          name="captcha"
          rules={[
            {
              required: true,
              message: "请输入验证码",
            },
          ]}
          placeholder="admin"
          onGetCaptcha={async (phone: string) => {
            await waitTime(1000);
            message.success(`手机号 ${phone} 验证码发送成功!`);
          }}
        />
      </ProForm>
    </div>
  );
}

export default Login;
