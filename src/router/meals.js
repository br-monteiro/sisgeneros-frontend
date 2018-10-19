import MealsList from '@/components/meals/MealsList';
import MealsForm from '@/components/meals/MealsForm';

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
