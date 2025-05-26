import { lazy } from 'react';

const UserLayout = lazy(() => import('@/layout/UserLayout'));
const Login = lazy(() => import('@/pages/User/Login'));

export default [
  {
    path: '/user',
    key: 'user',
    component: UserLayout,
    auth: false,
    children: [
      {
        index: true,
        redirect: '/user/login',
      },
      {
        name: '登录',
        path: 'login',
        key: 'login',
        component: Login,
      },
    ],
  },
];
