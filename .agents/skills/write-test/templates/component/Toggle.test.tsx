/**
 * Testing Library 组件测试示例（针对 template/component/Toggle.tsx）。
 * RTL 约定：
 * - 按用户视角断言（getByRole / getByText / userEvent），避免断言 DOM 实现细节；
 * - antd 双汉字按钮会自动插入空格："已开启" -> "已 开 启"，用 /已\s?开\s?启/ 正则；
 * - jsdom 下 antd 组件无可访问角色（"There are no accessible roles"），按钮用
 *   getByText 文本定位（userEvent 点击文本节点会冒泡到外层 button 触发 onClick）；
 * - Modal 等 portal 渲染组件需显式 afterEach(cleanup)；
 * - 异步渲染（校验错误、回填）用 waitFor。
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toggle from './Toggle';
import '@testing-library/jest-dom/vitest';

afterEach(() => cleanup());

describe('Toggle', () => {
  it('初始为关闭状态', () => {
    render(<Toggle />);
    expect(screen.getByText(/已\s?关\s?闭/)).toBeInTheDocument();
  });

  it('点击后切换为开启状态', async () => {
    const user = userEvent.setup();
    render(<Toggle />);

    await user.click(screen.getByText(/已\s?关\s?闭/));

    expect(screen.getByText(/已\s?开\s?启/)).toBeInTheDocument();
  });

  it('连续点击后状态往返切换', async () => {
    const user = userEvent.setup();
    render(<Toggle />);

    await user.click(screen.getByText(/已\s?关\s?闭/));
    await user.click(screen.getByText(/已\s?开\s?启/));

    expect(screen.getByText(/已\s?关\s?闭/)).toBeInTheDocument();
  });
});
