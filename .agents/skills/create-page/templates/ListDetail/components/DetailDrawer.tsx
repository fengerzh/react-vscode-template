/**
 * 详情抽屉：受控展示选中记录的详细信息。
 * 展示用 record 快照（列表已含详情字段）；若详情字段不全，可在此处打开时调用 getDetail 拉全。
 */
import { Drawer, Descriptions, Tag } from 'antd';
import { ORDER_STATUSES } from '../types';
import type { Order } from '../types';

interface DetailDrawerProps {
  open: boolean;
  /** null 表示未选择任何记录 */
  record: Order | null;
  onClose: () => void;
}

function DetailDrawer({ open, record, onClose }: DetailDrawerProps) {
  const statusLabel = record
    ? ORDER_STATUSES.find((s) => s.value === record.status)?.label ?? '-'
    : '-';

  return (
    <Drawer
      title="订单详情"
      width={480}
      open={open}
      onClose={onClose}
      destroyOnClose
    >
      {record && (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="ID">{record.id}</Descriptions.Item>
          <Descriptions.Item label="订单号">{record.order_no}</Descriptions.Item>
          <Descriptions.Item label="客户">{record.customer_name}</Descriptions.Item>
          <Descriptions.Item label="金额">¥ {record.amount ?? 0}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={record.status === 'done' ? 'green' : 'blue'}>{statusLabel}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="备注">{record.remark || '-'}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{record.created_at || '-'}</Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
}

export default DetailDrawer;
