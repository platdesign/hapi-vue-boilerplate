'use strict';

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({

	/**
	 * Turn off strict mode in production
	 * https://vuex.vuejs.org/en/strict.html
	 */
	strict: process.env.NODE_ENV !== 'production'

});
