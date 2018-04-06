const devConfig = {
	devtool: 'source-map',
	watch: true,
	stats: {
		colors: true
	}
}

const prodConfig = require('./webpack.prod.config');

const clientConfig = Object.assign({}, prodConfig[0], devConfig, {
	plugins: [
		prodConfig.pluginConfigs.ExtractTextPlugin,
		prodConfig.pluginConfigs.CopyWebpackPlugin
	]
});
const serverConfig = Object.assign({}, prodConfig[1], devConfig, {
	plugins: [
		prodConfig.pluginConfigs.ExtractTextPlugin
	]
});

module.exports = [ clientConfig, serverConfig ]
