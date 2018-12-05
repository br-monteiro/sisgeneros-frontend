<template>
  <div>
    <template-default pgtitle="Usuários">
      <loaging-bar v-show="progress" />
      <box-content class="col-md-12 col-sm-12 col-xs-12" boxtitle="Formulário de Usuários">
        <form id="demo-form2" class="form-horizontal form-label-left">
          <input-text label="Nome de Guerra" required="true" v-model="name" />
          <input-text label="Nome completo" required="true" v-model="fullName" />
          <input-text label="Posto/Graduação" required="true" v-model="militaryPost" />
          <input-text label="NIP" required="true" mask="##.####.##" v-model="nip" />
          <div v-if="isCreating">
            <input-text label="Usuário" required="true" v-model="username" />
            <input-text label="Senha" required="true" v-model="password" />
          </div>

          <div class="form-group" v-if="!isCreating">
            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="first-active">
              Ativo <span class="required">*</span>
            </label>
            <div class="col-md-6 col-sm-6 col-xs-12">
              Sim <input type="radio" id="first-active" name="active" value="yes" v-model="active" required="required">
              Não <input type="radio" id="first-active" name="active" value="no" v-model="active" required="required">
            </div>
          </div>

          <div class="ln_solid"></div>
          <div class="form-group">
            <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
              <button class="btn btn-danger" type="button" @click="cancel">Cancelar</button>
              <button type="submit" class="btn btn-success" @click="save">Salvar</button>
              <button type="submit" class="btn btn-info" @click="goTo" v-if="id" v-bind:data-url="`/usuarios/edit/${id}/oms`">OMs</button>
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
import InputText from '../layout/InputText';
import LoagingBar from '../layout/LoadingBar';
import BoxContent from '../layout/BoxContent';
import schemaMessage from './schemaMessage';
import error from '../../common/DialogError';

const baseUrl = Configurations.BASE_URL_API;

export default {
  name: 'usersForm',
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
      fullName: '',
      militaryPost: '',
      nip: '',
      active: 'yes',
      username: '',
      password: '',
      isCreating: true,
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
      this.isCreating = false;
      // getting data
      this.axios.get(`${baseUrl}users/${this.$route.params.id}`)
        .then((response) => {
          // deactivating progress bar
          this.progress = false;
          this.id = response.data.data.id;
          this.name = response.data.data.name;
          this.fullName = response.data.data.fullName;
          this.nip = response.data.data.nip;
          this.militaryPost = response.data.data.militaryPost;
          this.active = response.data.data.active;
        })
        .catch((response) => {
          // deactivating progress bar
          this.progress = false;
          if (response.response && response.response.status === 404) {
            this.$router.push('/usuarios');
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
        this.axios.put(`${baseUrl}users/${this.$route.params.id}`, {
          name: this.name,
          fullName: this.fullName,
          nip: this.nip,
          militaryPost: this.militaryPost,
          active: this.active,
        })
          .then((response) => {
            // deactivating progress bar
            this.progress = false;
            this.name = response.data.data.name;
            this.fullName = response.data.data.fullName;
            this.nip = response.data.data.nip;
            this.militaryPost = response.data.data.militaryPost;
            this.active = response.data.data.active;
            this.username = response.data.username;
            this.password = response.data.data.password;
            this.dialog('Resgistro salvo com sucesso');
          })
          .catch((response) => {
            // deactivating progress bar
            this.progress = false;
            if (response.response && response.response.status === 404) {
              this.$router.push('/usuarios');
            }
            error.dialog(this, response, schemaMessage);
          });
      } else {
        this.axios.post(`${baseUrl}users`, {
          name: this.name,
          fullName: this.fullName,
          nip: this.nip,
          militaryPost: this.militaryPost,
          active: this.active,
          username: this.username,
          password: this.password,
        })
          .then((response) => {
            // deactivating progress bar
            this.progress = false;
            this.name = '';
            this.fullName = '';
            this.nip = '';
            this.militaryPost = '';
            this.active = 'no';
            this.id = response.data.data.id;
            this.dialog('Resgistro salvo com sucesso');
          })
          .catch((response) => {
            // deactivating progress bar
            this.progress = false;
            if (response.response && response.response.status === 404) {
              this.$router.push('/usuarios');
            }
            error.dialog(this, response, schemaMessage);
          });
      }
    },
    cancel(event) {
      event.preventDefault();
      this.$router.push('/usuarios');
    },
    dialog(message) {
      const options = { size: 'sm' };
      this.$dialogs.alert(message, options);
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
</style>
