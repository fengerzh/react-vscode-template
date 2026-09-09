/**
 * Table 组件测试：受控组件，仅验证渲染与回调触发，无需 mock service。
 *
 * 注意：
 * - antd 双汉字按钮自动插空格（"编辑" 渲染为 "编 辑"），按钮用 /编\s?辑/ 正则定位。
 * - 显式 afterEach(cleanup)，避免多次 render 累积 DOM 造成 getAllBy* 命中残留。
 */
import {
  describe, it, expect, vi, afterEach,
} from 'vitest';
import {
  render, screen, cleanup, fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TableView from '../components/Table';
import type { Customer } from '../types';

afterEach(() => cleanup());

const sampleCustomers: Customer[] = [
  {
    id: 1, name: '张三', age: 18, status: 'active',
  },
  {
    id: 2, name: '李四', age: 22, status: 'inactive',
  },
];

/* eslint-disable no-unused-vars -- 回调参数名用于契约文档化 */
interface RenderTableOpts {
  total?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onEdit?: (record: Customer) => void;
  onDelete?: (record: Customer) => void;
}
/* eslint-enable no-unused-vars */

function renderTable(opts?: RenderTableOpts) {
  return render(
    <TableView
      dataSource={sampleCustomers}
      total={opts?.total ?? 2}
      loading={false}
      page={1}
      pageSize={10}
      onPageChange={opts?.onPageChange ?? (() => {})}
      onEdit={opts?.onEdit ?? (() => {})}
      onDelete={opts?.onDelete ?? (() => {})}
    />,
  );
}

describe('TableView', () => {
  it('渲染数据行', () => {
    renderTable();
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('李四')).toBeInTheDocument();
  });

  it('点击编辑触发 onEdit(record)', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    renderTable({ onEdit });

    const editButton = screen.getAllByText(/编\s?辑/)[0]!;
    await user.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(sampleCustomers[0]);
  });

  it('Popconfirm 确认后触发 onDelete(record)', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    renderTable({ onDelete });

    // 点击第一条记录的删除按钮
    const deleteButton = screen.getAllByText(/删\s?除/)[0]!;
    await user.click(deleteButton);
    // Popconfirm 弹出后点确认（"确认删除" 四个汉字不触发自动插空格）
    await user.click(await screen.findByText(/确认删除/));

    expect(onDelete).toHaveBeenCalledWith(sampleCustomers[0]);
  });

  it('分页变更触发 onPageChange', async () => {
    const onPageChange = vi.fn();
    // total 需大于 pageSize 才有第二页页码（antd Pagination 按 total 计算页数）
    const { container } = renderTable({ onPageChange, total: 15 });

    // antd Pagination 第二页 item：.ant-pagination-item-2
    const pageTwo = container.querySelector('.ant-pagination-item-2');
    expect(pageTwo).toBeTruthy();
    fireEvent.click(pageTwo as Element);

    expect(onPageChange).toHaveBeenCalled();
  });
});
