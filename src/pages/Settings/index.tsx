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

// 模拟已保存的服务端数据
const savedData: FormValues = { displayName: "张三", email: "zhangsan@example.com" };

const Settings: React.FC = memo(() => {
  const [form] = Form.useForm<FormValues>();

  // useOptimistic：基于 savedData，在提交期间乐观展示用户刚填的新值
  const [optimisticData, addOptimisticData] = useOptimistic<FormValues, FormValues>(
    savedData,
    (_current, newValues) => newValues,
  );

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();

      // React 19: 异步操作必须在 startTransition 内部，
      // 这样 useOptimistic 才能在整个异步过程中保持乐观值
      startTransition(async () => {
        addOptimisticData(values);

        // 模拟 API 调用（2秒延迟）
        await new Promise((resolve) => {
          setTimeout(resolve, 2000);
        });

        // 模拟成功：实际场景中 savedData 应从服务端刷新
        Object.assign(savedData, values);
        message.success("保存成功");
      });
    } catch (e: any) {
      if (e?.errorFields) return;
      message.error(e?.message || '保存失败');
    }
  }, [form, addOptimisticData]);

  return (
    <PageContainer
      header={{
        title: "个人设置",
        subTitle: "管理个人资料与偏好（useOptimistic 演示）",
      }}
    >
      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={savedData}
        >
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
            <Button
              type="primary"
              onClick={handleSubmit}
            >
              保存
            </Button>
            <Button onClick={() => form.resetFields()}>重置</Button>
          </Space>
        </Form>

        {/* 乐观更新状态展示：表单提交后立即反映新值，无需等待服务端响应 */}
        <Card
          size="small"
          title="当前生效的设置（乐观更新）"
          style={{ marginTop: 24 }}
        >
          <p>显示名称：{optimisticData.displayName || "—"}</p>
          <p style={{ margin: 0 }}>邮箱：{optimisticData.email || "—"}</p>
        </Card>
      </Card>
    </PageContainer>
  );
});

Settings.displayName = "Settings";

export default Settings;
