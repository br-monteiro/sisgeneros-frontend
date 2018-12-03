<template>
  <div class="form-group">
    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="input-id">
      {{label}}
      <span class="required" v-if="required">*</span>
    </label>
    <div class="col-md-6 col-sm-6 col-xs-12">
      <input
        type="text"
        id="input-id"
        required="required"
        class="form-control col-md-7 col-xs-12"
        v-if="required"
        v-bind:maxlength="maxlength"
        v-bind:disabled="readonly"
        v-bind:value="value"
        v-bind:placeholder="placeholder"
        v-on:input="updateValue($event.target.value)">

      <input
        type="text"
        id="input-id"
        class="form-control col-md-7 col-xs-12"
        v-if="!required"
        v-bind:maxlength="maxlength"
        v-bind:disabled="readonly"
        v-bind:value="value"
        v-bind:placeholder="placeholder"
        v-on:input="updateValue($event.target.value)">

        <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'input-text',
  props: [
    'label',
    'required',
    'placeholder',
    'value',
    'readonly',
    'maxlength',
  ],
  data() {
    return {};
  },
  methods: {
    updateValue(v) {
      this.$emit('input', v);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
