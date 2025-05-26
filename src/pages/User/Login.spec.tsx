import './matchMedia.mock';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Login from './Login';
import { App } from 'antd';

// mock antd message
jest.mock('antd', () => {
  const antd = jest.requireActual('antd');
  return {
    ...antd,
    message: {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
      open: jest.fn(),
      destroy: jest.fn(),
    },
    App: antd.App,
  };
});
import { message } from 'antd';

describe('<Login /> 组件测试', () => {
  beforeAll(() => {
    // mock window.location，避免 jsdom navigation not implemented 报错
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { href: '', assign: jest.fn() };
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该有标题栏', () => {
    render(<App><Login /></App>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('React Vscode Template');
  });

  it('发送验证码', async () => {
    render(<App><Login /></App>);
    const phoneInput = screen.getByPlaceholderText('13912345678');
    await userEvent.type(phoneInput, '13912345678');
    const captchaBtn = screen.getByRole('button', { name: /获取验证码/i });
    await userEvent.click(captchaBtn);
    await waitFor(() => {
      expect(message.success).toHaveBeenCalledWith(expect.stringMatching(/验证码发送成功/));
    });
  });

  it('登录成功', async () => {
    render(<App><Login /></App>);
    await userEvent.type(screen.getByPlaceholderText('13912345678'), '13912345678');
    await userEvent.type(screen.getByPlaceholderText('admin'), 'admin');
    const submitBtn = screen.getByRole('button', { name: /登\s*录/i });
    await userEvent.click(submitBtn);
    await waitFor(() => {
      expect(message.success).toHaveBeenCalledWith('登录成功');
    });
  });

  it('登录失败', async () => {
    render(<App><Login /></App>);
    await userEvent.type(screen.getByPlaceholderText('13912345678'), '13912345678');
    await userEvent.type(screen.getByPlaceholderText('admin'), 'wrong');
    const submitBtn = screen.getByRole('button', { name: /登\s*录/i });
    await userEvent.click(submitBtn);
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith(expect.stringMatching(/登录失败|用户名或密码错误/));
    });
  });
});
