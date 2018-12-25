import MenusList from '@/components/menus/List';
import MenusForm from '@/components/menus/Form';

const routes = [
  {
    path: '/cardapios',
    name: 'menusList',
    component: MenusList,
  },
  {
    path: '/cardapios/edit/:id',
    name: 'menusFormEdit',
    component: MenusForm,
  },
  {
    path: '/cardapios/edit/:id/dias',
    name: 'menusFormEdit',
    component: MenusForm,
  },
  {
    path: '/cardapios/new',
    name: 'menusFormNew',
    component: MenusForm,
  },
];

export default routes;
