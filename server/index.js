'use strict';


const { Server } = require('hapi');


module.exports = async function(config) {

	const server = new Server({
		host: config.get('host'),
		port: config.get('port'),
		app: {
			config
		}
	});

	await server.register(require('./plugins'));

	return server;
};
