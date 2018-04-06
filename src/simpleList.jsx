import React from 'react';

const SimpleList = (props = {}) => {
	return (
		<ul>
		{props.list.map((item, index) => (<li key={index} onClick={() => props.delete(index)}>{item.task}</li>))}
		</ul>
	);
};

export default SimpleList;
