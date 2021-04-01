<template>
  <div >
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title><h2>ประเภทการลา</h2></v-toolbar-title>
      <template v-slot:extension>
        <v-tabs v-model="tab" dark background-color="lightBrown">
          <v-tab><v-icon left>mdi-file</v-icon>ประเภทการลาทั้งหมด</v-tab>
          <v-tab><v-icon left>mdi-file-plus</v-icon>สร้างประเภทใหม่ </v-tab></v-tabs>
      </template>
    </v-toolbar>
    <v-container>
      <v-tabs-items v-model="tab" v-if="!loading">
        <v-tab-item>
          <leave-home
            :leaves="leaves"
            @changeTab="t=>tab=t"
            @deleteLeave="l=>(deleteLeave(l))"/>
        </v-tab-item>
        <v-tab-item>
          <leave-main ref="leave">
            <template v-slot:header>
              <v-card-title style="justify-content: space-between">
                สร้างประเภทใหม่
                <div>
                  <v-btn color="error" outlined @click="tab=0">ยกเลิก</v-btn>
                  <v-btn color="success" @click="$refs.leave.saveChange(true); tab=0;">สร้าง</v-btn>
                </div>
              </v-card-title>
            </template>
          </leave-main>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </div>
</template>

<script>
import LeaveHome from '~/components/leave/LeaveHome.vue';
import LeaveMain from '~/components/leave/LeaveMain.vue';
import { mapGetters } from 'vuex';

export default {
  components: { LeaveHome, LeaveMain },
  data: ()=>({
    tab: 0,
    loading: true,
  }),
  computed:{
    ...mapGetters({
      leaves: 'leave/getLeaves',
    })
  },
  methods:{
    deleteLeave(l){
      if(confirm(`ลบ${l.name}`)){
        this.$store.dispatch('leave/deleteLeave', l);
      }
    }
  },
  // created(){
  //   if(this.leaves[0].id === 'fake') this.$store.dispatch('leave/getAllLeave', this.$cookies.get('token'));
  // }
  mounted(){
    this.$nextTick( async () => {
      this.$nuxt.$loading.start()
      await Promise.all([
        this.$store.dispatch('leave/getAllLeave'),
        this.$store.dispatch('employee/getEmployees')
      ])
      this.loading = false;
      this.$nuxt.$loading.finish()
    })
  }
}
</script>

