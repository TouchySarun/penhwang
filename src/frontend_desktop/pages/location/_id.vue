<template>
  <div v-if="!loading">
    <location-main :locationDetail="locationDetail"/>
    <v-btn
      @click="deleteLo(loGetter($route.params.id));"
      color="error"
      outlined
      block
    >ลบจุดลงเวลา</v-btn>
  </div>
</template>
<script>
import LocationMain from '~/components/location/LocationMain.vue'
import { mapGetters } from 'vuex'

export default {
  components: { LocationMain },
  data:()=>({
    locationDetail: undefined,
    loading: true,
  }),
  computed:{
    ...mapGetters({
      loGetter: 'location/getLocationById',
      employeeGetter: 'employee/getEmployeeById'
    })
  },
  methods:{
    deleteLo(lo){
      if(confirm(`ลบ ${lo.name}`)){
        this.$store.dispatch('location/deleteLocation', lo);
        this.$router.push({ path: `/location` });
      }
    }
  },
  mounted(){
    this.$nextTick( async () => {
      this.$nuxt.$loading.start()
      await Promise.all([
        this.$store.dispatch('employee/getEmployees'),
        this.$store.dispatch('location/getAllLocation')
      ])
        this.locationDetail = JSON.parse(JSON.stringify(this.loGetter(this.$route.params.id)))
      this.loading = false;
      this.$nuxt.$loading.finish()
    })
  }
  // async created(){
  //   const token = this.$cookies.get('token');
  //   if(this.employeeGetter('fake'))
  //     await this.$store.dispatch('employee/getEmployees', token);
  //   if(this.loGetter('fake')){
  //     await this.$store.dispatch('location/getAllLocation', token)
  //     .then( success => {
  //       this.locationDetail = this.loGetter(this.$route.params.id);
  //       return this.locationDetail;
  //     })
  //     .catch( err => console.log(err))
  //   }else{
  //     this.locationDetail = this.loGetter(this.$route.params.id);
  //   }
  // },
}
</script>
