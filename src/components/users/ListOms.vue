<template>
  <div>
    <template-default pgtitle="Organizações Militares">
      <loaging-bar v-show="progress"></loaging-bar>
      <box-content class="col-md-12 col-sm-12 col-xs-12" boxtitle="Seleção de OMs">
        <form id="demo-form2" class="form-horizontal form-label-left">
          <input-autocomplete
            label="OM"
            placeholder="Nome da OM, Indicativo Naval ou UASG"
            pathtoview="name"
            auth="true"
            v-bind:url="`users/autocomplete/oms`"
            v-bind:cbselect="select"
            css="margin-left: 25%;" />
          <span v-if="selected.id">
            <div class="form-group">
              <label class="control-label col-md-3 col-sm-3 col-xs-12">
                OM Selecionada
              </label>
              <div class="col-md-6 col-sm-6 col-xs-12">
                <input type="text" v-bind:value="selected.name" class="form-control col-md-7 col-xs-12" readonly>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-md-3 col-sm-3 col-xs-12">
                Perfil
              </label>
              <div class="col-md-6 col-sm-6 col-xs-12">
                <select v-model="selectedProfile" class="form-control col-md-7 col-xs-12">
                  <option value="root">{{'root' | translate}}</option>
                  <option value="admin">{{'admin' | translate}}</option>
                  <option value="manager">{{'manager' | translate}}</option>
                  <option value="requester">{{'requester' | translate}}</option>
                  <option value="viewer" selected>{{'viewer' | translate}}</option>
                </select>
              </div>
            </div>
            <div class="ln_solid"></div>
            <div class="form-group" v-show="selectedProfile">
              <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                <button type="submit" class="btn btn-success" @click="addProfile" >Adicionar Perfil</button>
              </div>
            </div>
          </span>
        </form>
      </box-content>

      <box-content class="col-md-12 col-sm-12 col-xs-12" boxtitle="Lista de refeições">
        <table class="table">
          <thead>
            <tr>
              <th>OM</th>
              <th>Perfil</th>
              <th>Centro</th>
              <th>Principal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="result in results" v-bind:key="result.id" v-bind:class="{ active: result.isCeim === 'yes', success: result.default === 'yes' }">
              <th>{{result.navalIndicative}}</th>
              <th>{{result.profile | translate}}</th>
              <th>{{result.isCeim | translate}}</th>
              <th>{{result.default | translate}}</th>
              <th>
                <button class="btn btn-xs btn-info" @click="changeDefaut(result)" v-bind:class="{ 'btn-success is-default': result.default === 'yes' }">
                  <i class="fa fa-university" v-show="result.default === 'yes'"></i>
                  <i class="fa fa-check" v-show="result.default === 'no'"></i>
                </button>
                <button class="btn btn-xs btn-danger" @click="remove(result.id)">
                  <i class="fa fa-close"></i>
                </button>
              </th>
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
import InputText from '../layout/InputText';
import InputAutocomplete from '../layout/InputAutocomplete';

const baseUrl = Configurations.BASE_URL_PAI;

export default {
  name: 'usersListOms',
  components: {
    TemplateDefault,
    LoagingBar,
    BoxContent,
    InputText,
    InputAutocomplete,
  },
  data() {
    return {
      progress: false,
      results: [],
      dataUser: {},
      name: '',
      selected: {},
      selectedProfile: '',
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
    this.fecthData();
  },
  methods: {
    fecthData() {
      // active progress bar
      this.progress = true;
      // getting data
      this.axios.get(`${baseUrl}users/${this.$route.params.id}/oms`)
        .then((response) => {
          // deactivating progress bar
          this.progress = false;
          this.results = response.data.data;
        })
        .catch((response) => {
          // deactivating progress bar
          this.progress = false;
          console.error(response);
        });
    },
    saveProvile() {
      this.axios.put(`${baseUrl}users/${this.$route.params.id}/oms`, {
        militaryOrganizationsId: parseInt(this.selected.id, 10),
        profile: this.selectedProfile,
      })
        .then((response) => {
          // deactivating progress bar
          this.progress = false;
          this.results = response.data.data;
          this.selected = {};
          this.selectedProfile = '';
          this.dialog('Perfil adicionado com sucesso');
          this.updateUserProfile();
        })
        .catch((response) => {
          // deactivating progress bar
          this.progress = false;
          if (response.response && response.response.status === 404) {
            this.$router.push('/usuarios');
          }
        });
    },
    updateUserProfile() {
      if (Authenticator.getDataUser().userId === parseInt(this.$route.params.id, 10)) {
        Authenticator.updateUserProfile(this.results);
      }
    },
    remove(id) {
      if (this.results.length > 1) {
        // active progress bar
        this.progress = true;
        this.axios.delete(`${baseUrl}users/${this.$route.params.id}/${id}/oms`)
          .then((response) => {
            if (response.status === 204) {
              // deactivating progress bar
              this.results = this.results.filter(el => el.id !== id);
              this.progress = false;
              this.updateUserProfile();
            }
          })
          .catch((response) => {
            // deactivating progress bar
            this.progress = false;
            console.error(response);
          });
      } else {
        this.dialog('O Usuário deve ter ao menos um perfil para uma OM');
      }
    },
    select(value) {
      this.selected = value;
    },
    dialog(message) {
      const options = { size: 'sm' };
      this.$dialogs.alert(message, options);
    },
    addProfile(event) {
      event.preventDefault();
      const hasProfile = this.results.find(el => el.id === this.selected.id);
      if (!hasProfile) {
        this.saveProvile();
      } else {
        this.dialog('Esta OM possui um perfil setado pata este usuário. Remova para continuar.');
      }
    },
    changeDefaut(value) {
      if (value.default === 'no') {
        this.axios.put(`${baseUrl}users/${this.$route.params.id}/${value.id}/oms/changedefault`, {
          militaryOrganizationsId: parseInt(value.id, 10),
          profile: value.profile,
        })
          .then((response) => {
            // deactivating progress bar
            this.progress = false;
            this.results = response.data.data;
            this.dialog('OM principal alterada com sucesso.');
            this.updateUserProfile();
          })
          .catch((response) => {
            // deactivating progress bar
            this.progress = false;
            if (response.response && response.response.status === 404) {
              this.$router.push('/usuarios');
            }
          });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button.btn-info:not(.is-default) {
  opacity: 0.5;
  cursor: pointer;
}
button.btn-info {
  cursor: default;
}
</style>
