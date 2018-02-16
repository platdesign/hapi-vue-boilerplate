'use strict';

const path = require('path');
const Joi = require('joi');
const Boom = require('boom');
const glob = require('glob');


const REGEX_ROUTE_PARAMS = /\/\$([a-zA-Z-]*)?/g;
const dash2camel = string => string.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });

function getRouteDefs(dir, globalPrefix) {
	const pattern = '**/*.js';

	return glob.sync(pattern, {
		cwd: dir,
		dot: false,
	})
	.map(file => {

		let prefix = path.join(globalPrefix, path.dirname(file));

		let routeDef = require(path.resolve(dir, file));

		if(!Array.isArray(routeDef)) {
			routeDef = [routeDef];
		}

		routeDef.forEach(def => {

			def.path = (prefix + def.path).replace(/\/$/, '');

			let res = def.path.match(REGEX_ROUTE_PARAMS);

			if(res) {
				res.forEach(needle => {

					let varName = dash2camel(needle.substr(2));

					def.path = def.path.replace(needle, `/{${varName}}`)
				});
			}

		})

		return routeDef;
	})
	.reduce((acc, item) => {

		if(Array.isArray(item)) {
			acc.push(...item);
		} else {
			acc.push(item);
		}

		return acc;
	}, []);

}




module.exports = {
	async register(server, options) {

		let dirs = options.dirs || {
			'./routes': '/'
		};

		let defs = Object.keys(dirs)
			.map(key => {
				return {
					path: path.resolve(key),
					prefix: dirs[key]
				};
			})
			.map(c => getRouteDefs(c.path, c.prefix))
			.reduce((acc, i) => {
				acc.push(...i);
				return acc;
			}, []);

		defs.forEach(def => server.route(def));

		server.log(['plugin:routes'], `Registered ${defs.length} route(s)`);
	},
	name: 'routes'
};


