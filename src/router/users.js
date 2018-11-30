import UsersList from '@/components/users/List';
import UsersForm from '@/components/users/Form';

const routes = [
  {
    path: '/usuarios',
    name: 'usersList',
    component: UsersList,
  },
  {
    path: '/usuarios/edit/:id',
    name: 'usersFormEdit',
    component: UsersForm,
  },
  {
    path: '/usuarios/new',
    name: 'usersFormNew',
    component: UsersForm,
  },
];

export default routes;
