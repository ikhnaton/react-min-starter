import React from 'react';
import ReactDOM from 'react-dom';
import Todo from './todo.jsx';
import './app.less';

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
				Super simple todo list with Cloudant DB<br/>
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

