<template lang="html">
  <div class="loading-page" v-if="loading">
    <!-- <p>Loading...</p> -->
 <v-progress-circular
      :size="70"
      :width="7"
      color="#FF9800"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<script>
  export default {
    data: () => ({
      loading: false
    }),
    methods: {
      start() {
        this.loading = true
      },
      finish() {
        this.loading = false
      }
    }
  }
</script>

<style scoped>
  .loading-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255, 255, 255, 0.8);
    text-align: center;
    padding-top: 200px;
    font-size: 30px;
    font-family: sans-serif;
  }
  .v-progress-circular {
  margin: 1rem;
}
</style>
