<template>
  <div>
    <template-default pgtitle="Lista de Usuários">
      <loaging-bar v-show="progress"></loaging-bar>
      <box-content class="col-md-12 col-sm-12 col-xs-12" boxtitle="Lista de usuários">
        <table class="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>NIP</th>
              <th>Posto/Graduação</th>
              <th>Ativo</th>
              <th>OM</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="result in results" v-bind:key="result.id">
              <th>{{result.name}}</th>
              <th>{{result.nip}}</th>
              <th>{{result.militaryPost}}</th>
              <th>{{result.active | translate}}</th>
              <th v-html="om(result.militaryOrganizations)"></th>
              <th>
                <button class="btn btn-xs btn-info" @click="goTo(`/usuarios/edit/${result.id}/oms`)">
                  <i class="fa fa-university"></i>
                </button>
                <button class="btn btn-xs btn-success" @click="edit(result.id)">
                  <i class="fa fa-edit"></i>
                </button>
                <button class="btn btn-xs btn-danger" @click="remove(result.id)">
                  <i class="fa fa-close"></i>
                </button>
              </th>
            </tr>
          </tbody>
        </table>
        <navigation-buttons
          :total="allResults"
          :per-page="maxPerPage"
          :current="current"
          :click-handler="clickPagination"
        />
      </box-content>
    </template-default>
  </div>
</template>

<script>
import Configurations from '../../common/Configurations';
import Authenticator from '../../common/Authenticator';
import functions from '../../common/Functions';
import TemplateDefault from '../layout/TemplateDefault';
import LoagingBar from '../layout/LoadingBar';
import BoxContent from '../layout/BoxContent';
import NavigationButtons from '../layout/NavigationButtons';

const baseUrl = Configurations.BASE_URL_API;

export default {
  name: 'usersList',
  components: {
    TemplateDefault,
    LoagingBar,
    BoxContent,
    NavigationButtons,
  },
  data() {
    return {
      progress: false,
      results: [],
      dataUser: {},
      allResults: 0,
      maxPerPage: 50,
      current: 0,
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
    this.clickPagination(); // fetchData
  },
  methods: {
    edit(id) {
      this.$router.push(`/usuarios/edit/${id}`);
    },
    clickPagination(page) {
      functions.clickPagination(page, this);
    },
    fetchData(page) {
      // active progress bar
      this.progress = true;
      // getting data
      this.axios.get(`${baseUrl}users?limit=${this.maxPerPage}&page=${page}`)
        .then((response) => {
          // deactivating progress bar
          this.progress = false;
          this.results = response.data.data;
          this.allResults = response.data.allResults;
        })
        .catch((response) => {
          // deactivating progress bar
          this.progress = false;
          console.error(response);
        });
    },
    remove(id) {
      // active progress bar
      this.progress = true;

      this.axios.delete(`${baseUrl}users/${id}`)
        .then((response) => {
          if (response.status === 204) {
            // deactivating progress bar
            this.progress = false;
            this.results = this.results.filter(el => el.id !== id);
          }
        })
        .catch((response) => {
          // deactivating progress bar
          this.progress = false;
          console.error(response);
        });
    },
    om(value) {
      if (Array.isArray(value)) {
        return value.map(i => i.navalIndicative).join('<br>');
      }
      return value;
    },
    goTo(url) {
      if (url) {
        this.$router.push(url);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
