<template>
  <div>
    <template-default pgtitle="Receitas">
      <loaging-bar v-show="progress" />

      <box-content class="col-md-6 col-sm-12 col-xs-12" boxtitle="Formulário de receitas">
        <form id="demo-form2" class="form-horizontal form-label-left">
          <div class="form-group">
            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="name">
              Nome <span class="required">*</span>
            </label>
            <div class="col-md-6 col-sm-6 col-xs-12">
              <input type="text" id="name" v-model="name" required="required" class="form-control col-md-7 col-xs-12">
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

      <box-content class="col-md-6 col-sm-12 col-xs-12" boxtitle="Lista de Items">
        <table class="table">
          <thead>
            <tr>
              <th>Nome do Item</th>
              <th>Quantidade</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="result in results" v-bind:key="result.id">
              <td>{{result.name}}</td>
              <td>{{result.quantity}}</td>
              <td>
                <button class="btn btn-xs btn-info" @click="editItem(result.id)">
                  <i class="fa fa-edit"></i>
                </button>
                <button class="btn btn-xs btn-danger" @click="removeItem(result.id)">
                  <i class="fa fa-close"></i>
                </button>
              </td>
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
import schemaMessage from './schemaMessage';
import error from '../../common/DialogError';

const baseUrl = Configurations.BASE_URL_API;

export default {
  name: 'recipesItemsForm',
  components: {
    TemplateDefault,
    LoagingBar,
    BoxContent,
  },
  data() {
    return {
      progress: false,
      name: '',
      id: null,
      dataUser: {},
      militaryOrganizationsId: 0,
      results: [],
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

    // getting data
    this.axios.get(`${baseUrl}recipespatterns/${this.$route.params.id}`)
      .then((response) => {
        // deactivating progress bar
        this.progress = false;
        this.id = response.data.data.id;
        this.name = response.data.data.name;
        this.results = response.data.data.items;
      })
      .catch((response) => {
        // deactivating progress bar
        this.progress = false;
        if (response.response && response.response.status === 404) {
          this.$router.push('/receitas');
        }
        console.error(response);
      });
  },
  methods: {
    save(event) {
      event.preventDefault();
      // active progress bar
      this.progress = true;
      this.axios.put(`${baseUrl}recipespatterns/${this.$route.params.id}`, {
        name: this.name,
        militaryOrganizationsId: this.militaryOrganizationsId,
      })
        .then((response) => {
          // deactivating progress bar
          this.progress = false;
          this.name = response.data.data.name;
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
    removeItem(id) {
      if (this.results.length > 1) {
        // active progress bar
        this.progress = true;

        this.axios.delete(`${baseUrl}recipespatterns/recipe/item/${id}`)
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
      } else {
        this.dialog('Deve haver ao menos um item');
      }
    },
    editItem(id) {
      this.$router.push(`/receitas/edit/${this.$route.params.id}/${id}`);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
