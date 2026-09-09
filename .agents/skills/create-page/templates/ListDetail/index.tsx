/**
 * Order 页面入口（列表详情型）：组合 ListTable + DetailDrawer。
 * 页内状态（查询/分页/详情抽屉开关）留在 React 局部状态；跨页共享状态才入 Zustand。
 *
 * 路由懒加载注册示例（React Router 8，必须从 'react-router' 导入，无 react-router-dom）：
 *   const Order = lazy(() => import('@/pages/Order'));
 *   // 在 src/routes/common-router.tsx 的 dashboard children 中追加：
 *   // { name: '订单管理', path: 'order', key: 'order', component: Order }
 */
import { useCallback, useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { message } from 'antd';
import ListTable from './components/ListTable';
import DetailDrawer from './components/DetailDrawer';
import { getList } from './service';
import type { Order, OrderQuery } from './types';

function Order() {
  const [dataSource, setDataSource] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<OrderQuery>({ current: 1, pageSize: 10 });
  const [detail, setDetail] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const loadList = useCallback(async (params: OrderQuery) => {
    setLoading(true);
    try {
      const result = await getList(params);
      setDataSource(result.data);
      setTotal(result.total);
      setQuery(params);
    } catch {
      message.error('加载订单列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadList({ current: 1, pageSize: 10 });
  }, [loadList]);

  const handleSearch = useCallback((values: OrderQuery) => {
    loadList({ current: 1, pageSize: query.pageSize, ...values });
  }, [loadList, query.pageSize]);

  const handleReset = useCallback(() => {
    loadList({ current: 1, pageSize: query.pageSize });
  }, [loadList, query.pageSize]);

  const handlePageChange = useCallback((page: number, pageSize: number) => {
    loadList({ ...query, current: page, pageSize });
  }, [loadList, query]);

  const handleView = useCallback((record: Order) => {
    setDetail(record);
    setDetailOpen(true);
  }, []);

  return (
    <PageContainer
      header={{
        title: '订单管理',
        subTitle: '列表详情型页面模板（Order）',
      }}
    >
      <ListTable
        dataSource={dataSource}
        total={total}
        loading={loading}
        query={query}
        onSearch={handleSearch}
        onReset={handleReset}
        onPageChange={handlePageChange}
        onView={handleView}
      />
      <DetailDrawer
        open={detailOpen}
        record={detail}
        onClose={() => setDetailOpen(false)}
      />
    </PageContainer>
  );
}

export default Order;
