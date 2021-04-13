import { lazy } from 'react';

const Home = lazy(() => import('@/pages/home'));

export default [
  {
    name: '首页',
    path: '/home',
    key: 'home',
    component: Home,
  },
];
