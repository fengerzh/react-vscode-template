import React, { memo, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { PageContainer } from "@ant-design/pro-components";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import { Button, Space, Tag } from "antd";
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
  ], []);

  // 面包屑渲染函数
  const breadcrumbItemRender = useCallback((route: BreadcrumbRoute) => {
    const { path, title } = route;
    return path ? <Link to={path}>{title}</Link> : <span>{title}</span>;
  }, []);

  // 表格数据请求函数
  const handleRequest = useCallback(async (params: TableParams) => {
    try {
      const response = await getUsers(params);
      const { data, total, current, pageSize } = response.data;

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

  // 编辑用户
  const handleEdit = useCallback((record: User) => {
    console.log("编辑用户:", record);
    // TODO: 实现编辑逻辑
  }, []);

  // 删除用户
  const handleDelete = useCallback((record: User) => {
    console.log("删除用户:", record);
    // TODO: 实现删除逻辑
  }, []);

  // 添加用户
  const handleAdd = useCallback(() => {
    console.log("添加用户");
    // TODO: 实现添加逻辑
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
        subTitle: "管理系统用户信息",
        breadcrumb: {
          itemRender: breadcrumbItemRender,
          items: breadcrumbItems,
        },
      }}
    >
      <ProTable<User>
        rowKey="id"
        columns={columns}
        request={handleRequest}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
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
    </PageContainer>
  );
});

Home.displayName = "Home";

export default Home;
