/**
 * Customer 页面入口：组合 SearchForm + Table + EditModal。
 * 页内状态（搜索条件/分页/弹窗开关）留在 React 局部状态；跨页共享状态才入 Zustand。
 */
import { useCallback, useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SearchForm from './components/SearchForm';
import TableView from './components/Table';
import EditModal from './components/EditModal';
import {
  getList, create, update, remove,
} from './service';
import type { Customer, CustomerFormValues, CustomerQuery } from './types';

function Customer() {
  const [dataSource, setDataSource] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<CustomerQuery>({ current: 1, pageSize: 10 });
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);

  // 加载列表：参数即最新查询条件
  const loadList = useCallback(async (params: CustomerQuery) => {
    setLoading(true);
    try {
      const result = await getList(params);
      setDataSource(result.data);
      setTotal(result.total);
      setQuery(params);
    } catch {
      message.error('加载列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 首次进入默认加载第一页
  useEffect(() => {
    loadList({ current: 1, pageSize: 10 });
  }, [loadList]);

  const handleSearch = useCallback((values: CustomerQuery) => {
    loadList({ current: 1, pageSize: query.pageSize, ...values });
  }, [loadList, query.pageSize]);

  const handleReset = useCallback(() => {
    loadList({ current: 1, pageSize: query.pageSize });
  }, [loadList, query.pageSize]);

  const handlePageChange = useCallback((page: number, pageSize: number) => {
    loadList({ ...query, current: page, pageSize });
  }, [loadList, query]);

  const handleOpenAdd = useCallback(() => {
    setEditing(null);
    setEditOpen(true);
  }, []);

  const handleOpenEdit = useCallback((record: Customer) => {
    setEditing(record);
    setEditOpen(true);
  }, []);

  const handleSubmit = useCallback(async (values: CustomerFormValues) => {
    if (editing) {
      await update(editing.id, values);
      message.success('更新成功');
    } else {
      await create(values);
      message.success('新增成功');
    }
    setEditOpen(false);
    loadList(query);
  }, [editing, query, loadList]);

  const handleDelete = useCallback(async (record: Customer) => {
    try {
      await remove(record.id);
      message.success('删除成功');
      loadList(query);
    } catch {
      message.error('删除失败');
    }
  }, [query, loadList]);

  return (
    <PageContainer
      header={{
        title: '客户管理',
        subTitle: 'Customer CRUD 模板演示',
        extra: (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>
            新增客户
          </Button>
        ),
      }}
    >
      <SearchForm onSearch={handleSearch} onReset={handleReset} />
      <TableView
        dataSource={dataSource}
        total={total}
        loading={loading}
        page={query.current || 1}
        pageSize={query.pageSize || 10}
        onPageChange={handlePageChange}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />
      <EditModal
        open={editOpen}
        record={editing}
        onOk={handleSubmit}
        onCancel={() => setEditOpen(false)}
      />
    </PageContainer>
  );
}

export default Customer;
