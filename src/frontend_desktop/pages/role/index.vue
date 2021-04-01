<template>
  <div >
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title style="display: flex; align-items: center;">
        <h2>แผนก</h2>
      </v-toolbar-title>
      <template v-slot:extension>
        <v-tabs v-model="tab" dark background-color="lightBrown">
          <v-tab><v-icon left>mdi-account</v-icon>แผนกทั้งหมด</v-tab>
          <v-tab> <v-icon left>mdi-account-plus</v-icon>สร้างแผนกใหม่</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-container>
      <v-tabs-items v-model="tab" v-if="!loading">
        <v-tab-item>
          <role-home
            :roles="roles"
            @changeTab="t=>tab=t"
            @deleteRole="role=>deleteRole(role)"
          />
        </v-tab-item>
        <v-tab-item>
          <!-- role main with all default props (every thing empty) -->
          <role-main ref="newRole">
            <template v-slot:header>
              <v-card-title style="justify-content: space-between">
                สร้างแผนกใหม่
                <div>
                  <v-btn color="error" outlined @click="tab=0">ยกเลิก</v-btn>
                  <v-btn color="success" @click="
                    $refs.newRole.saveChange(true);
                    tab=0;
                  ">สร้าง</v-btn>
                </div>
              </v-card-title>
            </template>
          </role-main>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </div>
</template>

<script>
import RoleHome from '~/components/employee/RoleHome.vue'
import EmployeeHome from '~/components/employee/EmployeeHome.vue'
import SlotHome from '~/components/slot/SlotHome.vue'
import { mapGetters } from 'vuex'
import RoleMain from '~/components/employee/RoleMain.vue'

export default {
  components: { RoleHome, EmployeeHome, SlotHome, RoleMain },
  data:()=>({
    tab:'',
    name: '',
    description: '',
    dialog: false,
    loading: true,
  }),
  computed:{
    ...mapGetters({
      roles: 'myrole/getRoles',
    }),
  },
  methods:{
    deleteRole(role){
      if(confirm(`ลบแผนก ${role.name}`)){
        this.$store.dispatch('myrole/deleteRole', role);
      }
    }
  },
  // created(){
  //   if(this.roles[0].id === 'fake') this.$store.dispatch('myrole/getAllRole', this.$cookies.get('token'));
  // }
   mounted(){
    this.$nextTick( async () => {
      this.$nuxt.$loading.start()
      await Promise.all([
        this.$store.dispatch('employee/getEmployees'),
        this.$store.dispatch('slot/getAllSlot'),
        this.$store.dispatch('myrole/getAllRole')
      ])
      this.loading = false;
      this.$nuxt.$loading.finish()
    })
  }
}
</script>
