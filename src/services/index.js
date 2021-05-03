import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { message } from 'antd';

const mock = new MockAdapter(axios);

mock
  .onPost('/login')
  .reply((config) => {
    const { phone, captcha } = JSON.parse(config.data);
    if (phone === '13912345678' && captcha === 'admin') {
      return [
        200,
        {
          data: { userName: '张三' },
          success: true,
        },
      ];
    }
    return [401, { message: 'wrong' }];
  });

mock.onPost('/users').reply(() => [
  200,
  {
    data: [
      { id: 1, name: '张三', age: 18 },
      { id: 2, name: '李四', age: 20 },
    ],
    success: true,
    total: 2,
  },
]);

const instance = axios.create({
  withCredentials: true,
});

instance.interceptors.response.use((response) => response, (error) => {
  if (error.response.status === 401) {
    message.error('用户名或密码错误，登录失败');
  }
  return null;
});

export const login = (params) => instance.post('/login', params);

export const getUsers = (params) => instance.post('/users', params);

export const getCompany = () => instance.get('/company');
