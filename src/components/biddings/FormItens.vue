<template>
  <div>
    <template-default pgtitle="Itens da Licitação">
      <loaging-bar v-show="progress"></loaging-bar>

      <template slot="title-right">
        <search-on-top
          placeholder="Buscar por Item"
          :pathtoview="itemSearch"
          auth="true"
          :url="`biddingsitems/bidding/${id}/search`"
          :cbselect="select"/>
      </template>

      <box-content class="col-md-12 col-sm-12 col-xs-12" boxtitle="Formulário de Items">
        <form id="demo-form2" class="form-horizontal form-label-left">
          <input-text label="Número" required="true" v-model="bidding.number" mask="#####" />
          <input-text label="Nome" required="true" v-model="bidding.name" />
          <input-text label="UF" required="true" v-model="bidding.supplyUnit" maxlength="5" />
          <input-text label="Quantidade" required="true" v-model="bidding.initialQuantity" />

          <div class="form-group">
            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="first-name">
              Valor<span class="required">*</span>
            </label>
            <div class="col-md-6 col-sm-6 col-xs-12">
              <money v-model="bidding.value" class="form-control col-md-7 col-xs-12"></money>
            </div>
          </div>

          <input-text label="Fornecedor" required="true" v-model="bidding.suppliers.name" readonly="true">
            <a class="btn btn-success pull-right btn-edit" @click="editSupplier = true">
              <i class="fa fa-edit"></i>
            </a>
          </input-text>
          <input-autocomplete
            v-show="editSupplier"
            label="Buscar"
            placeholder="Razão Social ou CNPJ"
            pathtoview="name"
            auth="true"
            url="suppliers/search"
            :cbselect="selectSupplier" />

          <div class="ln_solid"></div>
          <div class="form-group">
            <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
              <button type="submit" class="btn btn-success" v-show="!bidding.id" @click="save">Adicionar Item</button>
              <button type="submit" class="btn btn-info" v-show="bidding.id" @click="save">Editar Item</button>
            </div>
          </div>
        </form>
      </box-content>

      <box-content class="col-md-12 col-sm-12 col-xs-12" boxtitle="Lista de Itens">
        <table class="table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Licitação</th>
              <th>Fornecedor</th>
              <th>Descrição</th>
              <th>UF</th>
              <th>Quantidade</th>
              <th>Valor</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="result in results" v-bind:key="result.id">
              <th>{{result.number}}</th>
              <th>{{result.biddings.number}}</th>
              <th>{{result.suppliers.name | truncate}}</th>
              <th>{{result.name | truncate}}</th>
              <th>{{result.supplyUnit}}</th>
              <th>{{result.currentQuantity}} de {{result.initialQuantity}}</th>
              <th>{{result.value | money}}</th>
              <th>
                <button class="btn btn-xs btn-info" @click="edit(result)">
                  <i class="fa fa-edit"></i>
                </button>
                <button class="btn btn-xs btn-danger" @click="remove(result.id)">
                  <i class="fa fa-close"></i>
                </button>
              </th>
            </tr>
          </tbody>
        </table>
        <navigation-buttons v-bind:total="allResults" v-bind:url="`${url}/#/licitacoes/edit/${id}/itens`" v-bind:current="current" />
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
import SearchOnTop from '../layout/SearchOnTop';
import InputText from '../layout/InputText';
import InputAutocomplete from '../layout/InputAutocomplete';
import schemaMessage from './schemaMessageBiddingsItems';
import error from '../../common/DialogError';

const baseUrl = Configurations.BASE_URL_API;

export default {
  name: 'biddingsFormItens',
  components: {
    TemplateDefault,
    LoagingBar,
    BoxContent,
    NavigationButtons,
    SearchOnTop,
    InputText,
    InputAutocomplete,
  },
  data() {
    return {
      progress: false,
      results: [],
      dataUser: {},
      allResults: 0,
      maxPerPage: 50,
      current: 1,
      url: Configurations.BASE_URL_APP,
      id: null,
      editSupplier: false,
      bidding: {
        id: '',
        number: '',
        name: '',
        initialQuantity: '',
        value: '',
        supplyUnit: '',
        suppliers: {},
        biddings: {},
      },
      selectedSupplier: {},
    };
  },
  created() {
    // just check authenticate
    if (!Authenticator.isLoggedIn()) {
      this.$router.push('/');
    }
    // getting the ID passed by parameter
    this.id = this.$route.params.id;
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
    edit(value) {
      this.select(value);
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
      this.axios.get(`${baseUrl}biddingsitems/bidding/${this.id}?limit=${this.maxPerPage}&offset=${parsedPag}`)
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

      this.axios.delete(`${baseUrl}biddingsitems/${id}`)
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
    select(value) {
      this.bidding = Object.assign({}, value);
    },
    itemSearch(el) {
      return `${el.number} - ${el.name}`;
    },
    selectSupplier(value) {
      this.bidding.suppliers.id = value.id;
      this.bidding.suppliers.name = value.name;
      this.editSupplier = false;
    },
    dialog(message) {
      const options = { size: 'sm' };
      this.$dialogs.alert(message, options);
    },
    toInt(value) {
      const parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) return 0;
      return parsedValue;
    },
    save(event) {
      event.preventDefault();
      // active progress bar
      this.progress = true;
      if (this.bidding.id) {
        this.axios.put(`${baseUrl}biddingsitems/${this.bidding.id}`, {
          number: this.toInt(this.bidding.number),
          name: this.bidding.name,
          initialQuantity: parseFloat(this.bidding.initialQuantity),
          value: this.bidding.value,
          supplyUnit: this.bidding.supplyUnit,
          suppliersId: this.bidding.suppliers.id,
          biddingsId: this.toInt(this.bidding.biddings.id),
        })
          .then((response) => {
            // deactivating progress bar
            this.progress = false;
            this.bidding = response.data.data;
            this.results = this.results.map((el) => {
              let changedElement = el;
              if (el.id === this.bidding.id) {
                changedElement = response.data.data;
              }
              return changedElement;
            });
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
        this.axios.post(`${baseUrl}biddingsitems`, {
          number: this.toInt(this.bidding.number),
          name: this.bidding.name,
          initialQuantity: parseFloat(this.bidding.initialQuantity),
          value: this.bidding.value,
          supplyUnit: this.bidding.supplyUnit,
          suppliersId: this.bidding.suppliers.id,
          biddingsId: this.toInt(this.id),
        })
          .then((response) => {
            // deactivating progress bar
            this.progress = false;
            this.bidding.id = '';
            this.bidding.number = '';
            this.bidding.name = '';
            this.bidding.initialQuantity = '';
            this.bidding.value = '';
            this.bidding.supplyUnit = '';
            this.bidding.suppliers = {};
            this.bidding.biddings = {};
            this.results.unshift(response.data.data);
            this.dialog('Resgistro salvo com sucesso');
          })
          .catch((response) => {
            // deactivating progress bar
            this.progress = false;
            if (response.response && response.response.status === 404) {
              this.$router.push(`/licitacoes/edit/${this.id}/itens`);
            }
            error.dialog(this, response, schemaMessage);
          });
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
