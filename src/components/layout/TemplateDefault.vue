<template>
  <div id="app" class="container body">
    <div class="main_container">
      <menu-right></menu-right>
      <top-navigation></top-navigation>
      <slot></slot>
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
