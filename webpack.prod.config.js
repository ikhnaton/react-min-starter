const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const pluginConfigs = {
	ExtractTextPlugin: new ExtractTextPlugin("main.css"),
	CopyWebpackPlugin: new CopyWebpackPlugin([
			{ from: 'src/index.html', to: 'index.html' }
		], {})
};

const baseConfig = {
	output: {
		filename: '[name].js',
		path: path.join(__dirname, '/dist')
	},
	stats: "errors-only",
	module: {
		loaders: [
			{
				test: [/\.js$/, /\.jsx$/],
				exclude: /node_modules/,
				loader: "babel-loader"
			},
			{
				test: [/\.css$/,/\.less$/],
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: ["css-loader","less-loader"]
				})
			}
		]
	}
};

const clientConfig = Object.assign({}, baseConfig, {
	entry: {
		bundle: path.join(__dirname, '/src/app.jsx')
	},
	target: 'web',
	plugins: [
		pluginConfigs.ExtractTextPlugin,
		pluginConfigs.CopyWebpackPlugin
	]
})

const serverConfig = Object.assign({}, baseConfig, {
	entry: {
		backend: path.join(__dirname, '/server/server.js')
	},
	target: 'node',
	plugins: [
		pluginConfigs.ExtractTextPlugin
	],
	externals: ['./vcap.local']
})

module.exports = [ clientConfig, serverConfig ]
module.exports.pluginConfigs = pluginConfigs;
