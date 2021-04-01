<template>
  <v-card class="mx-auto text-center" :color="color" dark style="width:100%">
    <v-card-title><v-icon v-if="icon" style="margin-right: 3px;">{{icon}}</v-icon>{{title}}</v-card-title>
    <v-card-text>
      <div class="display-1 font-weight-bold">
        {{text}}
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props:['color', 'title', 'text', 'icon']
}
</script>
