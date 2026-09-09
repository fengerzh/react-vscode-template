/**
 * 数据表格：受控展示列表数据，分页、编辑、删除通过回调上抛。
 */
import {
  Table, Button, Popconfirm, Space, Tag,
} from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Customer } from '../types';

/* eslint-disable no-unused-vars -- 回调参数名用于契约文档化 */
interface TableViewProps {
  dataSource: Customer[];
  total: number;
  loading: boolean;
  page: number;
  pageSize: number;
  onPageChange: (_page: number, _pageSize: number) => void;
  onEdit: (_record: Customer) => void;
  onDelete: (_record: Customer) => void;
}
/* eslint-enable no-unused-vars */

function TableView({
  dataSource,
  total,
  loading,
  page,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
}: TableViewProps) {
  const columns: TableProps<Customer>['columns'] = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '客户名称', dataIndex: 'name' },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 100,
      sorter: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      ellipsis: true,
    },
    {
      title: '生日',
      dataIndex: 'birthday',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: Customer['status']) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '活跃' : '非活跃'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record: Customer) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title={`确定删除「${record.name}」吗？`}
            okText="确认删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table<Customer>
      rowKey="id"
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (t, range) => `第 ${range[0]}-${range[1]} 条/共 ${t} 条`,
        onChange: onPageChange,
      }}
    />
  );
}

export default TableView;
