<template>
  <div>
    <input-text
      v-model="value"
      v-bind:label="label"
      v-bind:value="value"
      v-bind:placeholder="placeholder">
      <ul class="list-group list" v-bind:style="css">
        <li class="list-group-item list-group-item-danger" v-if="noResults">Sem resultados</li>
        <li class="list-group-item item" v-for="result in results" v-bind:key="result.id" @click="selectElement(result, $event)">{{getView(result)}}</li>
      </ul>
    </input-text>
  </div>
</template>

<script>
import InputText from './InputText';
import Configurations from '../../common/Configurations';
import Authenticator from '../../common/Authenticator';

export default {
  name: 'input-autocomplete',
  props: [
    'label',
    'required',
    'placeholder',
    'url',
    'usefullpath',
    'pathtoview',
    'cbselect',
    'css',
    'auth',
  ],
  data() {
    return {
      baseUrl: Configurations.BASE_URL_API,
      noResults: false,
      results: [],
      value: '',
    };
  },
  components: {
    InputText,
  },
  created() {
    if (this.usefullpath) {
      this.baseUrl = '';
    }
    if (this.auth) {
      // setting Authorization header
      this.axios.defaults.headers.common.Authorization = `Bearer ${Authenticator.getDataUser().token}`;
    }
  },
  methods: {
    getView(el) {
      return (el && el[this.pathtoview]) || '';
    },
    selectElement(el, event) {
      if (el && typeof this.cbselect === 'function') {
        const cb = this.cbselect;
        cb(el, event);
        this.clear();
      }
    },
    search(v) {
      this.axios.get(`${this.baseUrl}${this.url}?limit=50&query=${v}`)
        .then((response) => {
          if (response.data.data.length) {
            this.noResults = false;
            this.results = response.data.data;
          } else {
            this.timeoutNoResults();
          }
        })
        .catch(() => {
          this.timeoutNoResults();
        });
    },
    clear() {
      this.results = [];
    },
    timeoutNoResults() {
      this.results = [];
      this.noResults = true;
      setTimeout(() => {
        this.noResults = false;
      }, 4000);
    },
  },
  watch: {
    value(v) {
      if (v && v.length > 3) {
        this.search(v);
      } else {
        this.clear();
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list {
  width: inherit;
  margin-top: 40px;
  position: absolute;
  z-index: 999;
}
.item {
  cursor: pointer;
}
.item:hover {
  background-color: #73879C;
  color: #fff;
}
</style>
