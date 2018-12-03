<template>
  <div>
    <template-default pgtitle="OMs">
      <loaging-bar v-show="progress" />
      <box-content class="col-md-12 col-sm-12 col-xs-12" boxtitle="Formulário de OMs">
        <form id="demo-form2" class="form-horizontal form-label-left">
          <input-text label="Nome" required="true" v-model="name" />
          <input-text label="Indicativo Naval" required="true" v-model="navalIndicative" maxlength="6" />
          <input-text label="UASG" required="true" v-model="uasgNumber" maxlength="6" />

          <div class="form-group">
            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="first-active">
              É CeIM <span class="required">*</span>
            </label>
            <div class="col-md-6 col-sm-6 col-xs-12">
              Sim <input type="radio" id="first-active" name="active" value="yes" v-model="isCeim" required="required">
              Não <input type="radio" id="first-active" name="active" value="no" v-model="isCeim" required="required">
            </div>
          </div>

          <input-text label="Ag. Fiscal" required="true" v-model="fiscalAgent.name" readonly="true">
            <a class="btn btn-success pull-right btn-edit" @click="editFiscalAgent = true">
              <i class="fa fa-edit"></i>
            </a>
          </input-text>
          <input-autocomplete
            v-show="editFiscalAgent"
            data-field="fiscalAgent"
            label="Buscar"
            placeholder="Nome do Usuário ou NIP"
            pathtoview="fullName"
            auth="true"
            v-bind:url="'users/autocomplete'"
            v-bind:cbselect="select" />

          <input-text label="Fiel Munic." required="true" v-model="munitionFiel.name" readonly="true">
            <a class="btn btn-success pull-right btn-edit" @click="editMunitionFiel = true">
              <i class="fa fa-edit"></i>
            </a>
          </input-text>
          <input-autocomplete
            v-show="editMunitionFiel"
            data-field="munitionFiel"
            label="Buscar"
            placeholder="Nome do Usuário ou NIP"
            pathtoview="fullName"
            auth="true"
            v-bind:url="'users/autocomplete'"
            v-bind:cbselect="select" />

          <input-text label="Ges. Munic." required="true" v-model="munitionManager.name" readonly="true">
            <a class="btn btn-success pull-right btn-edit" @click="editMunitionManager = true">
              <i class="fa fa-edit"></i>
            </a>
          </input-text>
          <input-autocomplete
            v-show="editMunitionManager"
            data-field="munitionManager"
            label="Buscar"
            placeholder="Nome do Usuário ou NIP"
            pathtoview="fullName"
            auth="true"
            v-bind:url="'users/autocomplete'"
            v-bind:cbselect="select" />

          <input-text label="Paioleiro" required="true" v-model="stockManager.name" readonly="true">
            <a class="btn btn-success pull-right btn-edit" @click="editStockManager = true">
              <i class="fa fa-edit"></i>
            </a>
          </input-text>
          <input-autocomplete
            v-show="editStockManager"
            data-field="stockManager"
            label="Buscar"
            placeholder="Nome do Usuário ou NIP"
            pathtoview="fullName"
            auth="true"
            v-bind:url="'users/autocomplete'"
            v-bind:cbselect="select" />

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
import error from '../../common/DialogError';
import InputText from '../layout/InputText';
import InputAutocomplete from '../layout/InputAutocomplete';
import schemaMessage from './schemaMessage';

const baseUrl = Configurations.BASE_URL_API;

