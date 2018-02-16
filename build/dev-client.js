/* eslint-disable */

require('eventsource-polyfill')
//var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true&path=http://localhost:8080/__webpack_hmr')
var hotClient = require('webpack-hot-middleware/client?noInfo=false&reload=true')

hotClient.subscribe(function (event) {
	if (event.action === 'reload') {
		window.location.reload()
	}
});

//__webpack_public_path__ = 'http://localhost:8080/';
