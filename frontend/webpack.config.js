const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
	entry: './src/index.js',
	mode: 'development',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.ejs',
		}),
	],
	module: {
		rules: [
			{
				test: /\.ejs$/,
				loader: 'ejs-loader',
				options: {
					esModule: false,
				},
			},
		],
	},
};
