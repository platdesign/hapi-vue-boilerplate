'use strict';


const path = require('path');


module.exports = {
	method: 'GET',
	path: '/',
	handler(req, h) {

		let view = process.env.NODE_ENV === 'production' ?
			path.resolve('.dist', 'views', 'app.pug') :
			path.join(req.server.settings.app.client.clientPath, 'index.pug');

		return req.render(view, {});
	}
}
