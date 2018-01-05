import React from 'react';
import ReactDOM from 'react-dom';
import Todo from './todo.jsx';

class App extends React.Component
{
	constructor(props)
	{
		super(props);
	}

	render()
	{
		return (
			<div>
				Hello World<br/>
				<br/>
				<Todo />
			</div>
		);
	}
}

document.addEventListener("DOMContentLoaded", (event) => {
	ReactDOM.render(
		<App/>,
		document.getElementById("root")
	);
});

