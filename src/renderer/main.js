import Vue from 'vue';
import axios from 'axios';
import VueClipboard from 'vue-clipboard2';
import Toasted from 'vue-toasted';
import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon';

import App from './App';
import router from './router';
import store from './store';

import './assets/bootstrap.min.css';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.use(VueClipboard);
Vue.use(Toasted);
Vue.component('v-icon', Icon);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
