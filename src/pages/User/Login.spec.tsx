import { mount } from 'enzyme';
import { expect } from 'chai';
import Login from './Login';

describe('<Login /> component test', () => {
  it('should have an input field for bookTitle', () => {
    const component = mount(<Login history={{ push: () => {} }} />);
    expect(component.find('h4').text()).to.equal('Hello');
  });
});
