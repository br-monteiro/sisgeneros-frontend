import UsersList from '@/components/users/List';
import UsersListOms from '@/components/users/ListOms';
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
    path: '/usuarios/edit/:id/oms',
    name: 'usersFormEditOms',
    component: UsersListOms,
  },
  {
    path: '/usuarios/new',
    name: 'usersFormNew',
    component: UsersForm,
  },
];

export default routes;
