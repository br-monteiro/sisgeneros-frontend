<template>
  <div>
    <template-default pgtitle="Licitações">
      <loaging-bar v-show="progress" />
      <box-content class="col-md-12 col-sm-12 col-xs-12" boxtitle="Formulário de Licitações">
        <form id="demo-form2" class="form-horizontal form-label-left">
          <input-text label="Número" required="true" v-model="number" mask="#####" />
          <input-text label="Ano" required="true" v-model="year" mask="####" />
          <input-text label="UASG" required="true" v-model="uasgNumber" mask="######" />
          <input-text label="Órgão" required="true" v-model="uasgName" />
          <input-text label="Validade" placeholder="Data no padrão DD-MM-AAAA" mask="##-##-####" required="true" v-model="validate" />
          <div class="ln_solid"></div>
          <div class="form-group">
            <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
              <button class="btn btn-danger" type="button" @click="cancel">Cancelar</button>
              <button type="submit" class="btn btn-success" @click="save">Salvar</button>
              <button type="submit" class="btn btn-info" @click="goTo" v-if="id" v-bind:data-url="`/licitacoes/edit/${id}/itens`">Itens</button>
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
import error from '../../common/DialogError';
import InputText from '../layout/InputText';
import schemaMessage from './schemaMessage';

const baseUrl = Configurations.BASE_URL_API;

export default {
  name: 'biddings',
  components: {
    TemplateDefault,
    LoagingBar,
    BoxContent,
    InputText,
  },
  data() {
    return {
      progress: false,
      dataUser: {},
      id: null,
      number: '',
      year: (new Date()).getFullYear(),
      uasgNumber: '',
      uasgName: '',
      validate: '',
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
      this.axios.get(`${baseUrl}biddings/${this.$route.params.id}`)
        .then((response) => {
          // deactivating progress bar
          this.progress = false;
          this.id = response.data.data.id;
          this.year = response.data.data.year;
          this.number = response.data.data.number;
          this.uasgNumber = response.data.data.uasgNumber;
          this.uasgName = response.data.data.uasgName;
          this.validate = this.formatDate(response.data.data.validate);
        })
        .catch((response) => {
          // deactivating progress bar
          this.progress = false;
          if (response.response && response.response.status === 404) {
            this.$router.push('/licitacoes');
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
        this.axios.put(`${baseUrl}biddings/${this.$route.params.id}`, {
          number: this.toInt(this.number),
          year: this.toInt(this.year),
          uasgNumber: this.toInt(this.uasgNumber),
          uasgName: this.uasgName,
          validate: this.formatDate(this.validate),
        })
          .then((response) => {
            // deactivating progress bar
            this.progress = false;
            this.id = response.data.data.id;
            this.year = response.data.data.year;
            this.number = response.data.data.number;
            this.uasgNumber = response.data.data.uasgNumber;
            this.uasgName = response.data.data.uasgName;
            this.validate = this.formatDate(response.data.data.validate);
            this.dialog('Resgistro salvo com sucesso');
          })
          .catch((response) => {
            // deactivating progress bar
            this.progress = false;
            if (response.response && response.response.status === 404) {
              this.$router.push('/licitacoes');
            }
            error.dialog(this, response, schemaMessage);
          });
      } else {
        this.axios.post(`${baseUrl}biddings`, {
          number: this.toInt(this.number),
          year: this.toInt(this.year),
          uasgNumber: this.toInt(this.uasgNumber),
          uasgName: this.uasgName,
          validate: this.formatDate(this.validate),
        })
          .then((response) => {
            // deactivating progress bar
            this.progress = false;
            this.id = response.data.data.id;
            this.number = '';
            this.year = (new Date()).getFullYear();
            this.uasgNumber = '';
            this.uasgName = '';
            this.validate = '';
            this.dialog('Resgistro salvo com sucesso');
          })
          .catch((response) => {
            // deactivating progress bar
            this.progress = false;
            if (response.response && response.response.status === 404) {
              this.$router.push('/licitacoes');
            }
            error.dialog(this, response, schemaMessage);
          });
      }
    },
    cancel(event) {
      event.preventDefault();
      this.$router.push('/licitacoes');
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
    formatDate(value) {
      if (value) {
        return value.split('-').reverse().join('-');
      }
      return value;
    },
    goTo(event) {
      event.preventDefault();
      const el = event.target;
      if (el.dataset.url) {
        this.$router.push(el.dataset.url);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn-edit {
  position: absolute;
  margin-left: -40px;
}
</style>
