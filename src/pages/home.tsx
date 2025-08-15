import React, {
  memo, useCallback, useMemo, useOptimistic, startTransition,
} from "react";
import { Link } from "react-router-dom";
import { PageContainer } from "@ant-design/pro-components";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import {
  Button, Space, Tag, FloatButton, message,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { getUsers, User } from "@/services";

// 面包屑路由类型
interface BreadcrumbRoute {
  path?: string;
  title?: React.ReactNode;
}

// 表格请求参数类型
interface TableParams {
  current?: number;
  pageSize?: number;
  [key: string]: unknown;
}

const Home: React.FC = memo(() => {
  // 使用 useOptimistic 进行乐观更新
  const [optimisticUsers, addOptimisticUser] = useOptimistic<User[]>(
    [], // 初始状态
  );

  // 编辑用户
  const handleEdit = useCallback((record: User) => {
    message.info(`编辑用户: ${record.name}`);
    // TODO: 实现编辑逻辑
  }, []);

  // 删除用户 - 使用乐观更新
  const handleDelete = useCallback(async (record: User) => {
    try {
      // 乐观更新：立即从列表中移除用户
      startTransition(() => {
        addOptimisticUser((prev) => prev.filter((user) => user.id !== record.id));
      });

      // 模拟 API 调用
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      // 如果成功，显示成功消息
      message.success("用户删除成功");
    } catch {
      // 如果失败，自动回滚到原始状态
      message.error("删除失败，请重试");
    }
  }, [addOptimisticUser]);

  // 添加用户
  const handleAdd = useCallback(async () => {
    try {
      const newUser: User = {
        id: Date.now(),
        name: `新用户${Date.now()}`,
        age: Math.floor(Math.random() * 50) + 18,
        email: `user${Date.now()}@example.com`,
      };

      // 乐观更新：立即添加到列表中
      startTransition(() => {
        addOptimisticUser((prev) => [...prev, newUser]);
      });

      // 模拟 API 调用
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      message.success("用户添加成功");
    } catch {
      message.error("添加失败，请重试");
    }
  }, [addOptimisticUser]);

  // 表格列配置
  const columns: ProColumns<User>[] = useMemo(() => [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
      search: false,
    },
    {
      title: "姓名",
      dataIndex: "name",
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "姓名为必填项",
          },
        ],
      },
    },
    {
      title: "年龄",
      dataIndex: "age",
      valueType: "digit",
      width: 100,
      sorter: true,
      fieldProps: {
        min: 0,
        max: 150,
      },
    },
    {
      title: "生日",
      dataIndex: "birthday",
      valueType: "date",
      width: 120,
      search: false,
    },
    {
      title: "邮箱",
      dataIndex: "email",
      valueType: "text",
      ellipsis: true,
      search: false,
    },
    {
      title: "状态",
      dataIndex: "status",
      valueType: "select",
      width: 100,
      valueEnum: {
        active: { text: "活跃", status: "Success" },
        inactive: { text: "非活跃", status: "Default" },
      },
      render: (_, record) => (
        <Tag color={record.age && record.age > 20 ? "green" : "orange"}>
          {record.age && record.age > 20 ? "活跃" : "非活跃"}
        </Tag>
      ),
    },
    {
      title: "操作",
      valueType: "option",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ], [handleEdit, handleDelete]);

  // 面包屑渲染函数
  const breadcrumbItemRender = useCallback((route: BreadcrumbRoute) => {
    const { path, title } = route;
    return path ? <Link to={path}>{title}</Link> : <span>{title}</span>;
  }, []);

  // 表格数据请求函数
  const handleRequest = useCallback(async (params: TableParams) => {
    try {
      const response = await getUsers(params);
      const {
        data, total, current, pageSize,
      } = response.data;

      return {
        data,
        success: true,
        total,
        current,
        pageSize,
      };
    } catch (error) {
      console.error("获取用户列表失败:", error);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  }, []);

  // 面包屑配置
  const breadcrumbItems = useMemo(() => [
    {
      title: "网站",
    },
    {
      title: "首页",
    },
  ], []);

  return (
    <PageContainer
      fixedHeader
      header={{
        title: "用户管理",
        subTitle: "管理系统用户信息 (使用 React 19 useOptimistic)",
        breadcrumb: {
          itemRender: breadcrumbItemRender,
          items: breadcrumbItems,
        },
      }}
    >
      {/* 显示乐观更新状态 */}
      {optimisticUsers.length > 0 && (
        <div
          style={{
            marginBottom: 16,
            padding: 8,
            backgroundColor: "#e6f7ff",
            border: "1px solid #91d5ff",
            borderRadius: 4,
          }}
        >
          <p style={{ margin: 0, color: "#1890ff" }}>
            ⚡ 乐观更新状态:
            {" "}
            {optimisticUsers.length}
            {" "}
            个操作正在进行中...
          </p>
        </div>
      )}

      <ProTable<User>
        rowKey="id"
        columns={columns}
        request={handleRequest}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
        }}
        search={{
          labelWidth: "auto",
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新建用户
          </Button>,
        ]}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        scroll={{ x: 800 }}
      />

      {/* 页面专用浮动按钮 */}
      <FloatButton
        icon={<PlusOutlined />}
        tooltip="快速添加用户"
        onClick={handleAdd}
        style={{
          right: 24,
          bottom: 120, // 避免与全局浮动按钮重叠
        }}
      />
    </PageContainer>
  );
});

Home.displayName = "Home";

export default Home;
