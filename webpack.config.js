var path = require('path'),
webpack = require('webpack');

function fromRootDir(matchPath) {
	return new RegExp(process.cwd() + matchPath);
}

module.exports = {
	// cache: true,
	// debug: true,
	// devtool: 'eval',
	entry: './app/src/js/main.js',
	output: {
		path: path.join(__dirname, "app/build/js"),
		filename: 'bundle.js'
	},
	module: {
		// Special compilation rules
		loaders: [
		{
        	test: /\.vue$/,
        	loader: 'vue',
      	},
		{
		// Ask webpack to check: If this file ends with .js, then apply some transforms
			test: /\.js$/,
		// Transform it with babel
			loader: 'babel',
		// don't transform node_modules folder (which don't need to be compiled)
			exclude: /node_modules/
		}
		],
		plugins: [
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: '"production"'
				}
			})
		]
	},
	vue: {
		loaders: {
			js: 'babel',
		},
	},
};