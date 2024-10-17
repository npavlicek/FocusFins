const path = require("node:path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: path.join(__dirname, "client", "index.tsx"),
	devtool: "inline-source-map",
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "public", "index.html")
		})
	],
	module: {
		rules: [
			{
				test: /\.?(tsx|js|jsx|ts)$/,
				exclude: /node_modules/,
				use: ["babel-loader", "ts-loader"],
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			}
		]
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js", ".jsx"]
	},
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "build")
	},
	devServer: {
		port: 3000,
		compress: true,
		proxy: [
			{
				context: ['^/api'],
				target: 'http://localhost:3000',
				secure: false
			}
		]
	},
	mode: "development"
};
