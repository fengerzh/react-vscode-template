import { Link } from 'react-router-dom';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { getUsers } from '../services';

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

  /**
   * 生成面包屑内容
   * @param {*} route
   */
  const breadcrumbItemRender = (route) => (
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
          routes: [
            {
              breadcrumbName: '网站',
            },
            {
              breadcrumbName: '首页',
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
