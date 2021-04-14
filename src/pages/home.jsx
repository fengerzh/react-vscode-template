import { Component } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { getUsers } from '../services';

class Home extends Component {
  columns = [{
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
  }]

  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 生成面包屑内容
   * @param {*} route
   */
  breadcrumbItemRender = (route) => (
    route.path
      ? <Link to={route.path}>{route.breadcrumbName}</Link>
      : <span>{route.breadcrumbName}</span>
  )

  render() {
    return (
      <PageContainer
        fixedHeader
        header={{
          title: '首页',
          subTitle: '这里是首页',
          breadcrumb: {
            itemRender: this.breadcrumbItemRender,
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
          columns={this.columns}
          request={async (params) => {
            const { data } = await getUsers(params);
            return data;
          }}
        />
      </PageContainer>
    );
  }
}

export default Home;
