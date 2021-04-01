<template>
  <v-card-title class="font-weight-bold">
    <v-row>
      <v-col cols="6" style="margin-left: 5%">
        <v-avatar color="teal" size="30" style="margin-right: 5px">
          <span class="white--text headline">{{ number }}</span>
        </v-avatar>
        {{ text }}
      </v-col>
      <v-col cols="auto">
        <img
          :src="picture"
          :style="
            isHorizontal
              ? `width: 25vw; height: 20vh`
              : `width:20vw; height: 35vh`
          "
        />
      </v-col>
    </v-row>
  </v-card-title>
</template>

<script>
export default {
  props: ['number', 'text', 'picture', 'isHorizontal'],
}
</script>
