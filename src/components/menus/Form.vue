<template>
  <div>
    <template-default pgtitle="Dias do cardápio">
      <loaging-bar v-show="progress" />
      <box-content class="col-md-12 col-sm-12 col-xs-12" boxtitle="Formulário de dias do cardápio">
        <form id="demo-form2" class="form-horizontal form-label-left">
          <input-text label="Dia" required="true" v-model="name" mask="##/##/####"/>
          <input-text label="Refeição" required="true" />
          <input-text label="Receita" required="true" />
          <input-text label="Quantidade de Pessoas" required="true" maxlength="4" />
          <div class="ln_solid"></div>
          <div class="form-group">
            <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
              <button class="btn btn-danger" type="button" @click="notRun">Cancelar</button>
              <button type="submit" class="btn btn-success" @click="notRun">Salvar</button>
            </div>
          </div>
        </form>
      </box-content>
      <box-content class="col-md-12 col-sm-12 col-xs-12" boxtitle="Cardápio de 19-12 à 25-12">
        <table class="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Refeição</th>
              <th>receita</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="day in dataWeek" v-bind:key="day.id">
              <td>{{day.date | date}}</td>
              <td>{{day.meal.name}}</td>
              <td>{{day.recipe || range()}}</td>
            </tr>
          </tbody>
        </table>
      </box-content>
    </template-default>
  </div>
</template>

<script>
import Configurations from '../../common/Configurations';
import Authenticator from '../../common/Authenticator';
import TemplateDefault from '../layout/TemplateDefault';
import LoagingBar from '../layout/LoadingBar';
import BoxContent from '../layout/BoxContent';
import schemaMessage from './schemaMessage';
import error from '../../common/DialogError';
import InputText from '../layout/InputText';

const baseUrl = Configurations.BASE_URL_API;

export default {
  name: 'mealsForm',
  components: {
    TemplateDefault,
    LoagingBar,
    BoxContent,
    InputText,
  },
  data() {
    return {
      progress: false,
      name: '',
      sort: 1,
      id: null,
      dataUser: {},
      dataWeek: [],
    };
  },
  created() {
    // just check authenticate
    if (!Authenticator.isLoggedIn()) {
      this.$router.push('/');
    }

    // getting the user data
    this.dataUser = Authenticator.getDataUser();
    this.axios.defaults.headers.common.Authorization = `Bearer ${this.dataUser.token}`;

    const t = true;
    // if (this.$route.params.id) {
    if (t) {
      // getting data
      this.axios.get(`${baseUrl}menudays/menu/${this.$route.params.id}`)
        .then((response) => {
          // deactivating progress bar
          this.progress = false;
          this.dataWeek = response.data.data;
        })
        .catch((response) => {
          // deactivating progress bar
          this.progress = false;
          if (response.response && response.response.status === 404) {
            this.$router.push('/refeicoes');
          }
          console.error(response);
        });
    }
  },
  methods: {
    save(event) {
      event.preventDefault();
      // active progress bar
      this.progress = true;
      if (this.$route.params.id) {
        this.axios.put(`${baseUrl}meals/${this.$route.params.id}`, {
          name: this.name,
          sort: this.toInt(this.sort),
        })
          .then((response) => {
            // deactivating progress bar
            this.progress = false;
            this.name = response.data.data.name;
            this.sort = response.data.data.sort;
            this.dialog('Resgistro salvo com sucesso');
          })
          .catch((response) => {
            // deactivating progress bar
            this.progress = false;
            if (response.response && response.response.status === 404) {
              this.$router.push('/refeicoes');
            }
            error.dialog(this, response, schemaMessage);
          });
      } else {
        this.axios.post(`${baseUrl}meals`, {
          name: this.name,
          sort: this.toInt(this.sort),
        })
          .then(() => {
            // deactivating progress bar
            this.progress = false;
            this.name = '';
            this.sort = 1;
            this.dialog('Resgistro salvo com sucesso');
          })
          .catch((response) => {
            // deactivating progress bar
            this.progress = false;
            if (response.response && response.response.status === 404) {
              this.$router.push('/refeicoes');
            }
            error.dialog(this, response, schemaMessage);
          });
      }
    },
    cancel(event) {
      event.preventDefault();
      this.$router.push('/refeicoes');
    },
    toInt(value) {
      const parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) return 0;
      return parsedValue;
    },
    dialog(message) {
      const options = { size: 'sm' };
      this.$dialogs.alert(message, options);
    },
    notRun(event) {
      event.preventDefault();
    },
    range() {
      const temp = [
        'Arroz com Galinha',
        'Frango em Cubos',
        'Filé ao Molho Branco',
        'Bife com Fritas',
        'Feijoada',
      ];
      const index = Math.floor((Math.random() * temp.length));
      return temp[index].toUpperCase();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
