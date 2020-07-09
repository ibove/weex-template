<template>
  <web class="chart-scroller" :src="boardUrl"></web>
</template>

<script>

export default {
  name: 'page',
  data () {
    return {
      // boardUrl: 'http://192.168.101.37/iso-Kanban/index.html'
      boardUrl: 'http://192.168.31.240:3000/'
    }
  }
}
</script>

<style scoped>
  .chart-scroller {
    position: absolute;   
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

  }
</style>
