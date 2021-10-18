import { message } from 'antd';
import ProForm, { ProFormText, ProFormCaptcha } from '@ant-design/pro-form';
import { MobileOutlined, MailOutlined } from '@ant-design/icons';
import { login } from '@/services/index';

const waitTime = (time = 100) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, time);
});

const Login = () => (
  <div
    style={{
      width: 330,
      margin: 'auto',
    }}
  >
    <ProForm
      onFinish={async (data) => {
        const res: any = await login(data);
        if (res) {
          message.success('登录成功');
          localStorage.setItem('userName', res.data.data.userName);
          document.cookie = 'token=abcde;path=/';
          window.location.href = '/dashboard';
        }
      }}
      submitter={{
        searchConfig: {
          submitText: '登录',
        },
        render: (_, dom) => dom.pop(),
        submitButtonProps: {
          size: 'large',
          style: {
            width: '100%',
          },
        },
      }}
    >
      <h1 className="flex text-center text-2xl">
        <img
          style={{
            height: '44px',
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
          textAlign: 'center',
          marginBottom: 40,
        }}
      >
        用最新的技术，做最好的网站
      </div>
      <ProFormText
        fieldProps={{
          size: 'large',
          prefix: <MobileOutlined />,
        }}
        name="phone"
        placeholder="13912345678"
        rules={[
          {
            required: true,
            message: '请输入手机号!',
          },
          {
            pattern: /^1\d{10}$/,
            message: '不合法的手机号格式!',
          },
        ]}
      />
      <ProFormCaptcha
        fieldProps={{
          size: 'large',
          prefix: <MailOutlined />,
        }}
        captchaProps={{
          size: 'large',
        }}
        phoneName="phone"
        name="captcha"
        rules={[
          {
            required: true,
            message: '请输入验证码',
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

export default Login;
