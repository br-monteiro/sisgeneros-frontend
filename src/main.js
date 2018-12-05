import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import SlimDialog from 'v-slim-dialog';
import VueMask from 'v-mask';
import VMoney from 'v-money';
import 'jquery';
import 'bootstrap/dist/js/bootstrap.min';
// import 'gentelella/vendors/fastclick/lib/fastclick';
// import 'gentelella/vendors/nprogress/nprogress';
import 'v-slim-dialog/dist/v-slim-dialog.css';
import './build-gentelella/js/custom';
import App from './App';
import router from './router';
import Dictionary from './common/Dictionary';

Vue.config.productionTip = false;
Vue.use(VueMask);
Vue.use(VMoney, {
  decimal: ',',
  thousands: '.',
  prefix: 'R$ ',
  suffix: '',
  precision: 2,
  masked: false,
});
Vue.use(SlimDialog);
Vue.use(VueAxios, axios);

/**
 * Adding filter translate
 */
Vue.filter('translate', (value) => {
  const selectedWord = Dictionary.filter(i => i.from === value)[0];
  if (selectedWord) {
    return selectedWord.to;
  }
  return value;
});

/**
 * Adding filter translate
 */
Vue.filter('truncate', (value, limit = 15) => {
  let v = value;
  if (v && v.length > limit) {
    v = v.substring(0, limit);
    v += '...';
  }
  return v;
});

/**
 * Adding filter date
 */
Vue.filter('date', (value, separator = '-') => {
  let v = value;
  if (v) {
    v = v.split('-').reverse().join(separator);
  }
  return v;
});

/**
 * Adding filter money
 */
Vue.filter('money', (value, symbol = 'R$') => {
  let v = value;
  const parsedValue = parseFloat(value);

  if (v && parsedValue) {
    v = parsedValue.toLocaleString('pt-BR');
    v += !/,\d{2,}/.test(v) ? '0' : '';
    v = `${symbol} ${v}`;
  }
  return v;
});

require('bootstrap/dist/css/bootstrap.min.css');
require('gentelella/vendors/font-awesome/css/font-awesome.min.css');
// require('gentelella/vendors/nprogress/nprogress.css');
require('./build-gentelella/css/custom.css');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
