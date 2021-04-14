import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

mock.onPost('/users').reply(200, {
  data: [
    { id: 1, name: '张三', age: 18 },
    { id: 2, name: '李四', age: 20 },
  ],
  success: true,
  total: 2,
});

export const getUsers = (params) => axios.post('/users', params);

export const getCompany = () => axios.get('/company');
