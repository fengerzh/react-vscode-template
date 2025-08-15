import { message } from "antd";
import ProForm, { ProFormText, ProFormCaptcha } from "@ant-design/pro-form";
import { MobileOutlined, MailOutlined } from "@ant-design/icons";
import { login } from "@/services/index";
import type { LoginParams } from "@/services/index";
import { useOptimistic, startTransition } from "react";

const waitTime = (time = 100) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, time);
});

function Login() {
  // 使用 useOptimistic 进行乐观更新
  const [optimisticLogin, addOptimisticLogin] = useOptimistic<LoginParams | null>(
    null,
  );

  return (
    <div
      style={{
        width: 330,
        margin: "auto",
      }}
    >
      <ProForm
        onFinish={async (data: LoginParams) => {
          try {
            // 乐观更新：立即显示登录状态
            startTransition(() => {
              addOptimisticLogin(data);
            });

            const res = await login(data);
            if (res) {
              message.success("登录成功");
              localStorage.setItem("userName", res.data.data.userName);
              document.cookie = "token=abcde;path=/";
              window.location.href = "/dashboard";
            }

            // 清除乐观更新状态
            startTransition(() => {
              addOptimisticLogin(null);
            });
          } catch (excetion) {
            // 如果失败，自动回滚到原始状态
            startTransition(() => {
              addOptimisticLogin(null);
            });
            message.error(`登录失败，请重试: ${excetion}`);
          }
        }}
        submitter={{
          searchConfig: {
            submitText: optimisticLogin ? "登录中..." : "登录",
          },
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            size: "large",
            style: {
              width: "100%",
            },
            loading: optimisticLogin !== null,
          },
        }}
      >
        <h1 className="flex text-center text-2xl">
          <img
            style={{
              height: "44px",
              marginRight: 16,
            }}
            alt="logo"
            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
          />
          React Vscode Template
        </h1>
        <div
          style={{
            marginTop: 12,
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          用最新的技术，做最好的网站
        </div>
        <ProFormText
          fieldProps={{
            size: "large",
            prefix: <MobileOutlined />,
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
            prefix: <MailOutlined />,
          }}
          captchaProps={{
            size: "large",
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

      {/* 显示乐观更新状态 */}
      {optimisticLogin && (
        <div
          style={{
            marginTop: 16,
            padding: 8,
            backgroundColor: "#f6ffed",
            border: "1px solid #b7eb8f",
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, color: "#52c41a" }}>
            ⚡ 正在登录中...
          </p>
        </div>
      )}
    </div>
  );
}

export default Login;
