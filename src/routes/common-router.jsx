import { lazy } from 'react';
import { HomeOutlined } from '@ant-design/icons';

const BasicLayout = lazy(() => import('@/layout/BasicLayout'));
const Home = lazy(() => import('@/pages/home'));

export default [
  {
    path: '/dashboard',
    key: 'dashboard',
    component: BasicLayout,
    routes: [
      {
        path: '/dashboard',
        key: 'dashboard',
        redirect: '/dashboard/home',
      },
      {
        name: '首页',
        path: '/dashboard/home',
        key: 'home',
        icon: <HomeOutlined />,
        component: Home,
      },
    ],
  },
  {
    path: '/',
    key: 'root',
    redirect: '/dashboard',
  },
];
