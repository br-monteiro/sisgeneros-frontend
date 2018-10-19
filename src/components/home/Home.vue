<template>
  <div>
    <template-default pgtitle="Home">
      <loaging-bar v-show="progress"></loaging-bar>
      <box-content class="col-md-6 col-sm-12 col-xs-12" boxtitle="esse é o primeiro 1">
        tetstet <br>tetstet <br>tetstet <br>tetstet <br>tetstet <br>tetstet <br>tetstet <br>
      </box-content>
      <box-content class="col-md-6 col-sm-12 col-xs-12" boxtitle="esse é o primeiro 2">
        tetstet <br>tetstet <br>tetstet <br>tetstet <br>tetstet <br>tetstet <br>tetstet <br>
      </box-content>
            <box-content class="col-md-6 col-sm-12 col-xs-12" boxtitle="esse é o primeiro 3">
        tetstet <br>tetstet <br>tetstet <br>tetstet <br>tetstet <br>tetstet <br>tetstet <br>
      </box-content>
      <box-content class="col-md-6 col-sm-12 col-xs-12" boxtitle="esse é o primeiro 4">
        tetstet <br>tetstet <br>tetstet <br>tetstet <br>tetstet <br>tetstet <br>tetstet <br>
      </box-content>
            <box-content class="col-md-6 col-sm-12 col-xs-12" boxtitle="esse é o primeiro 5">
        tetstet <br>tetstet <br>tetstet <br>tetstet <br>tetstet <br>tetstet <br>tetstet <br>
      </box-content>
      <box-content class="col-md-6 col-sm-12 col-xs-12" boxtitle="esse é o primeiro 6">
        tetstet <br>tetstet <br>tetstet <br>tetstet <br>tetstet <br>tetstet <br>tetstet <br>
      </box-content>
    </template-default>
  </div>
</template>

<script>
import TemplateDefault from '../layout/TemplateDefault';
import Authenticator from '../../common/Authenticator';
import LoagingBar from '../layout/LoadingBar';
import BoxContent from '../layout/BoxContent';

export default {
  name: 'home',
  components: {
    TemplateDefault,
    LoagingBar,
    BoxContent,
  },
  created() {
    if (!Authenticator.isLoggedIn()) {
      this.$router.push('/login');
    }
  },
  data() {
    return {
      progress: false,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
