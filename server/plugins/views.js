'use strict';


const Vision = require('vision');
const Pug = require('pug');
const path = require('path');


module.exports = {
	name: 'views',

	async register(server) {

		await server.register(Vision);


		server._core.root.views({
      engines: { pug: Pug },
      relativeTo: path.resolve('server', 'views'),
			path: path.resolve('server', 'views'),
			isCached: false,
			allowAbsolutePaths: true,
			context: {
				env: process.env.NODE_ENV
			}
    });

	}
};
