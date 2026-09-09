/**
 * 搜索表单：仅承载搜索条件，提交与重置通过回调上抛。受控、无副作用。
 */
import {
  Form, Input, InputNumber, Button, Space,
} from 'antd';
import type { CustomerQuery } from '../types';

// 回调参数名用于契约文档化；项目 ESLint 未开启参数名豁免，此处局部豁免
/* eslint-disable no-unused-vars */
interface SearchFormProps {
  /** 提交搜索条件（不含分页） */
  onSearch: (_values: CustomerQuery) => void;
  /** 重置条件后重新加载 */
  onReset: () => void;
}
/* eslint-enable no-unused-vars */

function SearchForm({ onSearch, onReset }: SearchFormProps) {
  const [form] = Form.useForm<CustomerQuery>();

  const handleFinish = (values: CustomerQuery) => {
    onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Form<CustomerQuery>
      form={form}
      layout="inline"
      onFinish={handleFinish}
      style={{ marginBottom: 16 }}
    >
      <Form.Item name="name" label="客户名称">
        <Input placeholder="请输入客户名称" allowClear />
      </Form.Item>
      <Form.Item name="age" label="年龄">
        <InputNumber min={0} max={150} placeholder="请输入年龄" />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">查询</Button>
          <Button onClick={handleReset}>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default SearchForm;
