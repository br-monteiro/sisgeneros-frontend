<template>
  <div>
    <template-default pgtitle="Refeições">
      <loaging-bar v-show="progress" />
      <box-content class="col-md-12 col-sm-12 col-xs-12" boxtitle="Lista de refeições">
        <form id="demo-form2" class="form-horizontal form-label-left">
          <div class="form-group">
            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="name">
              Nome <span class="required">*</span>
            </label>
            <div class="col-md-6 col-sm-6 col-xs-12">
              <input type="text" id="name" v-model="name" required="required" class="form-control col-md-7 col-xs-12">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="cnpj">
              CNPJ <span class="required">*</span>
            </label>
            <div class="col-md-6 col-sm-6 col-xs-12">
              <input type="text" id="cnpj" v-mask="'##.###.###/####-##'" v-model="cnpj" name="cnpj" required="required" class="form-control col-md-7 col-xs-12">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="contacts">
              Detalhes <span class="required">*</span>
            </label>
            <div class="col-md-6 col-sm-6 col-xs-12">
              <input type="text" id="contacts" v-model="contacts" name="contacts" required="required" class="form-control col-md-7 col-xs-12">
            </div>
          </div>
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

const baseUrl = Configurations.BASE_URL_PAI;

export default {
  name: 'suppliersForm',
  components: {
    TemplateDefault,
    LoagingBar,
    BoxContent,
  },
  data() {
    return {
      progress: false,
      name: '',
      cnpj: '',
      contacts: '',
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
      this.axios.get(`${baseUrl}suppliers/${this.$route.params.id}`)
        .then((response) => {
          // deactivating progress bar
          this.progress = false;
          this.id = response.data.data.id;
          this.name = response.data.data.name;
          this.cnpj = response.data.data.cnpj;
          this.contacts = response.data.data.contacts;
        })
        .catch((response) => {
          // deactivating progress bar
          this.progress = false;
          if (response.response && response.response.status === 404) {
            this.$router.push('/fornecedores');
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
        this.axios.put(`${baseUrl}suppliers/${this.$route.params.id}`, {
          name: this.name,
          cnpj: this.cnpj,
          contacts: this.contacts,
        })
          .then((response) => {
            // deactivating progress bar
            this.progress = false;
            this.name = response.data.data.name;
            this.cnpj = response.data.data.cnpj;
            this.contacts = response.data.data.contacts;
            this.dialog('Resgistro salvo com sucesso');
          })
          .catch((response) => {
            // deactivating progress bar
            this.progress = false;
            if (response.response && response.response.status === 404) {
              this.$router.push('/fornecedores');
            }
            error.dialog(this, response, schemaMessage);
          });
      } else {
        this.axios.post(`${baseUrl}suppliers`, {
          name: this.name,
          cnpj: this.cnpj,
          contacts: this.contacts,
        })
          .then(() => {
            // deactivating progress bar
            this.progress = false;
            this.name = '';
            this.cnpj = '';
            this.contacts = '';
            this.dialog('Resgistro salvo com sucesso');
          })
          .catch((response) => {
            // deactivating progress bar
            this.progress = false;
            if (response.response && response.response.status === 404) {
              this.$router.push('/fornecedores');
            }
            error.dialog(this, response, schemaMessage);
          });
      }
    },
    cancel(event) {
      event.preventDefault();
      this.$router.push('/fornecedores');
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
