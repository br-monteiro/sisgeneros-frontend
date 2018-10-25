<template>
  <div>
    <template-default pgtitle="Receitas">
      <loaging-bar v-show="progress" />
      <box-content class="col-md-12 col-sm-12 col-xs-12" boxtitle="Lista de receitas">
        <form id="demo-form2" class="form-horizontal form-label-left">
          <div class="form-group">
            <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
              <button class="btn btn-info" type="button" @click="addItem">Adicionar Item</button>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="name">
              Nome <span class="required">*</span>
            </label>
            <div class="col-md-6 col-sm-6 col-xs-12">
              <input type="text" id="name" v-model="name" required="required" class="form-control col-md-7 col-xs-12">
            </div>
          </div>
          <div class="form-group" v-for="(item, index) in items" v-bind:key="index">
            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="items">
              <button class="btn btn-danger" v-show="index !== 0" type="button" @click="removeItem(item, index)">
                <i class="fa fa-trash"></i>
              </button>
              Item <span class="required">*</span>
            </label>
            <div class="col-md-6 col-sm-6 col-xs-12">
              <input type="text" id="items" v-model="item.name" name="items" required="required" class="form-control col-md-7 col-xs-12">
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
  name: 'recipesForm',
  components: {
    TemplateDefault,
    LoagingBar,
    BoxContent,
  },
  data() {
    return {
      progress: false,
      name: '',
      items: [{ name: '' }],
      id: null,
      dataUser: {},
      militaryOrganizationsId: 0,
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
    this.militaryOrganizationsId = Authenticator.getDefaultUserOmId();
  },
  methods: {
    save(event) {
      event.preventDefault();
      // active progress bar
      this.progress = true;
      this.axios.post(`${baseUrl}recipespatterns`, {
        name: this.name,
        items: this.prepareItems(),
        militaryOrganizationsId: this.militaryOrganizationsId,
      })
        .then(() => {
          // deactivating progress bar
          this.progress = false;
          this.name = '';
          this.items = [{ name: '' }];
          this.dialog('Resgistro salvo com sucesso');
        })
        .catch((response) => {
          // deactivating progress bar
          this.progress = false;
          if (response.response && response.response.status === 404) {
            this.$router.push('/receitas');
          }
          error.dialog(this, response, schemaMessage);
        });
    },
    cancel(event) {
      event.preventDefault();
      this.$router.push('/receitas');
    },
    dialog(message) {
      const options = { size: 'sm' };
      this.$dialogs.alert(message, options);
    },
    addItem() {
      this.items.push({ name: '' });
    },
    removeItem(item, index) {
      if (this.items.length > 1) {
        this.items.splice(index, 1);
      }
    },
    prepareItems() {
      const itemsMap = new Map();
      const preparedMap = [];
      this.items.forEach((i) => {
        if (i.name.length) {
          itemsMap.set(i.name.toLowerCase(), i);
        }
      });
      itemsMap.forEach((item) => {
        preparedMap.push(item);
      });
      return preparedMap;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
