/**
 * 列表型页面示例：搜索表单 + 数据表格合并为一个受控组件。
 * 数据、查询条件与回调全部走 props，组件自身无副作用，测试无需 mock service。
 */
import {
  Table, Button, Tag, Form, Input, Select, Space,
} from 'antd';
import type { TableProps } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { ORDER_STATUSES } from '../types';
import type { Order, OrderQuery } from '../types';

/* eslint-disable no-unused-vars -- 回调参数名用于契约文档化 */
interface ListTableProps {
  dataSource: Order[];
  total: number;
  loading: boolean;
  query: OrderQuery;
  onSearch: (_values: OrderQuery) => void;
  onReset: () => void;
  onPageChange: (_page: number, _pageSize: number) => void;
  onView: (_record: Order) => void;
}
/* eslint-enable no-unused-vars */

function ListTable({
  dataSource,
  total,
  loading,
  query,
  onSearch,
  onReset,
  onPageChange,
  onView,
}: ListTableProps) {
  const [form] = Form.useForm<OrderQuery>();

  const handleFinish = (values: OrderQuery) => {
    onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  const columns: TableProps<Order>['columns'] = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '订单号', dataIndex: 'order_no' },
    { title: '客户', dataIndex: 'customer_name' },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 120,
      render: (amount: Order['amount']) => `¥ ${amount ?? 0}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: Order['status']) => {
        const colorMap: Record<NonNullable<Order['status']>, string> = {
          pending: 'orange',
          paid: 'blue',
          shipped: 'cyan',
          done: 'green',
        };
        const label = ORDER_STATUSES.find((s) => s.value === status)?.label ?? '-';
        return <Tag color={status ? colorMap[status] : 'default'}>{label}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record: Order) => (
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => onView(record)}>
          详情
        </Button>
      ),
    },
  ];

  return (
    <>
      <Form<OrderQuery>
        form={form}
        layout="inline"
        onFinish={handleFinish}
        style={{ marginBottom: 16 }}
      >
        <Form.Item name="order_no" label="订单号">
          <Input placeholder="请输入订单号" allowClear />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select
            placeholder="请选择状态"
            options={[...ORDER_STATUSES]}
            allowClear
            style={{ width: 140 }}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>
      <Table<Order>
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          current: query.current || 1,
          pageSize: query.pageSize || 10,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (t, range) => `第 ${range[0]}-${range[1]} 条/共 ${t} 条`,
          onChange: onPageChange,
        }}
      />
    </>
  );
}

export default ListTable;
