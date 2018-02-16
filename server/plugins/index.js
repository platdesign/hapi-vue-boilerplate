'use strict';



module.exports = {
	async register(server) {

		// Logging
		await server.register(require('./logging'));

		// socketio
		await server.register(require('./socketio'));

		// views
		await server.register(require('./views'));

		// Routes
		await server.register({
			plugin: require('./routes'),
			options: {
				dirs: { './server/routes': '/' }
			}
		});

		// app-assets
		await server.register(require('./app-assets'));

		// Auth
		await server.register(require('./auth'));

	},
	name: 'plugins-wrapper'
}
