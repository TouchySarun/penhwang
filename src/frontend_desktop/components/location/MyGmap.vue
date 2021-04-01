<template>
  <div>
    <h3>ค้นหาในแผนที่</h3>
    <gmap-autocomplete
      v-show="editing"
      @place_changed="setPlace"
      style="
        border: solid 0.8px #6D4C4140;
        width: 100%;
        padding: 5px 10px 0px;
        margin-bottom: 10px;
        border-radius: 5px;
      "/>
    <gmap-map
      ref="mapRef"
      :center="center"
      :zoom="18"
      style="width: 100%; height: 70vh">
    <gmap-marker
      ref="marker"
      :position="JSON.parse(JSON.stringify(center))"
      :clickable="true"
      :draggable="editing"
      @drag="updatePlace"
    />
    </gmap-map>
  </div>
</template>

<script>
import {gmapApi} from '~/node_modules/vue2-google-maps/src/main'
export default {
  props:{
    center:{
      type: Object,
      default: ()=>({lat: 13.746774, lng: 100.5348332})
    },
    editing:{
      type: Boolean,
      default: true
    }
  },
  data:()=>({
    search: "",
    location:{
      lat: 13.746774,
      lng: 100.5348332,
    },
  }),
  computed:{
    google: gmapApi,
  },
  watch:{
    editing: function(){
      this.center.lat = this.location.lat;
      this.center.lng = this.location.lng;
    }
  },
  methods:{
    panTo(pos){
      this.$refs.mapRef.$mapPromise.then((map) => {map.panTo(pos)})
    },
    setPlace(place) {
      this.$refs.marker.position = place.geometry.location
      this.location = place.geometry.location
      this.panTo(place.geometry.location)
      this.$emit('update', place.geometry.location)
    },
    updatePlace(location) {
      this.location= {
        lat: location.latLng.lat(),
        lng: location.latLng.lng(),
      }
      this.$emit('update', location.latLng)
    },
    deleteLocation(i){
      if(confirm(`WORNING!! ${this.locations[i].name} will be delete.`)){
        this.locations.splice(i, 1);
      }
    },
    resetLocation(){
      if(confirm("WORNING!! Everything you have done will be delete.")){
        this.location = {
          name: "",
          i: 0,
          error: 0,
          marker: { lat: 0, lng: 0},
          location:{
            lat: 0.0,
            lng: 0.0,
          }
        }
      }
    }
  },
  created(){
    this.location = this.center
  }
}
</script>

<style>

</style>
