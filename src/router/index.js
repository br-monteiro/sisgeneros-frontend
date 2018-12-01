import Vue from 'vue';
import Router from 'vue-router';
import RouterFunctions from '../common/Router';
// routes
import auth from './auth';
import home from './home';
import meals from './meals';
import suppliers from './suppliers';
import recipes from './recipes';
import users from './users';

Vue.use(Router);


let routes = RouterFunctions.routerConcat([], auth);
routes = RouterFunctions.routerConcat(routes, home);
routes = RouterFunctions.routerConcat(routes, meals);
routes = RouterFunctions.routerConcat(routes, suppliers);
routes = RouterFunctions.routerConcat(routes, recipes);
routes = RouterFunctions.routerConcat(routes, users);

export default new Router({
  routes,
});
