<template>
    <!-- top navigation -->
    <div class="top_nav">
        <div class="nav_menu">
            <nav>
                <div class="nav toggle">
                    <a id="menu_toggle"><i class="fa fa-bars"></i></a>
                </div>

                <ul class="nav navbar-nav navbar-right">
                    <li class="">
                        <a class="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                            <i class="fa fa-user"></i> {{dataUser.userName}}
                            <span class=" fa fa-angle-down"></span>
                        </a>
                        <ul class="dropdown-menu dropdown-usermenu pull-right">
                            <li>
                                <a>
                                    <span class="badge pull-right">
                                        {{userProfile.profile | translate}}
                                    </span>
                                    {{userProfile.militaryOrganizationNavalIndicative}}
                                </a>
                            </li>
                            <li>
                                <a @click="goTo(`/usuarios/edit/${dataUser.userId}`)">
                                    <span>Configurações</span>
                                </a>
                            </li>
                            <li>
                                <a @click="logout">
                                    <i class="fa fa-sign-out pull-right"></i> Sair
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
    <!-- /top navigation -->
</template>

<script>
import Authenticator from '../../common/Authenticator';
import Configurations from '../../common/Configurations';

export default {
  name: 'top-navigation',
  data() {
    return {
      dataUser: Authenticator.getDataUser(),
      url: Configurations.BASE_URL_APP,
      userProfile: Authenticator.getUserProfile(),
      class: '',
    };
  },
  methods: {
    logout() {
      Authenticator.removeUser();
      this.goTo('/login');
    },
    goTo(url) {
      this.$router.push(url);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
