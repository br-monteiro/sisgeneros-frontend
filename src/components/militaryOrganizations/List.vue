<template>
  <div>
    <template-default pgtitle="OMs">
      <loaging-bar v-show="progress"></loaging-bar>
      <box-content class="col-md-12 col-sm-12 col-xs-12" boxtitle="Lista de OMs">
        <table class="table">
          <thead>
            <tr>
              <th></th>
              <th>Nome</th>
              <th>UASG</th>
              <th>CeIM</th>
              <th>Ag. Fiscal</th>
              <th>Fiel Munic.</th>
              <th>Ges. Munic.</th>
              <th>Paioleiro</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="result in results" v-bind:key="result.id">
              <th>{{result.navalIndicative}}</th>
              <th>{{result.name | truncate}}</th>
              <th>{{result.uasgNumber}}</th>
              <th>{{result.isCeim | translate}}</th>
              <th>{{result.fiscalAgent | truncate}}</th>
              <th>{{result.munitionFiel | truncate}}</th>
              <th>{{result.munitionManager | truncate}}</th>
              <th>{{result.stockManager | truncate}}</th>
              <th>
                <button class="btn btn-xs btn-info" @click="edit(result.id)">
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
  name: 'militaryOrganizationsList',
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
      url: Configurations.BASE_URL_APP,
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
      this.$router.push(`/oms/edit/${id}`);
    },
    clickPagination(page) {
      functions.clickPagination(page, this);
    },
    fetchData(page) {
      // active progress bar
      this.progress = true;
      // getting data
      this.axios.get(`${baseUrl}militaryorganizations?limit=${this.maxPerPage}&page=${page}`)
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

      this.axios.delete(`${baseUrl}militaryorganizations/${id}`)
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
