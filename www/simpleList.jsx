import React from 'react';

const SimpleList = (props = {}) => {
	return (
		<ul>
		{props.list.map((item, index) => (<li key={index}>{item}</li>))}
		</ul>
	);
};

export default SimpleList;
