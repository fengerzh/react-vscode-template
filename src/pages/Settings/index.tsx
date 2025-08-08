import React, { memo, useCallback } from "react";
import { PageContainer } from "@ant-design/pro-components";
import { Button, Form, Input, message, Card, Space } from "antd";

interface FormValues {
  displayName: string;
  email: string;
}

const Settings: React.FC = memo(() => {
  const [form] = Form.useForm<FormValues>();

  const handleSubmit = useCallback(async () => {
    try {
      await form.validateFields();
      // 在此处调用保存接口
      message.success("保存成功");
    } catch (error) {
      // 校验失败已由 antd 提示
    }
  }, [form]);

  return (
    <PageContainer
      header={{
        title: "个人设置",
        subTitle: "管理个人资料与偏好",
      }}
    >
      <Card>
        <Form form={form} layout="vertical" initialValues={{ displayName: "", email: "" }}>
          <Form.Item
            label="显示名称"
            name="displayName"
            rules={[{ required: true, message: "请输入显示名称" }]}
          >
            <Input placeholder="请输入显示名称" allowClear />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "邮箱格式不正确" },
            ]}
          >
            <Input placeholder="name@example.com" allowClear />
          </Form.Item>

          <Space>
            <Button type="primary" onClick={handleSubmit}>
              保存
            </Button>
            <Button onClick={() => form.resetFields()}>重置</Button>
          </Space>
        </Form>
      </Card>
    </PageContainer>
  );
});

Settings.displayName = "Settings";

export default Settings;


