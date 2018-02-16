'use strict';


import io from 'socket.io-client';

const socket = io(window.location.host, {

	path: '/ws',

	reconnection: true,

	reconnectionAttempts: Infinity,

	// (Number) how long to initially wait before attempting a new
	reconnectionDelay: 1000,

	reconnectionDelayMax: 5000,

	timeout: 1000,

	query: {},

	/**
	 * Uncomment following to disable polling fallback
	 */
	// transports: ['websocket']

});


export default socket;


if(process.env.NODE_ENV !== 'production') {
	socket.on('connect', e => console.log('Socket connection established'));
}
