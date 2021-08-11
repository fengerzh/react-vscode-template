import './matchMedia.mock';
import { mount, configure, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { act } from 'react-dom/test-utils';
import ProForm, { ProFormProps, ProFormCaptcha, ProFormCaptchaProps } from '@ant-design/pro-form';
import Login from './Login';

configure({ adapter: new Adapter() });

describe('<Login /> 组件测试', () => {
  it('应该有标题栏', () => {
    const pageMounted = mount(<Login history={{ push: () => {} }} />);

    // 检查标题栏是否有标题
    expect(pageMounted.find('h1').text()).toEqual('React Vscode Template');
  });
  it('发送验证码', async () => {
    const wrapper = mount(<Login history={{ push: () => {} }} />);
    const { onGetCaptcha } = wrapper.find(ProFormCaptcha).props() as ProFormCaptchaProps;
    await act(async () => {
      await onGetCaptcha('13912345678');
    });
  });
  it('登录成功', async () => {
    const wrapper = shallow(<Login history={{ push: () => {} }} />);
    // const wrapper = mount(<Login history={{ push: () => {} }} />);
    const { onFinish } = wrapper.find(ProForm).props() as ProFormProps;
    await onFinish({ phone: '13912345678', captcha: 'admin' });
  });
  it('登录失败', async () => {
    const wrapper = mount(<Login history={{ push: () => {} }} />);
    const { onFinish } = wrapper.find(ProForm).props() as ProFormProps;
    await onFinish({ phone: '13912345678', captcha: 'wrong' });
  });
});
