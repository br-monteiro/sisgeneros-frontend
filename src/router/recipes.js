import RecipesList from '@/components/recipes/List';
import RecipesForm from '@/components/recipes/Form';
import FormAndList from '@/components/recipes/FormAndList';
import FormItem from '@/components/recipes/FormItem';

const routes = [
  {
    path: '/receitas',
    name: 'RecipesList',
    component: RecipesList,
  },
  {
    path: '/receitas/edit/:id',
    name: 'RecipesFormEdit',
    component: FormAndList,
  },
  {
    path: '/receitas/edit/:id/:idItem',
    name: 'RecipesFormEditItem',
    component: FormItem,
  },
  {
    path: '/receitas/new',
    name: 'RecipesFormNew',
    component: RecipesForm,
  },
];

export default routes;
