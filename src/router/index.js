import Vue from 'vue';
import Router from 'vue-router';
import RouterFunctions from '../common/Router';
// routes
import auth from './auth';
import home from './home';

Vue.use(Router);


let routes = RouterFunctions.routerConcat([], auth);
routes = RouterFunctions.routerConcat(routes, home);

export default new Router({
  routes,
});
