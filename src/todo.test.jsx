import React from 'react';
import { expect } from 'chai';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Todo from './todo.jsx';
import axios from 'axios';

jest.mock('axios');

configure({ adapter: new Adapter() });

describe('<Todo />', () => {
  it('build a todo list', () => {

	let list = [
		{ task: "write my name.", _id: 1, _rev: 1 },
		{ task: "write your name.", _id: 2, _rev: 2 },
		{ task: "write their names.", _id: 3, _rev: 3 }
	];
	const getList = () => {
		return { data: [...list] };
	};

	const getFakePromise = () => { return Promise.resolve(getList()); };

	function Deferred() {
		var self = this;
		this.promise = new Promise((resolveMe, rejectMe) => {
			self.resolve = resolveMe;
			self.reject = rejectMe;
		});
	};

	let doubleMock = new Deferred();
    let tripleMock = new Deferred();
	let mockGetCount = 0;

  	axios.mockImplementation((keys) => {
		if (keys.url === '/api/getAll')
		{
			mockGetCount++;
			if (mockGetCount == 2) doubleMock.resolve();
			if (mockGetCount == 3) tripleMock.resolve();
			return getFakePromise();
		}

		if ((keys.url.length > 11) && (keys.url.substring(0,11) === '/api/delete'))
		{
			let key = parseInt(keys.url.substring(12).split('/')[0]);
			list = [...list.slice(0,key-1),...list.slice(key)];
			return getFakePromise();
		}

		if (keys.url === '/api/insert')
		{
			list = [...list, { task: keys.data.task, _id: 4, _rev: 4 }];
			return getFakePromise();
		}

	});

	const wrapper = mount(<Todo />);
	getFakePromise().then(result => {
		wrapper.update();
		let domElements = wrapper.find('li');
		expect(domElements.at(1).text()).to.equal('write your name.');

		domElements.at(1).simulate('click');
		Promise.all([doubleMock.promise, getFakePromise()]).then(result => {
			wrapper.update();
			let domElements = wrapper.find('li');
			expect(domElements.at(1).text()).to.equal('write their names.');

			wrapper.setState({newItem: "write new names."});
			let button = wrapper.find('button').at(0);
			button.simulate('click');

			Promise.all([tripleMock.promise, getFakePromise()]).then(result => {
			wrapper.update();
			let domElements = wrapper.find('li');
			expect(domElements.at(2).text()).to.equal('write new names.');
		});

		});
	})
	.catch(error => console.log(error.toString()));
  });

//  it('simulates click events', () => {
//	let delVal = null;
//	const deleteTask = (key) => {
//		delVal = list[key];
//	};
//    const wrapper = mount(<SimpleList list={list} delete={deleteTask} />);
//    let domElements = wrapper.find('li');
//	domElements.at(1).simulate('click');
//	  expect(delVal).to.have.property('task', 'write your name.');
//  });

});
