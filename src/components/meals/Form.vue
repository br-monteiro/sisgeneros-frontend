<template>
  <div>
    <template-default pgtitle="Refeições">
      <loaging-bar v-show="progress" />
      <box-content class="col-md-12 col-sm-12 col-xs-12" boxtitle="Formulário de refeições">
        <form id="demo-form2" class="form-horizontal form-label-left">
          <input-text label="Nome" required="true" v-model="name"/>
          <input-text label="Ordem de Exibição" required="true" v-model="sort"/>
          <div class="ln_solid"></div>
          <div class="form-group">
            <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
              <button class="btn btn-danger" type="button" @click="cancel">Cancelar</button>
              <button type="submit" class="btn btn-success" @click="save">Salvar</button>
            </div>
          </div>
        </form>
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

    if (this.$route.params.id) {
      // getting data
      this.axios.get(`${baseUrl}meals/${this.$route.params.id}`)
        .then((response) => {
          // deactivating progress bar
          this.progress = false;
          this.id = response.data.data.id;
          this.name = response.data.data.name;
          this.sort = response.data.data.sort;
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
