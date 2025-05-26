import { Link } from 'react-router-dom';
import { PageContainer } from '@ant-design/pro-components';
import ProTable from '@ant-design/pro-table';
import { getUsers } from '@/services';

const Home = () => {
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      valueType: 'digit',
    },
    {
      title: '生日',
      dataIndex: 'birthday',
      valueType: 'date',
    },
  ];

  const breadcrumbItemRender = (route: any) => (
    route.path
      ? <Link to={route.path}>{route.breadcrumbName}</Link>
      : <span>{route.breadcrumbName}</span>
  );

  return (
    <PageContainer
      fixedHeader
      header={{
        title: '首页',
        subTitle: '这里是首页',
        breadcrumb: {
          itemRender: breadcrumbItemRender,
          items: [
            {
              title: '网站',
            },
            {
              title: '首页',
            },
          ],
        },
      }}
    >
      <ProTable
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const { data } = await getUsers(params);
          return data;
        }}
      />
    </PageContainer>
  );
};

export default Home;
