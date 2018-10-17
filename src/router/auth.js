import FormLogin from '@/components/auth/FormLogin';
import HelloWorld from '@/components/HelloWorld';

const routes = [
  {
    path: '/login',
    name: 'formLogin',
    component: FormLogin,
  },
  {
    path: '/hello',
    name: 'HelloWorld',
    component: HelloWorld,
  },
];

export default routes;
