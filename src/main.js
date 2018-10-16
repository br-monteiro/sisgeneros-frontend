import Vue from 'vue';
import 'jquery';
import 'bootstrap/dist/js/bootstrap.min';
import 'gentelella/vendors/fastclick/lib/fastclick';
import 'gentelella/vendors/nprogress/nprogress';
import './build-gentelella/js/custom';
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import App from './App';
import router from './router';

Vue.config.productionTip = false;

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
