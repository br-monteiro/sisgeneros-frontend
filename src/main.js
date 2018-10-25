import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import SlimDialog from 'v-slim-dialog';
import VueMask from 'v-mask';
import 'jquery';
import 'bootstrap/dist/js/bootstrap.min';
// import 'gentelella/vendors/fastclick/lib/fastclick';
// import 'gentelella/vendors/nprogress/nprogress';
import 'v-slim-dialog/dist/v-slim-dialog.css';
import './build-gentelella/js/custom';
import App from './App';
import router from './router';

Vue.config.productionTip = false;
Vue.use(VueMask);
Vue.use(SlimDialog);
Vue.use(VueAxios, axios);

require('bootstrap/dist/css/bootstrap.min.css');
require('gentelella/vendors/font-awesome/css/font-awesome.min.css');
require('gentelella/vendors/nprogress/nprogress.css');
require('./build-gentelella/css/custom.css');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
