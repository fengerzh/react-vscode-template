/**
 * FeedbackForm 组件测试（简单表单型页面示例）。
 *
 * 注意：
 * - antd 双汉字按钮自动插空格："提交反馈" 为四字不插空格，"重置" 用 /重\s?置/。
 * - jsdom 下 antd 无可访问角色，Radio 用文案文本点击（如 getByText('功能建议')）。
 * - 校验错误为异步渲染，用 waitFor 等待。
 */
import {
  describe, it, expect, vi, afterEach,
} from 'vitest';
import {
  render, screen, waitFor, cleanup,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedbackForm from '../components/FeedbackForm';
import '@testing-library/jest-dom/vitest';

afterEach(() => cleanup());

describe('FeedbackForm', () => {
  it('必填项为空时阻止提交（onSubmit 不被调用）', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(true);
    render(<FeedbackForm onSubmit={onSubmit} />);

    await user.click(screen.getByText(/提\s?交\s?反\s?馈/));

    expect(onSubmit).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText('请输入标题')).toBeInTheDocument();
    });
  });

  it('合法值提交调用 onSubmit 并重置表单', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(true);
    render(<FeedbackForm onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText(/一句话概括/), '建议加夜间模式');
    await user.click(screen.getByText('功能建议'));
    await user.type(screen.getByPlaceholderText(/详细描述/), '希望支持暗色主题');
    await user.click(screen.getByText(/提\s?交\s?反\s?馈/));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
    expect(onSubmit).toHaveBeenLastCalledWith(expect.objectContaining({
      title: '建议加夜间模式',
      category: 'feature',
      content: '希望支持暗色主题',
    }));

    // 成功后表单重置：标题输入框恢复为空
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/一句话概括/)).toHaveValue('');
    });
  });

  it('手机号格式不正确时提示错误且不提交', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<FeedbackForm onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText(/一句话概括/), '测试标题');
    await user.click(screen.getByText('问题咨询'));
    await user.type(screen.getByPlaceholderText(/详细描述/), '详细内容描述');
    await user.type(screen.getByPlaceholderText(/便于我们与您联系/), '123');
    await user.click(screen.getByText(/提\s?交\s?反\s?馈/));

    await waitFor(() => {
      expect(screen.getByText('请输入 11 位手机号')).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
