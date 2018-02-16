'use strict';


const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack');
const fs = require('fs');


module.exports = function(config) {

	function resolve (dir) {
		return path.join(config.clientPath, dir || '')
	}

	const entries = Object.keys(config.clientConfig.entries).map(name => {

		let relPath = config.clientConfig.entries[name];
		let absPath = path.join(config.clientPath, relPath);

		return {
			name,
			relPath,
			absPath
		}
	})
	.reduce((entries, entry) => {
		entries[entry.name] = entry.absPath;
		return entries;
	}, {})

	return {
		entry: entries,
		output: {
			path: config.publicDistPath,
			chunkFilename: 'assets/js/[id].[chunkhash].js',
			publicPath: '/'
		},
		resolve: {
			extensions: ['.js', '.vue', '.json', '.css', '.scss', '.pug'],
			alias: {
				'vue$': 'vue/dist/vue.esm.js',
				'@': config.clientPath,
				'vue-awesome': path.resolve('node_modules', 'vue-awesome'),
				'rx': path.resolve('node_modules', 'rx')
			},
			symlinks: false
		},
		module: {
			rules: [
				...generateStyleLoaders({
					sourceMap: false,
					extract: config.env === 'production'
				}),
				{
					test: /\.vue$/,
					loader: 'vue-loader',
					options: {
						esModule: false,

						loaders: Object.assign({}, generateCssLoaders({
								sourceMap: false,
								extract: config.env === 'production'
							})),
						transformToRequire: {
							video: 'src',
							source: 'src',
							img: 'src',
							image: 'xlink:href'
						},

						template: {
						  basedir: config.clientPath
						}
					}
				},
				{
					test: /\.js$/,
					loader: 'babel-loader',
					exclude: /node_modules\/(?!(zue|cana)\/).*/,
					include: [
						config.clientPath,
						path.resolve('node_modules', 'zue'),
						path.resolve('node_modules', 'cana'),
					]
				},
				{
					test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
					loader: 'url-loader',
					options: {
						limit: 10000,
						name: 'assets/img/[name].[hash:7].[ext]'
					}
				},
				{
					test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
					loader: 'url-loader',
					options: {
						limit: 10000,
						name: 'assets/media/[name].[hash:7].[ext]'
					}
				},
				{
					test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
					loader: 'url-loader',
					options: {
						limit: 10000,
						name: 'assets/fonts/[name].[hash:7].[ext]'
					}
				}
			]
		},

		plugins: [

			// http://vuejs.github.io/vue-loader/en/workflow/production.html
			new webpack.DefinePlugin({
				'process.env': Object.assign(config.clientConfig.env, {
					NODE_ENV: `'${config.env}'`
				})
			}),

		]
	}
}




function generateStyleLoaders(options) {
	var output = []
	var loaders = generateCssLoaders(options)
	for (var extension in loaders) {
		var loader = loaders[extension]
		output.push({
			test: new RegExp('\\.' + extension + '$'),
			use: loader
		})
	}
	return output
}


function generateCssLoaders(options) {
	options = options || {}

	var cssLoader = {
		loader: 'css-loader',
		options: {
			minimize: process.env.NODE_ENV === 'production',
			sourceMap: options.sourceMap
		}
	}

	// generate loader string to be used with extract text plugin
	function generateLoaders (loader, loaderOptions) {
		var loaders = [cssLoader]
		if (loader) {
			loaders.push({
				loader: loader + '-loader',
				options: Object.assign({}, loaderOptions, {
					sourceMap: options.sourceMap
				})
			})
		}

		// Extract CSS when that option is specified
		// (which is the case during production build)
		if (options.extract) {
			return ExtractTextPlugin.extract({
				use: loaders,
				fallback: 'vue-style-loader'
			})
		} else {
			return ['vue-style-loader'].concat(loaders)
		}
	}

	// https://vue-loader.vuejs.org/en/configurations/extract-css.html
	return {
		css: generateLoaders(),
		postcss: generateLoaders(),
		less: generateLoaders('less'),
		sass: generateLoaders('sass', { indentedSyntax: true }),
		scss: generateLoaders('sass'),
		stylus: generateLoaders('stylus'),
		styl: generateLoaders('stylus')
	}
}
