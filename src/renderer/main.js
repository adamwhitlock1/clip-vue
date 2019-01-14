import Vue from 'vue';
import axios from 'axios';
import VueClipboard from 'vue-clipboard2';
import Toasted from 'vue-toasted';

import Datastore from 'nedb';
import path from 'path';

import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon';

import App from './App';
import router from './router';
import store from './store';

import './assets/tailwind.css';

const dbSaved = new Datastore({
  autoload: true,
  timestampData: true,
  filename: path.join(__static, '/databaseSaved.db'),
});

const dbStream = new Datastore({
  autoload: true,
  timestampData: true,
  filename: path.join(__static, '/databaseStream.db'),
});

console.log('Loaded main.js');

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.use(VueClipboard);
Vue.use(Toasted);
Vue.component('v-icon', Icon);

Vue.prototype.$dbSaved = dbSaved;
Vue.prototype.$dbStream = dbStream;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
