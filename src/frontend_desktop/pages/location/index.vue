<template>
  <div >
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title><h2>จุดลงเวลา</h2></v-toolbar-title>
      <template v-slot:extension>
        <v-tabs v-model="tab" dark background-color="lightBrown">
          <v-tab><v-icon left>mdi-map-marker</v-icon>จุดลงเวลาทั้งหมด</v-tab>
          <v-tab><v-icon left> mdi-map-marker-plus</v-icon>สร้างจุดลงเวลาใหม่</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-container>
      <v-tabs-items v-model="tab" v-if="!loading">
        <v-tab-item>
          <location-home
            :locations="locations"
            @changeTab="t=>tab=t"
            @deleteLocation="l=>(deleteLocation(l))"
          />
        </v-tab-item>
        <v-tab-item>
          <location-main ref="location">
            <template v-slot:header>
              <v-card-title style="justify-content: space-between">
                สร้างจุดลงเวลาใหม่
                <div>
                  <v-btn color="error" outlined @click="tab=0">ยกเลิก</v-btn>
                  <v-btn color="success" @click="$refs.location.saveChange(true); tab=0;">สร้าง</v-btn>
                </div>
              </v-card-title>
            </template>
          </location-main>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </div>
</template>
<script>
import LocationHome from '~/components/location/LocationHome.vue'
import LocationMain from '~/components/location/LocationMain.vue'
import { mapGetters } from 'vuex'

export default {
  components: { LocationHome, LocationMain },
  data:()=>({
    tab:null,
    loading: true,
  }),
  computed:{
    ...mapGetters({
      locations: 'location/getLocations',
    })
  },
  methods:{
    deleteLocation(lo){
      if(confirm(`ลบ ${lo.name}`)){
        lo.token = this.$cookies.get('token');
        this.$store.dispatch('location/deleteLocation', lo);
      }
    },
  },
  // created() {
  //   if(this.locations[0].id === 'fake') {
  //     this.$store.dispatch('location/getAllLocation', this.$cookies.get('token'));
  //   }
  // },
   mounted(){
    this.$nextTick( async () => {
      this.$nuxt.$loading.start()
      await Promise.all([
        this.$store.dispatch('location/getAllLocation'),
        this.$store.dispatch('employee/getEmployees')
      ])
      this.loading = false;
      this.$nuxt.$loading.finish()
    })
  }
}
</script>
