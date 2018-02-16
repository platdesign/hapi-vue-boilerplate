'use strict';

import Vue from 'vue'

import App from '@/components/app'
import router from '@/services/router'
import store from '@/services/store'
import api from '@/services/api'
import socket from '@/services/socket'


/**
 * Disable production tip.
 * Webpack will handle it automatically due to process.env.NODE_ENV
 */
Vue.config.productionTip = false;


/* eslint-disable no-new */
const app = new Vue({
	router,
	store,
  components: { App },
  template: '<App/>'
});

app.$mount('#app');


export default app;
