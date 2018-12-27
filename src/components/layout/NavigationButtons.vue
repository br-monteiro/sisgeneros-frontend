<template>
    <div class="btn-group" v-if="total > maxPerPage">
      <a @click="clickCallback(1)" class="btn btn-default">Primeira</a>
      <a @click="clickCallback(previous)" class="btn btn-default">Anterior</a>
      <a @click="clickCallback(n)" class="btn btn-default" v-for="n in pages" v-bind:key="n" v-bind:class="{ active: n === current}">{{n}}</a>
      <a @click="clickCallback(next)" class="btn btn-default">Próxima</a>
      <a @click="clickCallback(lastPage)" class="btn btn-default">Última</a>
    </div>
</template>

<script>
export default {
  name: 'navigation-buttons',
  props: ['total', 'current', 'per-page', 'click-handler'],
  data() {
    return {
      pages: [],
      rawPages: [],
      maxPerPage: 50,
      maxButtons: 10,
      previous: 1,
      next: 1,
      lastPage: 1,
    };
  },
  created() {
    if (this.perPage) {
      this.maxPerPage = parseInt(this.perPage, 10) || this.maxPerPage;
    }
  },
  watch: {
    total(value) {
      const totalNumbers = Math.ceil(value / this.maxPerPage);
      const range = this.range(totalNumbers, 1);
      const chunk = this.chunk(range, this.maxButtons);
      this.lastPage = range.length;
      this.pages = chunk.length ? chunk[0] : [];
      this.rawPages = chunk;
      this.buildNext(this.current);
    },
    current(value) {
      if (this.pages.find(el => el === value) === undefined) {
        this.pages = this
          .rawPages
          .filter(group => group.find(number => number === value))[0];
      }
      this.buildPrevious(value);
      this.buildNext(value);
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
    clickCallback(currentNumber) {
      if (typeof this.clickHandler === 'function') {
        const cb = this.clickHandler;
        cb(currentNumber);
      }
    },
    buildNext(value) {
      this.next = (value < this.lastPage) ? (value + 1) : this.lastPage;
    },
    buildPrevious(value) {
      this.previous = ((value - 1) || 1);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
