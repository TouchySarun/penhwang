<template>
  <v-alert
    border="left"
    :color="color"
    dark
    :outlined="outlined"
  >
    <div style="display:flex; align-items: center">
    <v-icon :color="outlined?color:'white'" style="font-size: 100px; margin: 0% 5% 0% 2.5%">{{icon}}</v-icon>
    <div>
    <h2>{{header}}
      <span v-if="highlight" class="highlight">
        {{highlight}}
      </span>
    </h2>
    <br v-if="text">
    <p v-if="text">{{text}}</p>
    </div>
    <v-spacer></v-spacer>
    <h1 v-if="num">{{num}}</h1>
    </div>
  </v-alert>
</template>
<script>
export default {
  props:['header', 'highlight', 'text', 'icon', 'color', 'outlined', 'num']
}
</script>
<style lang="scss" scoped>
.highlight {
  background-color: #F9FBE740;
  border-radius: 5px;
  text-decoration: underline;
  padding: 0px 10px;
}
</style>
