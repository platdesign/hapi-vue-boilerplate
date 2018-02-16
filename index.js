'use strict';


const config = require('config');
const boot = require('./server');


(async () => {

	let server = await boot(config);

	await server.start();

	server.log(['listening'], server.info);

})().catch(e => {
	console.log(e);
	process.exit(1);
});
