/**
 * ProfileForm 组件测试（create-form 大表单示例）。
 *
 * 坑位提醒：
 * - antd 双汉字按钮自动插空格："保存" -> /保\s?存/、"重置" -> /重\s?置/。
 * - jsdom 下 antd 无可访问角色，回填选中的 radio 用容器 querySelector('input:checked') 断言。
 * - 校验错误、编辑回填（Form.setFieldsValue）均为异步，用 waitFor 等待。
 */
import {
  describe, it, expect, vi, afterEach,
} from 'vitest';
import {
  render, screen, waitFor, cleanup,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileForm from '../components/ProfileForm';
import type { ProfileFormValues } from '../types';
import '@testing-library/jest-dom/vitest';

afterEach(() => cleanup());

const baseValues: ProfileFormValues = {
  name: '张三',
  age: 18,
  role: 'engineer',
  email: 'zs@example.com',
  tags: [],
  bio: '',
  skills: [{ name: 'TypeScript', level: 3 }],
};

describe('ProfileForm', () => {
  it('编辑回填 initialValues', async () => {
    const { container } = render(<ProfileForm initialValues={baseValues} onSubmit={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('请输入姓名')).toHaveValue('张三');
      expect(screen.getByPlaceholderText('name@example.com')).toHaveValue('zs@example.com');
    });
    const checked = container.querySelector<HTMLInputElement>('input[type="radio"]:checked');
    expect(checked?.value).toBe('engineer');
    // Form.List 动态项回填
    expect(screen.getByPlaceholderText('技能名（如 TypeScript）')).toHaveValue('TypeScript');
  });

  it('必填项为空时阻止提交（onSubmit 不被调用）', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ProfileForm onSubmit={onSubmit} initialValues={null} />);

    await user.click(screen.getByText(/保\s?存/));

    expect(onSubmit).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText('请输入姓名')).toBeInTheDocument();
    });
  });

  it('自定义校验：姓名 admin 时阻止提交', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ProfileForm onSubmit={onSubmit} initialValues={null} />);

    await user.type(screen.getByPlaceholderText('请输入姓名'), 'admin');
    await user.click(screen.getByText(/保\s?存/));

    await waitFor(() => {
      expect(screen.getByText('姓名不能为 admin')).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('合法值提交调用 onSubmit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(true);
    render(<ProfileForm onSubmit={onSubmit} initialValues={baseValues} />);

    // 回填后所有必填已满足，直接点保存
    await user.click(screen.getByText(/保\s?存/));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
    expect(onSubmit).toHaveBeenLastCalledWith(expect.objectContaining({
      name: '张三',
      role: 'engineer',
      email: 'zs@example.com',
    }));
  });

  it('Form.List 添加技能行后随表单提交', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(true);
    render(<ProfileForm onSubmit={onSubmit} initialValues={baseValues} />);

    await user.click(screen.getByText(/添加技能/));
    const skillInputs = screen.getAllByPlaceholderText('技能名（如 TypeScript）');
    await user.type(skillInputs[skillInputs.length - 1]!, 'React');
    await user.click(screen.getByText(/保\s?存/));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
    expect(onSubmit).toHaveBeenLastCalledWith(expect.objectContaining({
      skills: expect.arrayContaining([
        expect.objectContaining({ name: 'React' }),
      ]),
    }));
  });
});
