'use strict';

const config = require('../../build/config');

const path = require('path');
const Hoek = require('hoek');
const Joi = require('joi');


module.exports = {
	name: 'app-assets',
	register: async function(server, options) {


		server.settings.app.client = config;


		if(process.env.NODE_ENV === 'production') {

			const Inert = require('inert');

			await server.register(Inert);

			server.route({
				method: 'GET',
				path: '/{param*}',
				handler: {
					directory: {
						path: config.publicDistPath,
						redirectToSlash: false,
						index: true,
						listing: false
					}
				}
			});


		} else {
			const H2o2 = require('h2o2');
			const SSE = require('sse');
			const EventSource = require('eventsource');

			await server.register(H2o2);

			const hmrPath = '/__webpack_hmr';
			const sse = new SSE(server.listener, {path: hmrPath});

			sse.on('connection', function(client) {
				const es = new EventSource(`http://localhost:${config.clientConfig.devServerPort}${hmrPath}`);
				es.onmessage = function(e) {
					client.send(e.data);
				};
				es.onerror = function(e) {
					server.log(['sse-error'], e)
				};
			});

			server.route({
				method: '*',
				path: `/{foo*}`,
				handler: {
					proxy: {
						passThrough: true,
						host: 'localhost',
						port: config.clientConfig.devServerPort,
						xforward: true,
					}
				}
			});
		}

	}

}








