import { lazy } from 'react';

const UserLayout = lazy(() => import('@/layout/UserLayout'));
const Login = lazy(() => import('@/pages/User/Login'));

export default [
  {
    path: '/user',
    key: 'user',
    component: UserLayout,
    routes: [
      {
        path: '/user',
        key: 'user',
        redirect: '/user/login',
      },
      {
        name: '登录',
        path: '/user/login',
        key: 'login',
        component: Login,
      },
    ],
  },
];
