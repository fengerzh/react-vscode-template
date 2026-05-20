import { useState } from 'react';
import { message } from 'antd';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp } from '@/services';
import type { LoginParams } from '@/services';
import useUserStore from '@/store';

function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const updateProfile = useUserStore((s) => s.refreshProfile);

  const handleSubmit = async (values: LoginParams) => {
    const { data, error } = isRegister
      ? await signUp(values)
      : await signIn(values);

    if (error) {
      message.error(error.message);
      return;
    }

    if (isRegister) {
      // 注册成功：Supabase 可能自动登录，也可能需要确认邮箱
      if (data.session) {
        message.success('注册成功！');
        await updateProfile();
        navigate('/dashboard/home', { replace: true });
      } else {
        message.success('注册成功！请查收验证邮件，或直接登录。');
        setIsRegister(false);
      }
    } else {
      // 登录成功
      message.success('登录成功');
      await updateProfile();
      navigate('/dashboard/home', { replace: true });
    }
  };

  /* eslint-disable-next-line @stylistic/max-len */
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        padding: '48px 40px',
        width: '100%',
      }}
    >
      <ProForm
        onFinish={handleSubmit}
        submitter={{
          searchConfig: { submitText: isRegister ? '注册' : '登录' },
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            size: 'large',
            style: {
              width: '100%',
              height: '48px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 500,
            },
          },
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
            }}
          >
            <img
              style={{ height: '36px', filter: 'brightness(0) invert(1)' }}
              alt="logo"
              src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#1a1a2e', margin: '0 0 8px 0' }}>
            {isRegister ? '创建账号' : '欢迎回来'}
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            {isRegister ? 'Supabase 邮箱注册（本地开发免验证）' : 'Supabase Auth 邮箱登录'}
          </p>
        </div>

        <ProFormText
          fieldProps={{
            size: 'large',
            prefix: <MailOutlined style={{ color: '#9ca3af' }} />,
            style: { borderRadius: '8px' },
          }}
          name="email"
          placeholder="请输入邮箱"
          rules={[
            { required: true, message: '请输入邮箱!' },
            { type: 'email', message: '邮箱格式不正确!' },
          ]}
        />

        <ProFormText.Password
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined style={{ color: '#9ca3af' }} />,
            style: { borderRadius: '8px' },
          }}
          name="password"
          placeholder="请输入密码"
          rules={[
            { required: true, message: '请输入密码!' },
            { min: 6, message: '密码至少6位!' },
          ]}
        />
      </ProForm>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <a
          onClick={() => setIsRegister(!isRegister)}
          style={{ color: '#667eea', cursor: 'pointer', fontSize: 14 }}
        >
          {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
        </a>
      </div>

      {/* Supabase 本地开发：默认关闭邮箱验证 */}
      <div style={{
        marginTop: 24,
        padding: 12,
        background: '#f0f5ff',
        borderRadius: 8,
        fontSize: 12,
        color: '#4a6fa5',
        textAlign: 'center',
      }}
      >
        <div>🔗 API: localhost:54321</div>
        <div style={{ wordBreak: 'break-all', marginTop: 4 }}>
          🔑 anon_key: {anonKey.substring(0, 20)}...
        </div>
      </div>
    </div>
  );
}

export default Login;