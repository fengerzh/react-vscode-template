/**
 * 新增/编辑弹窗：Modal + Form。
 * record 非空为编辑态（打开时回填），否则为新增态（清空）。
 * onOk 先 validateFields 校验通过后把表单值回调上抛。
 */
import { useEffect } from 'react';
import {
  Modal, Form, Input, InputNumber, Select,
} from 'antd';
import type { Customer, CustomerFormValues } from '../types';
import { CUSTOMER_STATUSES } from '../types';

/* eslint-disable no-unused-vars -- 回调参数名用于契约文档化 */
interface EditModalProps {
  open: boolean;
  /** null = 新增；非空 = 编辑该记录 */
  record: Customer | null;
  onOk: (_values: CustomerFormValues) => Promise<void> | void;
  onCancel: () => void;
}
/* eslint-enable no-unused-vars */

function EditModal({
  open, record, onOk, onCancel,
}: EditModalProps) {
  const [form] = Form.useForm<CustomerFormValues>();
  const isEdit = record !== null;

  // 打开时按记录回填；新增态重置表单
  useEffect(() => {
    if (!open) return;
    if (record) {
      form.setFieldsValue({
        name: record.name,
        age: record.age,
        email: record.email || undefined,
        birthday: record.birthday || undefined,
        status: record.status || undefined,
      });
    } else {
      form.resetFields();
    }
  }, [open, record, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onOk(values);
    } catch {
      // 校验失败：antd 已在表单项下方提示，此处无事可做
    }
  };

  return (
    <Modal
      title={isEdit ? '编辑客户' : '新增客户'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="保存"
      cancelText="取消"
      destroyOnClose
      maskClosable={false}
    >
      <Form<CustomerFormValues> form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          label="客户名称"
          name="name"
          rules={[{ required: true, message: '请输入客户名称' }]}
        >
          <Input placeholder="请输入客户名称" />
        </Form.Item>
        <Form.Item
          label="年龄"
          name="age"
          rules={[{ required: true, message: '请输入年龄' }]}
        >
          <InputNumber min={0} max={150} style={{ width: '100%' }} placeholder="请输入年龄" />
        </Form.Item>
        <Form.Item label="邮箱" name="email" rules={[{ type: 'email', message: '邮箱格式不正确' }]}>
          <Input placeholder="name@example.com" allowClear />
        </Form.Item>
        <Form.Item label="生日" name="birthday" extra="格式 YYYY-MM-DD">
          <Input placeholder="如 1990-01-01" allowClear />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Select placeholder="请选择状态" options={[...CUSTOMER_STATUSES]} allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditModal;
