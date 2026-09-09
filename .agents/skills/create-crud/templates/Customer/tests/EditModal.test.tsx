/**
 * EditModal 组件测试：验证新增/编辑回填与提交回调。
 *
 * 注意：
 * - antd 默认对两个汉字的按钮自动插入空格（"保存" 渲染为 "保 存"），
 *   按钮定位统一使用 /保\s?存/ 这类正则文本匹配，避免 role 查询在 jsdom 下不稳定。
 * - antd Modal 通过 portal 渲染到 body，RTL 不会自动清理，
 *   此处显式 afterEach(cleanup) 避免多次 render 累积 DOM。
 */
import {
  describe, it, expect, vi, afterEach,
} from 'vitest';
import {
  render, screen, waitFor, cleanup,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditModal from '../components/EditModal';
import type { Customer } from '../types';

afterEach(() => cleanup());

describe('EditModal', () => {
  it('新增模式：清空表单，校验通过后回调 onOk', async () => {
    const user = userEvent.setup();
    const onOk = vi.fn().mockResolvedValue(undefined);
    render(<EditModal open record={null} onOk={onOk} onCancel={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('请输入客户名称'), '新客户');
    await user.type(screen.getByPlaceholderText('请输入年龄'), '25');
    await user.click(screen.getByText(/保\s?存/));

    expect(onOk).toHaveBeenCalledTimes(1);
    expect(onOk).toHaveBeenLastCalledWith(expect.objectContaining({
      name: '新客户',
      age: 25,
    }));
  });

  it('编辑模式：按 record 回填', async () => {
    const record: Customer = {
      id: 1,
      name: '张三',
      age: 18,
      email: 'zhangsan@example.com',
      status: 'active',
    };
    render(<EditModal open record={record} onOk={vi.fn()} onCancel={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('请输入客户名称')).toHaveValue('张三');
      expect(screen.getByPlaceholderText('name@example.com')).toHaveValue('zhangsan@example.com');
    });
  });

  it('必填项为空时阻止提交（onOk 不被调用）', async () => {
    const user = userEvent.setup();
    const onOk = vi.fn();
    render(<EditModal open record={null} onOk={onOk} onCancel={vi.fn()} />);

    await user.click(screen.getByText(/保\s?存/));

    expect(onOk).not.toHaveBeenCalled();
    // 校验错误为异步渲染，用 waitFor 等待
    await waitFor(() => {
      expect(screen.getByText('请输入客户名称')).toBeInTheDocument();
    });
  });
});
