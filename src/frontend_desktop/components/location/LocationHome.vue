<template>
  <v-card>
    <slot name="header">
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="ชื่อจุดลงเวลา"
          single-line
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark @click="$emit('changeTab', 1)">
          <v-icon style="margin-right: 10px;">mdi-map-marker-plus</v-icon>
          สร้างจุดลงเวลาใหม่
        </v-btn>
      </v-card-title>
    </slot>
    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="(l,i) in locations"
          :key="i"
          style="width: 40vw; border:solid 0.8px #6D4C4140;"
          v-show="l.name.includes(search)">
          <v-expansion-panel-header disable-icon-rotate>
            <nuxt-link :to="`/location/${l.id}`">
              <div style="display: flex">
                <v-icon color="error" x-large>mdi-map-marker</v-icon>
                <h3 style="margin: 0% 2.5%">
                  {{l.name}}
                </h3>
              </div>
            </nuxt-link>
            <template v-slot:actions>
              <v-btn icon>
                <v-icon color="info">mdi-chevron-down</v-icon>
              </v-btn>
              <v-btn icon @click="$emit('deleteLocation', l)">
                <v-icon color="error">
                  mdi-delete-forever
                </v-icon>
              </v-btn>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="location-num">
            <v-row no-gutters>
              <v-col cols="4" style="min-width: 150px;"><v-icon color="cyan lighten-1">mdi-border-horizontal</v-icon>latitude: {{l.lat}}</v-col>
              <v-col cols="4" style="min-width: 150px;"><v-icon color="cyan lighten-1">mdi-border-vertical</v-icon>longitude: {{l.lng}}</v-col>
              <v-col cols="4" style="min-width: 150px;"><v-icon color="warning">mdi-ruler</v-icon>ระยะห่าง: {{l.error}}</v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props:['locations'],
  data:()=>({
    search:"",
  }),
}
</script>
<style lang="scss" scoped>
.location-num{
  padding: 0px 10px !important;
  i{
    margin-right: 2%;
  }
  p{
    color: #607D8B;
    padding: 0 !important;
    margin: 20px 10px 0px 10px !important;
  }
}
a {  text-decoration: none;}
</style>
