<template>
  <div>
    <template-default pgtitle="Refeições">
      <loaging-bar v-show="progress"></loaging-bar>
      <box-content class="col-md-12 col-sm-12 col-xs-12" boxtitle="Lista de refeições">
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
                <button class="btn btn-xs btn-info" @click="goTo" v-bind:data-url="`/usuarios/edit/${result.id}/oms`">
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
        <navigation-buttons v-bind:total="allResults" url="/#/usuarios" v-bind:current="current" />
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
import NavigationButtons from '../layout/NavigationButtons';

const baseUrl = Configurations.BASE_URL_PAI;

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
      current: 1,
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
  watch: {
    '$route.query.page': function page(value) {
      this.fecthData(value);
    },
  },
  methods: {
    edit(id) {
      this.$router.push(`/usuarios/edit/${id}`);
    },
    fecthData(page) {
      let parsedPag = parseInt(page, 10);
      if (isNaN(parsedPag)) {
        parsedPag = this.current;
      }

      if (parsedPag === this.current && page !== undefined) return;

      this.current = parsedPag;

      if (parsedPag > 1) {
        parsedPag = (parsedPag * this.maxPerPage) - 1;
      }
      if (parsedPag === 1) {
        parsedPag = 0;
      }
      // active progress bar
      this.progress = true;
      // getting data
      this.axios.get(`${baseUrl}users?limit=${this.maxPerPage}&offset=${parsedPag}`)
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
        return value.map(i => i.name).join('<br>');
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
</style>
