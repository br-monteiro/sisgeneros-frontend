<template>
  <div id="app" class="container body">
    <div class="main_container">
      <menu-right></menu-right>
      <top-navigation></top-navigation>
      <!-- page content -->
      <div class="right_col" role="main">
        <div>
          <div class="page-title">
            <div class="title_left">
              <h4>{{pgtitle}}</h4>
            </div>
            <div class="title_right">
              <div class="col-md-5 col-sm-5 col-xs-12 form-group pull-right top_search">
                <slot name="title-right"></slot>
              </div>
            </div>
          </div>
          <div class="clearfix"></div>
          <div class="row">
            <slot></slot>
          </div>
        </div>
      </div>
      <!-- /page content -->
      <footer-navigation></footer-navigation>
    </div>
  </div>
</template>

<script>
import MenuRight from './MenuRight';
import TopNavigation from './TopNavigation';
import FooterNavigation from './FooterNavigation';

export default {
  name: 'template-default',
  props: ['pgtitle'],
  components: {
    MenuRight,
    TopNavigation,
    FooterNavigation,
  },
  data() {
    return {};
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
