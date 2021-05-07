import './matchMedia.mock';
import { mount, configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { expect } from 'chai';
import Login from './Login';

configure({ adapter: new Adapter() });

describe('<Login /> 组件测试', () => {
  it('应该有标题栏', () => {
    const pageMounted = mount(<Login history={{ push: () => {} }} />);

    // 检查标题栏是否有标题
    expect(pageMounted.find('h1').text()).to.equal('React Vscode Template');
  });
});
