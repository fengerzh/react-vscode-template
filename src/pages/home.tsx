import React, {
  memo, useCallback, useMemo, useRef, useState,
} from 'react';
import { Link } from 'react-router-dom';
import { PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Space, Tag, message, Modal, Form, Input, InputNumber, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { getUsers, createUser, updateUser, deleteUser, type UserRow } from '@/services';
import dayjs from 'dayjs';

interface BreadcrumbRoute {
  path?: string;
  title?: React.ReactNode;
}

const Home: React.FC = memo(() => {
  const actionRef = useRef<any>();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [form] = Form.useForm();

  // 新建用户
  const handleAdd = useCallback(() => {
    setEditingUser(null);
    form.resetFields();
    setEditModalOpen(true);
  }, [form]);

  // 编辑用户
  const handleEdit = useCallback((record: UserRow) => {
    setEditingUser(record);
    form.setFieldsValue({
      name: record.name,
      age: record.age,
      email: record.email || '',
      birthday: record.birthday ? dayjs(record.birthday) : undefined,
    });
    setEditModalOpen(true);
  }, [form]);

  // 提交表单
  const handleSubmit = useCallback(async () => {
    const values = await form.validateFields();
    const payload = {
      name: values.name,
      age: values.age,
      email: values.email || null,
      birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : null,
    };

    try {
      if (editingUser) {
        await updateUser(editingUser.id, payload);
        message.success('用户更新成功');
      } else {
        await createUser(payload);
        message.success('用户创建成功');
      }
      setEditModalOpen(false);
      actionRef.current?.reload();
    } catch (e: any) {
      message.error(e.message || '操作失败');
    }
  }, [editingUser, form]);

  // 删除用户
  const handleDelete = useCallback(async (record: UserRow) => {
    Modal.confirm({
      title: `确定要删除 ${record.name} 吗？`,
      okType: 'danger',
      async onOk() {
        try {
          await deleteUser(record.id);
          message.success('删除成功');
          actionRef.current?.reload();
        } catch (e: any) {
          message.error(e.message || '删除失败');
        }
      },
    });
  }, []);

  const columns: ProColumns<UserRow>[] = useMemo(() => [
    { title: 'ID', dataIndex: 'id', width: 80, search: false },
    {
      title: '姓名',
      dataIndex: 'name',
      ellipsis: true,
      formItemProps: { rules: [{ required: true, message: '姓名为必填项' }] },
    },
    {
      title: '年龄',
      dataIndex: 'age',
      valueType: 'digit',
      width: 100,
      sorter: true,
    },
    {
      title: '生日',
      dataIndex: 'birthday',
      valueType: 'date',
      width: 120,
      search: false,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      ellipsis: true,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'age',
      width: 100,
      search: false,
      render: (_, record) => (
        <Tag color={record.age && record.age > 20 ? 'green' : 'orange'}>
          {record.age && record.age > 20 ? '活跃' : '非活跃'}
        </Tag>
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ], [handleEdit, handleDelete]);

  const breadcrumbItemRender = useCallback(
    (route: BreadcrumbRoute) => {
      const { path, title } = route;
      return path ? <Link to={path}>{title}</Link> : <span>{title}</span>;
    },
    [],
  );

  const handleRequest = useCallback(async (params: Record<string, any>) => {
    try {
      const result = await getUsers({
        current: params.current,
        pageSize: params.pageSize,
        name: params.name,
        age: params.age,
      });
      return {
        data: result.data,
        success: true,
        total: result.total,
        current: result.current,
        pageSize: result.pageSize,
      };
    } catch {
      return { data: [], success: false, total: 0 };
    }
  }, []);

  return (
    <PageContainer
      fixedHeader
      header={{
        title: '用户管理',
        subTitle: '数据读写 Supabase Postgres',
        breadcrumb: {
          itemRender: breadcrumbItemRender,
          items: [{ title: '网站' }, { title: '首页' }],
        },
      }}
    >
      <ProTable<UserRow>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={handleRequest}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
        }}
        search={{ labelWidth: 'auto', defaultCollapsed: false }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建用户
          </Button>,
        ]}
        scroll={{ x: 800 }}
      />

      <Modal
        title={editingUser ? '编辑用户' : '新建用户'}
        open={editModalOpen}
        onOk={handleSubmit}
        onCancel={() => setEditModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="年龄" name="age" rules={[{ required: true, message: '请输入年龄' }]}>
            <InputNumber min={0} max={150} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="邮箱" name="email">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item label="生日" name="birthday">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
});

Home.displayName = 'Home';

export default Home;