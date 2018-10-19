<template>
  <div>
    <div class="x_panel">
      <div class="x_title">
        <h2>{{boxtitle}}</h2>
        <div class="clearfix"></div>
      </div>
      <div class="x_content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'box-content',
  props: ['boxclass', 'boxtitle'],
  data() {
    return {};
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
