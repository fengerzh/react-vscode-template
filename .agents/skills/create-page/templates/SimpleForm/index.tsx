/**
 * Feedback 页面入口（简单表单型）：独立路由页承载一个表单。
 * 提交走 service，成功后消息反馈 + 重置表单；页内无跨页共享状态。
 *
 * 路由懒加载注册示例（React Router 8）：
 *   const Feedback = lazy(() => import('@/pages/Feedback'));
 *   // { name: '意见反馈', path: 'feedback', key: 'feedback', component: Feedback }
 */
import { useCallback, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, message } from 'antd';
import FeedbackForm from './components/FeedbackForm';
import { createFeedback } from './service';
import type { FeedbackFormValues } from './types';

function Feedback() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async (values: FeedbackFormValues) => {
    setSubmitting(true);
    try {
      await createFeedback(values);
      message.success('反馈已提交');
      return true;
    } catch {
      message.error('提交失败');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return (
    <PageContainer
      header={{
        title: '意见反馈',
        subTitle: '简单表单型页面模板（Feedback）',
      }}
    >
      <Card title="填写反馈内容" style={{ maxWidth: 640 }}>
        <FeedbackForm submitting={submitting} onSubmit={handleSubmit} />
      </Card>
    </PageContainer>
  );
}

export default Feedback;
