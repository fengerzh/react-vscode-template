/**
 * 个人资料表单：Ant Design Form 大表单示例。
 * 覆盖：Input / InputNumber / Radio / Select(multiple) / TextArea / Form.List 动态项 /
 * 自定义 validator / 编辑回填（initialValues 变化时 setFieldsValue）。
 * 受控提交（onSubmit 上抛校验后的值）。
 */
import { useEffect } from 'react';
import {
  Form, Input, InputNumber, Radio, Select, Button, Space,
} from 'antd';
import {
  MinusCircleOutlined, PlusOutlined,
} from '@ant-design/icons';
import {
  PROFILE_ROLES,
} from '../types';
import type { ProfileFormValues, ProfileSkill } from '../types';

/* eslint-disable no-unused-vars -- 回调参数名用于契约文档化 */
interface ProfileFormProps {
  /** 编辑态回填数据；切换记录时应变化以触发回填 */
  initialValues?: ProfileFormValues | null;
  submitting?: boolean;
  onSubmit: (_values: ProfileFormValues) => Promise<boolean> | boolean;
}
/* eslint-enable no-unused-vars */

function ProfileForm({
  initialValues = null, submitting = false, onSubmit,
}: ProfileFormProps) {
  const [form] = Form.useForm<ProfileFormValues>();

  // 编辑回填：打开/切换记录时把后端数据写回表单
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = async (values: ProfileFormValues) => {
    const ok = await onSubmit(values);
    if (ok) form.resetFields();
  };

  return (
    <Form<ProfileFormValues>
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      requiredMark
    >
      <Form.Item
        label="姓名"
        name="name"
        rules={[
          { required: true, message: '请输入姓名' },
          {
            validator: (_rule, value: unknown) => {
              if (value === 'admin') return Promise.reject(new Error('姓名不能为 admin'));
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input placeholder="请输入姓名" maxLength={20} allowClear />
      </Form.Item>

      <Form.Item
        label="年龄"
        name="age"
        rules={[{ required: true, message: '请输入年龄' }]}
      >
        <InputNumber min={0} max={150} style={{ width: '100%' }} placeholder="请输入年龄" />
      </Form.Item>

      <Form.Item
        label="角色"
        name="role"
        rules={[{ required: true, message: '请选择角色' }]}
      >
        <Radio.Group options={[...PROFILE_ROLES]} />
      </Form.Item>

      <Form.Item
        label="邮箱"
        name="email"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '邮箱格式不正确' },
        ]}
      >
        <Input placeholder="name@example.com" allowClear />
      </Form.Item>

      <Form.Item label="兴趣标签" name="tags">
        <Select
          mode="multiple"
          placeholder="可多选（选填）"
          allowClear
          options={[
            { label: '前端', value: 'fe' },
            { label: '后端', value: 'be' },
            { label: 'AI', value: 'ai' },
            { label: '设计', value: 'design' },
          ]}
        />
      </Form.Item>

      <Form.Item label="技能清单" required>
        <Form.List name="skills">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                  <Form.Item
                    name={[name, 'name']}
                    rules={[{ required: true, message: '请输入技能名' }]}
                    noStyle
                  >
                    <Input placeholder="技能名（如 TypeScript）" />
                  </Form.Item>
                  <Form.Item
                    name={[name, 'level']}
                    rules={[{ required: true, message: '请输入水平' }]}
                    noStyle
                  >
                    <InputNumber min={0} max={5} placeholder="水平 0-5" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Button
                type="dashed"
                onClick={() => add({ name: '', level: 0 } as ProfileSkill)}
                block
                icon={<PlusOutlined />}
              >
                添加技能
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item label="个人简介" name="bio">
        <Input.TextArea placeholder="选填，一句话介绍自己" rows={3} maxLength={200} showCount />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={submitting}>
            保存
          </Button>
          <Button onClick={() => form.resetFields()}>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default ProfileForm;
