'use strict';


const SocketIo = require('socket.io');


module.exports = {
	name: 'socketio',
	async register(server) {

		let io = SocketIo(server.listener, {
			path: '/ws',
			serveClient: false,
			cookie: false,
			pingTimeout: 1000,
			pingInterval: 5000,

			/**
			 * Uncomment following to disable polling fallback
			 */
			//transports: ['websocket']
		});

	}
}
