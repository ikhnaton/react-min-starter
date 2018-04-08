import React from 'react';
//import sinon from 'sinon';
import { expect } from 'chai';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SimpleList from './simpleList.jsx';

configure({ adapter: new Adapter() });

const list = [
	{ task: "write my name."},
	{ task: "write your name."},
	{ task: "write their names."}
];

describe('<SimpleList />', () => {
  it('allows us to set props', () => {
    const wrapper = mount(<SimpleList list={list} />);
    expect(wrapper.props().list[1].task).to.equal('write your name.');
    wrapper.setProps({ list: [{task: 'go to sleep.'}] });
    expect(wrapper.props().list[0].task).to.equal('go to sleep.');
  });

  it('simulates click events', () => {
	let delVal = null;
	const deleteTask = (key) => {
		delVal = list[key];
	};
    const wrapper = mount(<SimpleList list={list} delete={deleteTask} />);
    let domElements = wrapper.find('li');
	domElements.at(1).simulate('click');
	  expect(delVal).to.have.property('task', 'write your name.');
  });

});
