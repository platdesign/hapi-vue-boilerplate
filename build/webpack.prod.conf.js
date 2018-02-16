'use strict';



const fs = require('fs');
const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
//const OfflinePlugin = require('offline-plugin');


const wpMerge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.conf');


module.exports = function webpackProdConfig(config) {

	const isProd = config.env === 'production';




	let staticCopyPluginConfig = config.clientConfig._entries
		.map(entry => Object.assign({
			staticPath: path.join(entry.path, 'static')
		}, entry))
		.filter(entry => fs.existsSync(entry.staticPath))
		.map(entry => {
			return {
				from: entry.staticPath,
				to: 'assets',
				ignore: ['.*']
			}
		});



	let pugViewPlugins = config.clientConfig._entries
		.filter(entry => entry.indexView)
		.map(entry => {
			return new HtmlWebpackPlugin({
				filename: path.relative(config.publicDistPath, entry.indexView.viewPath),
				template: entry.indexView.templatePath,
				inject: true,
				filetype: 'pug',
				chunksSortMode: 'dependency',
				chunks: ['manifest', 'vendor', entry.name],
				cache: false
			});
		});








	return wpMerge(webpackBaseConfig(config), {
		output: {
			filename: 'assets/js/[name].[hash].js',
		},
		devtool: isProd ? false : '#source-map',
		plugins: [


			// Uglify
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false
				},
				sourceMap: true
			}),


			// extract css into its own file
			new ExtractTextPlugin({
				filename: 'assets/css/[name].[contenthash].css'
			}),



			// Compress extracted CSS. We are using this plugin so that possible
			// duplicated CSS from different components can be deduped.
			new OptimizeCSSPlugin({
				cssProcessorOptions: {
					safe: true
				}
			}),



			// generate dist index.html with correct asset hash for caching.
			// you can customize output by editing /index.html
			// see https://github.com/ampedandwired/html-webpack-plugin
			...pugViewPlugins,

			new HtmlWebpackPugPlugin(),




			// split vendor js into its own file
			new webpack.optimize.CommonsChunkPlugin({
				name: 'vendor',
				minChunks: function (module, count) {
					// any required modules inside node_modules are extracted to vendor
					return (
						module.resource &&
						/\.js$/.test(module.resource) &&
						module.resource.indexOf(
							path.join(__dirname, '../node_modules')
						) === 0
					)
				}
			}),


			// extract webpack runtime and module manifest to its own file in order to
			// prevent vendor hash from being updated whenever app bundle is updated
			new webpack.optimize.CommonsChunkPlugin({
				name: 'manifest',
				chunks: ['vendor']
			}),


			// copy custom static assets
			new CopyWebpackPlugin(staticCopyPluginConfig),


			// new OfflinePlugin({
			// 	caches: {
			// 		main: [
			// 			'**/*.css',
			// 			'**/*.js',
			// 			'**/*.png',
			// 			'**/*.jpg'
			// 		],
			// 		additional: [
			// 			':externals:'
			// 		],
			// 		optional: [
			// 			':rest:'
			// 		]
			// 	},
			// 	externals: [
			// 		'/',
			// 		'/manifest.json'
			// 	],
			// 	ServiceWorker: {
			// 		events: true,
			// 		output: './sw.js',
			// 		navigateFallbackURL: '/'
			// 	},
			// 	AppCache: {
			// 		directory: './',
			// 		disableInstall: false
			// 	}
			// })
		]
	});

}
