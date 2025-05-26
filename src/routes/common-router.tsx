import { lazy } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Navigate } from 'react-router-dom';

const BasicLayout = lazy(() => import('@/layout/BasicLayout'));
const Home = lazy(() => import('@/pages/home'));

export default [
  {
    path: '/dashboard/*',
    key: 'dashboard',
    component: BasicLayout,
    auth: true,
    children: [
      {
        index: true,
        redirect: 'home',
      },
      {
        name: '首页',
        path: 'home',
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
