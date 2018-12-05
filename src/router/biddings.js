import BiddingsList from '@/components/biddings/List';
import BiddingsForm from '@/components/biddings/Form';
import BiddingsFormItens from '@/components/biddings/FormItens';

const routes = [
  {
    path: '/licitacoes',
    name: 'biddingsList',
    component: BiddingsList,
  },
  {
    path: '/licitacoes/new',
    name: 'biddingsFormNew',
    component: BiddingsForm,
  },
  {
    path: '/licitacoes/edit/:id',
    name: 'biddingsFormEdit',
    component: BiddingsForm,
  },
  {
    path: '/licitacoes/edit/:id/itens',
    name: 'biddingsFormEdit',
    component: BiddingsFormItens,
  },
];

export default routes;
