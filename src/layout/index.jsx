import { Component } from 'react';
import PropTypes from 'prop-types';
import ProLayout from '@ant-design/pro-layout';
import { HomeOutlined } from '@ant-design/icons';

const propTypes = {
  children: PropTypes.shape(),
};
const defaultProps = {
  children: null,
};

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { children } = this.props;
    return (
      <ProLayout
        navTheme="light"
        menuHeaderRender={false}
        route={{
          routes: [
            {
              path: '/home',
              name: '首页',
              icon: <HomeOutlined />,
              component: './Welcome',
            },
          ],
        }}
        contentStyle={{ display: 'flex', flexDirection: 'column' }}
        headerRender={false}
        disableContentMargin
      >
        {children}
      </ProLayout>
    );
  }
}

Layout.propTypes = propTypes;
Layout.defaultProps = defaultProps;

export default Layout;
