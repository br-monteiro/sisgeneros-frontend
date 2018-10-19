<template>
    <div class="btn-group" v-if="total > maxPerPage">
      <a v-bind:href="`${url}?page=1`" class="btn btn-default">Primeira</a>
      <a v-bind:href="`${url}?page=${((current - 1) || 1)}`" class="btn btn-default">Anterior</a>
      <a v-bind:href="`${url}?page=${n}`" class="btn btn-default" v-for="n in pages" v-bind:key="n" v-bind:class="{ active: n === current}">{{n}}</a>
      <a v-bind:href="`${url}?page=${(current < lastPage) ? (current + 1) : lastPage}`" class="btn btn-default">Próxima</a>
      <a v-bind:href="`${url}?page=${lastPage}`" class="btn btn-default">Última</a>
    </div>
</template>

<script>
export default {
  name: 'navigation-buttons',
  props: ['url', 'total', 'current'],
  data() {
    return {
      pages: [],
      rawPages: [],
      maxPerPage: 50,
      maxButtons: 10,
      lastPage: 1,
    };
  },
  watch: {
    total(value) {
      const totalNumbers = Math.floor(value / this.maxPerPage);
      const range = this.range(totalNumbers, 1);
      const chunk = this.chunk(range, this.maxButtons);
      this.lastPage = range.length;
      this.pages = chunk.length ? chunk[0] : [];
      this.rawPages = chunk;
    },
    current(value) {
      if (this.pages.find(el => el === value) === undefined) {
        this.pages = this
          .rawPages
          .filter(group => group.find(number => number === value))[0];
      }
    },
  },
  methods: {
    range: (size, startAt = 0) => [...Array(size).keys()].map(i => i + startAt),
    chunk(arr, size) {
      const groups = [];
      for (let i = 0; i < arr.length; i += size) {
        groups.push(arr.slice(i, (i + size)));
      }
      return groups;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
