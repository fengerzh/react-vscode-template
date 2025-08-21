import React, {
  memo, useCallback, useOptimistic, startTransition,
} from "react";
import { PageContainer } from "@ant-design/pro-components";
import {
  Button, Form, Input, message, Card, Space,
} from "antd";

interface FormValues {
  displayName: string;
  email: string;
}

const Settings: React.FC = memo(() => {
  const [form] = Form.useForm<FormValues>();

  // 使用 useOptimistic 进行乐观更新
  const [optimisticData, addOptimisticData] = useOptimistic<FormValues | null>(
    null,
  );

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();

      // 乐观更新：立即显示新的表单值
      startTransition(() => {
        addOptimisticData(values);
      });

      // 模拟 API 调用
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });

      // 如果成功，显示成功消息
      message.success("保存成功");

      // 清除乐观更新状态
      startTransition(() => {
        addOptimisticData(null);
      });
    } catch {
      // 校验失败已由 antd 提示
      // 乐观更新会自动回滚
    }
  }, [form, addOptimisticData]);

  return (
    <PageContainer
      header={{
        title: "个人设置",
        subTitle: "管理个人资料与偏好",
      }}
    >
      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ displayName: "", email: "" }}
        >
          <Form.Item
            label="显示名称"
            name="displayName"
            rules={[{ required: true, message: "请输入显示名称" }]}
          >
            <Input
              placeholder="请输入显示名称"
              allowClear
              // 显示乐观更新的值
              value={optimisticData?.displayName || undefined}
            />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "邮箱格式不正确" },
            ]}
          >
            <Input
              placeholder="name@example.com"
              allowClear
              // 显示乐观更新的值
              value={optimisticData?.email || undefined}
            />
          </Form.Item>

          <Space>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={optimisticData !== null}
            >
              {optimisticData ? "保存中..." : "保存"}
            </Button>
            <Button onClick={() => form.resetFields()}>重置</Button>
          </Space>
        </Form>

        {/* 显示乐观更新状态 */}
        {optimisticData && (
          <div style={{
            marginTop: 16, padding: 8, backgroundColor: "#f6ffed", border: "1px solid #b7eb8f", borderRadius: 4,
          }}
          >
            <p style={{ margin: 0, color: "#52c41a" }}>
              ⚡ 正在保存更改...
            </p>
          </div>
        )}
      </Card>
    </PageContainer>
  );
});

Settings.displayName = "Settings";

export default Settings;
