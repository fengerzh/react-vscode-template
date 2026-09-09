/**
 * ListTable 组件测试（列表详情型）：验证渲染、搜索、详情回调与分页。
 *
 * 坑位提醒：
 * - antd 双汉字按钮自动插空格：按钮用 /查\s?询/、/重\s?置/ 正则定位。
 * - 显式 afterEach(cleanup)，避免多次 render 累积 DOM。
 * - antd Pagination 按 total 计算页数，total 需大于 pageSize 才有第二页页码。
 */
import {
  describe, it, expect, vi, afterEach,
} from 'vitest';
import {
  render, screen, cleanup, fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListTable from '../components/ListTable';
import type { Order } from '../types';
import '@testing-library/jest-dom/vitest';

afterEach(() => cleanup());

const sampleOrders: Order[] = [
  { id: 1, order_no: 'A001', customer_name: '张三', amount: 100, status: 'paid' },
  { id: 2, order_no: 'A002', customer_name: '李四', amount: 200, status: 'done' },
];

/* eslint-disable no-unused-vars -- 回调参数名用于契约文档化 */
interface RenderOpts {
  total?: number;
  onSearch?: (values: { current?: number; pageSize?: number }) => void;
  onReset?: () => void;
  onPageChange?: (page: number, pageSize: number) => void;
  onView?: (record: Order) => void;
}
/* eslint-enable no-unused-vars */

function renderList(opts?: RenderOpts) {
  return render(
    <ListTable
      dataSource={sampleOrders}
      total={opts?.total ?? 2}
      loading={false}
      query={{ current: 1, pageSize: 10 }}
      onSearch={opts?.onSearch ?? (() => {})}
      onReset={opts?.onReset ?? (() => {})}
      onPageChange={opts?.onPageChange ?? (() => {})}
      onView={opts?.onView ?? (() => {})}
    />,
  );
}

describe('ListTable', () => {
  it('渲染数据行', () => {
    renderList();
    expect(screen.getByText('A001')).toBeInTheDocument();
    expect(screen.getByText('A002')).toBeInTheDocument();
    expect(screen.getByText('张三')).toBeInTheDocument();
  });

  it('点击详情触发 onView(record)', async () => {
    const user = userEvent.setup();
    const onView = vi.fn();
    renderList({ onView });

    const viewButtons = screen.getAllByText(/详\s?情/);
    expect(viewButtons.length).toBe(2);
    await user.click(viewButtons[0]!);

    expect(onView).toHaveBeenCalledWith(sampleOrders[0]);
  });

  it('提交搜索触发 onSearch', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    renderList({ onSearch });

    await user.type(screen.getByPlaceholderText('请输入订单号'), 'A00');
    await user.click(screen.getByText(/查\s?询/));

    expect(onSearch).toHaveBeenCalledWith(expect.objectContaining({ order_no: 'A00' }));
  });

  it('点击重置触发 onReset', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    renderList({ onReset });

    await user.click(screen.getByText(/重\s?置/));

    expect(onReset).toHaveBeenCalled();
  });

  it('分页变更触发 onPageChange', () => {
    const onPageChange = vi.fn();
    const { container } = renderList({ onPageChange, total: 15 });

    const pageTwo = container.querySelector('.ant-pagination-item-2');
    expect(pageTwo).toBeTruthy();
    fireEvent.click(pageTwo as Element);

    expect(onPageChange).toHaveBeenCalled();
  });
});
