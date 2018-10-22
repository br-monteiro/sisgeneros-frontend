import SuppliersList from '@/components/suppliers/List';
import SuppliersForm from '@/components/suppliers/Form';

const routes = [
  {
    path: '/fornecedores',
    name: 'SuppliersList',
    component: SuppliersList,
  },
  {
    path: '/fornecedores/edit/:id',
    name: 'SuppliersFormEdit',
    component: SuppliersForm,
  },
  {
    path: '/fornecedores/new',
    name: 'SuppliersFormNew',
    component: SuppliersForm,
  },
];

export default routes;
