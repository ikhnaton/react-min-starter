const React = require('react');
const ReactDOM = require('react-dom');

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
				Hello World
			</div>
		);
	}
}

document.addEventListener("DOMContentLoaded", function(event) {
	ReactDOM.render(
		<App/>,
		document.getElementById("root")
	);
});
