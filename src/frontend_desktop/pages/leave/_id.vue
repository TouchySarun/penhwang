<template>
<div v-if="!loading">
  <leave-main :leaveDetail="leaveDetail"/>
  <v-btn
    @click="deleteLeave(leaveGetter($route.params.id));"
    color="error"
    outlined
    block
  >ลบประเภท</v-btn>
</div>

</template>
<script>
import LeaveMain from '~/components/leave/LeaveMain.vue'
import { mapGetters } from 'vuex';

export default {
  components: { LeaveMain },
  data:()=>({
    leaveDetail: undefined,
    loading: true,
  }),
  computed:{
    ...mapGetters({
      leaveGetter: 'leave/getLeaveById',
      employeeGetter: 'employee/getEmployeeById',
    })
  },
  methods:{
    deleteLeave(leave){
      if(confirm(`ลบ ${leave.name}`)){
        this.$store.dispatch('leave/deleteLeave', leave);
        this.$router.push({path: '/leave'});
      }
    }
  },
  mounted(){
    this.$nextTick( async () => {
      this.$nuxt.$loading.start()
      await Promise.all([
        this.$store.dispatch('employee/getEmployees'),
        this.$store.dispatch('leave/getAllLeave')
      ])
        this.leaveDetail = JSON.parse(JSON.stringify(this.leaveGetter(this.$route.params.id)));
      this.loading = false;
      this.$nuxt.$loading.finish()
    })
  }
  // async created(){
  //   const token = this.$cookies.get('token');
  //   if(this.employeeGetter('fake'))
  //     await this.$store.dispatch('employee/getEmployees', token);
  //   if(this.leaveGetter('fake')){
  //     await this.$store.dispatch('leave/getAllLeave', token)
  //     .then( success => {
  //       this.leaveDetail = this.leaveGetter(this.$route.params.id);
  //       return this.leaveDetail;
  //     })
  //     .catch( err => console.log(err))
  //   }else{
  //     this.leaveDetail = this.leaveGetter(this.$route.params.id);
  //   }
  // }

}
</script>