export default {
  name: 'militaryOrganizationsForm',
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
      sort: 1,
      id: null,
      dataUser: {},
      name: '',
      navalIndicative: '',
      uasgNumber: '',
      isCeim: 'no',
      fiscalAgent: {},
      munitionFiel: {},
      munitionManager: {},
      stockManager: {},
      editFiscalAgent: false,
      editMunitionFiel: false,
      editMunitionManager: false,
      editStockManager: false,
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
      this.axios.get(`${baseUrl}militaryorganizations/${this.$route.params.id}`)
        .then((response) => {
          // deactivating progress bar
          this.progress = false;
          this.id = response.data.data.id;
          this.name = response.data.data.name;
          this.navalIndicative = response.data.data.navalIndicative;
          this.uasgNumber = response.data.data.uasgNumber;
          this.isCeim = response.data.data.isCeim;
          this.fiscalAgent = response.data.data.fiscalAgent;
          this.munitionFiel = response.data.data.munitionFiel;
          this.munitionManager = response.data.data.munitionManager;
          this.stockManager = response.data.data.stockManager;
        })
        .catch((response) => {
          // deactivating progress bar
          this.progress = false;
          if (response.response && response.response.status === 404) {
            this.$router.push('/oms');
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
        this.axios.put(`${baseUrl}militaryorganizations/${this.$route.params.id}`, {
          name: this.name,
          navalIndicative: this.navalIndicative.toUpperCase(),
          uasgNumber: this.toInt(this.uasgNumber),
          isCeim: this.isCeim,
          fiscalAgent: this.fiscalAgent.id,
          munitionFiel: this.munitionFiel.id,
          munitionManager: this.munitionManager.id,
          stockManager: this.stockManager.id,
        })
          .then((response) => {
            // deactivating progress bar
            this.progress = false;
            this.name = response.data.data.name;
            this.navalIndicative = response.data.data.navalIndicative;
            this.uasgNumber = response.data.data.uasgNumber;
            this.isCeim = response.data.data.isCeim;
            this.fiscalAgent = response.data.data.fiscalAgent;
            this.munitionFiel = response.data.data.munitionFiel;
            this.munitionManager = response.data.data.munitionManager;
            this.stockManager = response.data.data.stockManager;
            this.dialog('Resgistro salvo com sucesso');
          })
          .catch((response) => {
            // deactivating progress bar
            this.progress = false;
            if (response.response && response.response.status === 404) {
              this.$router.push('/oms');
            }
            error.dialog(this, response, schemaMessage);
          });
      } else {
        this.axios.post(`${baseUrl}militaryorganizations`, {
          name: this.name,
          navalIndicative: this.navalIndicative.toUpperCase(),
          uasgNumber: this.toInt(this.uasgNumber),
          isCeim: this.isCeim,
          fiscalAgent: this.fiscalAgent.id,
          munitionFiel: this.munitionFiel.id,
          munitionManager: this.munitionManager.id,
          stockManager: this.stockManager.id,
        })
          .then(() => {
            // deactivating progress bar
            this.progress = false;
            this.name = '';
            this.navalIndicative = '';
            this.uasgNumber = '';
            this.isCeim = 'no';
            this.fiscalAgent = {};
            this.munitionFiel = {};
            this.munitionManager = {};
            this.stockManager = {};
            this.dialog('Resgistro salvo com sucesso');
          })
          .catch((response) => {
            // deactivating progress bar
            this.progress = false;
            if (response.response && response.response.status === 404) {
              this.$router.push('/oms');
            }
            error.dialog(this, response, schemaMessage);
          });
      }
    },
    cancel(event) {
      event.preventDefault();
      this.$router.push('/oms');
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
    getDataSet(event) {
      try {
        return event.target.parentElement.parentElement.parentElement.parentElement.dataset;
      } catch (e) {
        return {};
      }
    },
    adapterUser(value) {
      const data = {};
      if (value) {
        data.id = this.toInt(value.id);
        data.name = value.fullName;
      }
      return data;
    },
    select(value, event) {
      if (value && event) {
        const dataset = this.getDataSet(event);
        if (dataset.field === 'fiscalAgent') {
          this.fiscalAgent = this.adapterUser(value);
          this.editFiscalAgent = false;
        } else if (dataset.field === 'munitionFiel') {
          this.munitionFiel = this.adapterUser(value);
          this.editMunitionFiel = false;
        } else if (dataset.field === 'munitionManager') {
          this.munitionManager = this.adapterUser(value);
          this.editMunitionManager = false;
        } else if (dataset.field === 'stockManager') {
          this.stockManager = this.adapterUser(value);
          this.editStockManager = false;
        }
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
