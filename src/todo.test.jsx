import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Todo from './todo.jsx';
import axios from 'axios';

jest.mock('axios');

configure({ adapter: new Adapter() });

function Deferred() {
	var self = this;
	this.promise = new Promise((resolveMe, rejectMe) => {
		self.resolve = resolveMe;
		self.reject = rejectMe;
	});
};

describe('<Todo />', () => {
  it('retrieve a todo list from REST end point and display', () => {

	expect.assertions(1);
	return new Promise((testResolve, testReject) => {
		let list = [
			{ task: "write my name.", _id: 1, _rev: 1 },
			{ task: "write your name.", _id: 2, _rev: 2 },
			{ task: "write their names.", _id: 3, _rev: 3 }
		];

		const getList = () => {
			return { data: [...list] };
		};

		const getFakePromise = () => { return Promise.resolve(getList()); };

		axios.mockImplementation((keys) => {
			if (keys.url === '/api/getAll')
			{
				return getFakePromise();
			}
		});

		const wrapper = mount(<Todo />);
		getFakePromise().then(result => {
			wrapper.update();
			let domElements = wrapper.find('li');
			expect(domElements.at(1).text()).toBe('write your name.');
			testResolve();
		})
		.catch(error => {
			testReject(error.toString());
		});
	});
  });

  it('update todo list by deleting an item', () => {
	expect.assertions(1);
	return new Promise((testResolve, testReject) => {
		let list = [
			{ task: "write my name.", _id: 1, _rev: 1 },
			{ task: "write your name.", _id: 2, _rev: 2 },
			{ task: "write their names.", _id: 3, _rev: 3 }
		];

		const getList = () => {
			return { data: [...list] };
		};

		const getFakePromise = () => { return Promise.resolve(getList()); };

		let doubleMock = new Deferred();
		let mockGetCount = 0;

		axios.mockImplementation((keys) => {
			if (keys.url === '/api/getAll')
			{
				mockGetCount++;
				if (mockGetCount == 2) doubleMock.resolve();
				return getFakePromise();
			}

			if ((keys.url.length > 11) && (keys.url.substring(0,11) === '/api/delete'))
			{
				let key = parseInt(keys.url.substring(12).split('/')[0]);
				list = [...list.slice(0,key-1),...list.slice(key)];
				return getFakePromise();
			}
		});

		const wrapper = mount(<Todo />);
		getFakePromise().then(result => {
			wrapper.update();
			let domElements = wrapper.find('li');
			domElements.at(1).simulate('click');
			Promise.all([doubleMock.promise, getFakePromise()]).then(result => {
				wrapper.update();
				let domElements = wrapper.find('li');
				expect(domElements.at(1).text()).toBe('write their names.');
				testResolve();
			});
		})
		.catch(error => {
			testReject(error.toString());
		});
	});
  });

  it('update todo list by adding an item', () => {

	expect.assertions(1);
	return new Promise((testResolve, testReject) => {
		let list = [
			{ task: "write my name.", _id: 1, _rev: 1 },
			{ task: "write your name.", _id: 2, _rev: 2 },
			{ task: "write their names.", _id: 3, _rev: 3 }
		];
		const getList = () => {
			return { data: [...list] };
		};

		const getFakePromise = () => { return Promise.resolve(getList()); };

		let doubleMock = new Deferred();
		let mockGetCount = 0;

		axios.mockImplementation((keys) => {
			if (keys.url === '/api/getAll')
			{
				mockGetCount++;
				if (mockGetCount == 2) doubleMock.resolve();
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
			wrapper.setState({newItem: "write new names."});
			let button = wrapper.find('button').at(0);
			button.simulate('click');

			Promise.all([doubleMock.promise, getFakePromise()]).then(result => {
				wrapper.update();
				let domElements = wrapper.find('li');
				expect(domElements.at(3).text()).toBe('write new names.');
				testResolve();
			});
		})
		.catch(error => {
			testReject(error.toString());
		});
	});
  });

  it('change input value', () => {
	expect.assertions(1);
	return new Promise((testResolve, testReject) => {
		let list = [
			{ task: "write my name.", _id: 1, _rev: 1 },
			{ task: "write your name.", _id: 2, _rev: 2 },
			{ task: "write their names.", _id: 3, _rev: 3 }
		];

		const getList = () => {
			return { data: [...list] };
		};

		const getFakePromise = () => { return Promise.resolve(getList()); };

		axios.mockImplementation((keys) => {
			if (keys.url === '/api/getAll')
			{
				return getFakePromise();
			}
		});

		const wrapper = mount(<Todo />);
		getFakePromise().then(result => {
			wrapper.update();
			wrapper.setState({newItem: "write new names."});
			let button = wrapper.find('input').at(0);
			button.simulate('change', { target: { value: "test"}});

			getFakePromise().then(result => {
				wrapper.update();
				expect(wrapper.state('newItem')).toBe('test');
				testResolve();
			});
		})
		.catch(error => {
			testReject(error.toString());
		});
	});
  });

  it('error when reading data', () => {
//	expect.assertions(3);
	return new Promise((testResolve, testReject) => {

		let fakePromise = Promise.reject("data load failed");

		axios.mockImplementation((keys) => {
			if (keys.url === '/api/getAll')
			{
				return fakePromise;
			}
		});

		const wrapper = mount(<Todo />);
		fakePromise.then(result => {
			wrapper.update();
			testReject("Should never reach here");
		})
		.catch(error => {
			expect(error.toString()).toBe("data load failed");
			wrapper.update();
			expect(wrapper.state('error')).toBe("data load failed");
			let message = wrapper.find('h2');
			expect(message.text()).toBe("data load failed");
			testResolve("success");
		});

	});
  });

  it('error when deleting data', () => {
	expect.assertions(2);
	return new Promise((testResolve, testReject) => {

		let list = [
			{ task: "write my name.", _id: 1, _rev: 1 },
			{ task: "write your name.", _id: 2, _rev: 2 },
			{ task: "write their names.", _id: 3, _rev: 3 }
		];

		const getList = () => {
			return { data: [...list] };
		};

		let fakeDeletePromise = Promise.reject("data load failed");
		const getFakePromise = () => { return Promise.resolve(getList()); };

		let doubleMock = new Deferred();
		let mockGetCount = 0;

		axios.mockImplementation((keys) => {
			if (keys.url === '/api/getAll')
			{
				mockGetCount++;
				if (mockGetCount == 2) doubleMock.resolve();
				return getFakePromise();
			}

			if ((keys.url.length > 11) && (keys.url.substring(0,11) === '/api/delete'))
			{
				return fakeDeletePromise;
			}
		});

		const wrapper = mount(<Todo />);
		getFakePromise().then(result => {
			wrapper.update();
			let domElements = wrapper.find('li');
			domElements.at(1).simulate('click');
			Promise.all([doubleMock.promise, getFakePromise(), fakeDeletePromise]).then(result => {
				wrapper.update();
				testReject("Should never reach here");
			})
			.catch(error => {
				expect(error.toString()).toBe("data load failed");
				wrapper.update();
				expect(wrapper.state('error')).toBe("data load failed");
				testResolve("success");
			});
		})


	});
  });

  it('error when adding data', () => {
	expect.assertions(2);
	return new Promise((testResolve, testReject) => {

		let list = [
			{ task: "write my name.", _id: 1, _rev: 1 },
			{ task: "write your name.", _id: 2, _rev: 2 },
			{ task: "write their names.", _id: 3, _rev: 3 }
		];

		const getList = () => {
			return { data: [...list] };
		};

		let fakeAddPromise = Promise.reject("data load failed");
		const getFakePromise = () => { return Promise.resolve(getList()); };

		let doubleMock = new Deferred();
		let mockGetCount = 0;

		axios.mockImplementation((keys) => {
			if (keys.url === '/api/getAll')
			{
				mockGetCount++;
				if (mockGetCount == 2) doubleMock.resolve();
				return getFakePromise();
			}

			if (keys.url === '/api/insert')
			{
				return fakeAddPromise;
			}
		});

		const wrapper = mount(<Todo />);
		getFakePromise().then(result => {
			wrapper.update();
			wrapper.setState({newItem: "write new names."});
			let button = wrapper.find('button').at(0);
			button.simulate('click');

			Promise.all([doubleMock.promise, getFakePromise(), fakeAddPromise]).then(result => {
				wrapper.update();
				testReject("Should never reach here");
			})
			.catch(error => {
				expect(error.toString()).toBe("data load failed");
				wrapper.update();
				expect(wrapper.state('error')).toBe("data load failed");
				testResolve("success");
			});
		});


	});
  });
});
