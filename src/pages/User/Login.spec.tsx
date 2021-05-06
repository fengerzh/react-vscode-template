import { mount, configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { expect } from 'chai';
import Login from './Login';

configure({ adapter: new Adapter() });

describe('<Login /> component test', () => {
  it('should have an input field for bookTitle', () => {
    const component = mount(<Login history={{ push: () => {} }} />);
    expect(component.find('h4').text()).to.equal('Hello');
  });
});
