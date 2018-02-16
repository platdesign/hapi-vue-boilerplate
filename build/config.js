'use strict';



const fs = require('fs');
const path = require('path');
const Joi = require('joi');



const config = module.exports = {
	env: process.env.NODE_ENV
};

config.relClientPath = './client';
config.clientPath = path.resolve(config.relClientPath);
config.clientConfigFilePath = path.join(config.clientPath, 'client.json');




config.clientConfig = {
	entries: {
		app: './'
	},
	outputPath: '.dist',
	env: {},
	devServerPort: 55879
};

config.distPath = path.resolve(config.clientConfig.outputPath);
config.publicDistPath = path.join(config.distPath, 'public');

config.clientConfig._entries = Object.keys(config.clientConfig.entries).map(key => {
	let relPath = path.dirname(config.clientConfig.entries[key]);

	let entry = {
		name: key,
		path: path.join(config.clientPath, relPath)
	};


	let pugTemplateFile = path.join(entry.path, 'index.pug')

	if(fs.existsSync(pugTemplateFile)) {
		entry.indexView = {
			templatePath: pugTemplateFile,
			viewPath: path.join(config.distPath, 'views', `${entry.name}.pug`)
		};
	}

	return entry;
});



