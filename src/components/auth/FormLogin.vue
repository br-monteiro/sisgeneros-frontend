<template>
  <div>
    <loading-bar v-show="progress"></loading-bar>
    <div class="login_wrapper">
      <div class="animate form login_form">
        <section class="login_content">
          <form>
            <h1>Área de Login</h1>
            <div>
              <input type="text" class="form-control" v-model="username" placeholder="Usuário" required="" />
            </div>
            <div>
              <input type="password" class="form-control" v-model="password" placeholder="Senha" required="" />
            </div>
            <div>
              <a class="btn btn-success btn-lg" @click="login">
                <i class="fa fa-check-circle"></i> Entrar
              </a>
            </div>
            <div class="clearfix"></div>
            <div class="separator">
            </div>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import Configurations from '../../common/Configurations';
import Authenticator from '../../common/Authenticator';
import LoadingBar from '../layout/LoadingBar';

const baseUrl = Configurations.BASE_URL_PAI;

export default {
  name: 'form-login',
  components: {
    LoadingBar,
  },
  data() {
    return {
      progress: false,
      username: '',
      password: '',
    };
  },
  created() {
    if (Authenticator.isLoggedIn()) {
      this.$router.push('/');
    }
    $('body').addClass('login');
  },
  methods: {
    login() {
      if (!this.password && !this.username) {
        this.dialog('O campo Usuário e Senha deve ser preenchido.');
        return;
      }
      // active progress bar
      this.progress = true;

      this.axios.post(baseUrl.concat('auth'), {
        username: this.username,
        password: this.password,
      })
        .then((response) => {
          // register JWT for user
          Authenticator.registerUser(response);
          // deactivating progress bar
          this.progress = false;
          // remove login class
          $('body').removeClass('login');
          // redirect to home
          this.$router.push('/');
        })
        .catch((response) => {
          // deactivating progress bar
          this.progress = false;
          // dialog window
          if (response.response && response.response.status === 401) {
            this.dialog('Não foi possível autenticar o usuário. Verifique se digitou corretamente');
          } else {
            this.dialog('Houve um erro ao conectar com servidor...');
            console.error(response);
          }
        });
    },
    dialog(message) {
      const options = { title: 'Atenção', size: 'sm' };
      this.$dialogs.alert(message, options);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
