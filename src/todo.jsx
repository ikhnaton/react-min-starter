import React from 'react';
import SimpleList from './simpleList.jsx';
import axios from 'axios';

class Todo extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			list: [],
			newItem: "",
			error:  null
		};
		this.addItem = this.addItem.bind(this);
		this.getItems();
	}

	getItems()
	{
		axios({
			url: '/api/getAll',
			method: 'GET'
		})
		.then(result => {
			this.setState({
				list: result.data,
				error: null
			});
		})
		.catch(err => {
			this.setState({
				error: err
			});
		})
	}

	handleChange(event)
	{
		this.setState({newItem: event.target.value});
	}

	addItem()
	{
//		let newList = this.state.list.slice();
//		newList.push(this.state.newItem);
//		this.setState({
//			list: newList,
//			newItem: ""
//		});
		axios({
			url: '/api/insert',
			method: 'POST',
			data: { task: this.state.newItem, complete: false }
		})
		.then(result => {
			this.setState({
				newItem: ""
			});
			this.getItems();
		})
		.catch(err => {
			this.setState({
				error: err
			});
		});

	}

	removeItem(index)
	{
		axios({
			url: `/api/delete/${this.state.list[index]._id}/${this.state.list[index]._rev}`,
			method: 'GET'
		})
		.then(result => {
			this.getItems();
		})
		.catch(err => {
			this.setState({
				error: err
			});
		})
//		let newList = [...this.state.list.slice(0,index), ...this.state.list.slice(index+1)];
//		this.setState({ list: newList });
	}

	render()
	{
		return (
			<div>
				<input type="text" value={this.state.newItem} onChange={this.handleChange.bind(this)} />
				<button onClick={this.addItem}>Add Item</button>
				<br/>
				<SimpleList list={this.state.list} delete={this.removeItem.bind(this)} />
				{
					(this.state.error != null) ?<h2>{this.state.error}</h2>:""
				}
			</div>
		);
	}
}

export default Todo;

