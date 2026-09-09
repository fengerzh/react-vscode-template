/**
 * Profile 页面入口（create-form 大表单示例）：加载详情 -> 编辑回填 -> 提交更新。
 * 提交走 service，成功消息反馈 + 重置；页内状态留 React 局部状态。
 *
 * 路由懒加载注册示例（React Router 8）：
 *   const Profile = lazy(() => import('@/pages/Profile'));
 *   // { name: '个人资料', path: 'profile', key: 'profile', component: Profile }
 */
import { useCallback, useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Spin, message } from 'antd';
import ProfileForm from './components/ProfileForm';
import { getProfileDetail, updateProfile } from './service';
import type { ProfileFormValues } from './types';

// 示例取 id=1 的记录做编辑回填；接入真实页时改为从路由参数读取
const EDIT_ID = 1;

function Profile() {
  const [initial, setInitial] = useState<ProfileFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const record = await getProfileDetail(EDIT_ID);
      setInitial({
        name: record.name,
        age: record.age,
        role: record.role,
        email: record.email,
        tags: record.tags ?? [],
        bio: record.bio ?? '',
        skills: record.skills ?? [],
      });
    } catch {
      message.error('加载资料失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = useCallback(async (values: ProfileFormValues) => {
    setSubmitting(true);
    try {
      await updateProfile(EDIT_ID, values);
      message.success('保存成功');
      return true;
    } catch {
      message.error('保存失败');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return (
    <PageContainer
      header={{
        title: '个人资料',
        subTitle: 'create-form 大表单模板（Profile）',
      }}
    >
      <Card title="编辑资料" style={{ maxWidth: 640 }}>
        <Spin spinning={loading}>
          <ProfileForm initialValues={initial} submitting={submitting} onSubmit={handleSubmit} />
        </Spin>
      </Card>
    </PageContainer>
  );
}

export default Profile;
