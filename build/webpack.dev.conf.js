'use strict';

const path = require('path');
const webpack = require('webpack');
const config = require('./config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
// const OfflinePlugin = require('offline-plugin');

const wpMerge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.conf');


module.exports = function webpackDevConfig(config) {

	const entries = Object.keys(config.clientConfig.entries).map(name => {

		let relPath = './' + path.join(config.relClientPath, config.clientConfig.entries[name]);
		let absPath = path.join(config.clientPath, relPath);

		return {
			name,
			relPath,
			absPath
		}
	})
	.reduce((entries, entry) => {
		entries[entry.name] = ['./build/dev-client.js'].concat(entry.relPath);
		return entries;
	}, {});


	return wpMerge(webpackBaseConfig(config), {
		entry: entries,

		output: {
			filename: 'assets/js/[name].js',
		},

		devtool: '#cheap-module-eval-source-map',
		plugins: [

			// https://github.com/glenjamin/webpack-hot-middleware#installation--usage
			new webpack.HotModuleReplacementPlugin(),

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
			// 	excludes: [
			// 		'*.hot-update.js'
			// 	],
			// 	ServiceWorker: {
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

