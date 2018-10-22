import MealsList from '@/components/meals/List';
import MealsForm from '@/components/meals/Form';

const routes = [
  {
    path: '/refeicoes',
    name: 'mealsList',
    component: MealsList,
  },
  {
    path: '/refeicoes/edit/:id',
    name: 'mealsFormEdit',
    component: MealsForm,
  },
  {
    path: '/refeicoes/new',
    name: 'mealsFormNew',
    component: MealsForm,
  },
];

export default routes;
