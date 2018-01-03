const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: path.join(__dirname, '/www/app.jsx'),
	output: {
		filename: 'bundle.js',
		path: path.join(__dirname, '/www')
	},
	stats: {
		colors: true
	},
	devtool: 'source-map',
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			},
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			}
  		]
	},
	watch: true

};
