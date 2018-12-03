import MilitaryOrganizationsList from '@/components/militaryOrganizations/List';
import MilitaryOrganizationsForm from '@/components/militaryOrganizations/Form';

const routes = [
  {
    path: '/oms',
    name: 'militaryOrganizationsList',
    component: MilitaryOrganizationsList,
  },
  {
    path: '/oms/edit/:id',
    name: 'militaryOrganizationsFormEdit',
    component: MilitaryOrganizationsForm,
  },
  {
    path: '/oms/new',
    name: 'militaryOrganizationsFormNew',
    component: MilitaryOrganizationsForm,
  },
];

export default routes;
