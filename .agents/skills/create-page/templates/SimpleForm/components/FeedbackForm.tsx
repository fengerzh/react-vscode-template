/**
 * 反馈表单：Ant Design Form，受控提交（onSubmit 上抛校验后的值，返回值决定是否重置）。
 * 校验规则写在 Form.Item rules，可执行、可测试。
 */
import {
  Form, Input, Radio, Button, Space,
} from 'antd';
import { FEEDBACK_CATEGORIES } from '../types';
import type { FeedbackFormValues } from '../types';

/* eslint-disable no-unused-vars -- 回调参数名用于契约文档化 */
interface FeedbackFormProps {
  submitting?: boolean;
  /** 返回 true 表示成功（页面据此重置表单） */
  onSubmit: (_values: FeedbackFormValues) => Promise<boolean> | boolean;
}
/* eslint-enable no-unused-vars */

function FeedbackForm({ submitting = false, onSubmit }: FeedbackFormProps) {
  const [form] = Form.useForm<FeedbackFormValues>();

  const handleFinish = async (values: FeedbackFormValues) => {
    const ok = await onSubmit(values);
    if (ok) form.resetFields();
  };

  return (
    <Form<FeedbackFormValues>
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      requiredMark
    >
      <Form.Item
        label="标题"
        name="title"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input placeholder="一句话概括你的反馈" maxLength={50} showCount />
      </Form.Item>
      <Form.Item
        label="分类"
        name="category"
        rules={[{ required: true, message: '请选择分类' }]}
      >
        <Radio.Group options={[...FEEDBACK_CATEGORIES]} />
      </Form.Item>
      <Form.Item
        label="内容"
        name="content"
        rules={[
          { required: true, message: '请输入反馈内容' },
          { min: 5, message: '内容至少 5 个字' },
        ]}
      >
        <Input.TextArea
          placeholder="请详细描述您的意见或问题"
          rows={4}
          maxLength={500}
          showCount
        />
      </Form.Item>
      <Form.Item
        label="联系方式"
        name="contact"
        rules={[
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入 11 位手机号',
          },
        ]}
      >
        <Input placeholder="选填，便于我们与您联系" maxLength={11} allowClear />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={submitting}>
            提交反馈
          </Button>
          <Button onClick={() => form.resetFields()}>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default FeedbackForm;
