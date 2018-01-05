import React from 'react';
import SimpleList from './SimpleList.jsx';

class Todo extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			list: [],
			newItem: ""
		};
		this.addItem = this.addItem.bind(this);
	}

	handleChange(event)
	{
		this.setState({newItem: event.target.value});
	}

	addItem()
	{
		let newList = this.state.list.slice();
		newList.push(this.state.newItem);
		this.setState({
			list: newList,
			newItem: ""
		});
	}

	render()
	{
		return (
			<div>
				<input type="text" value={this.state.newItem} onChange={this.handleChange.bind(this)} />
				<button onClick={this.addItem}>Add Item</button>
				<br/>
				<SimpleList list={this.state.list} />
			</div>
		);
	}
}

export default Todo;

