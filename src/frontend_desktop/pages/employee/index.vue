<template>
  <div v-if=!loading>
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title style="display: flex; align-items: center">
        <h2>พนักงาน</h2>
      </v-toolbar-title>
      <template v-slot:extension>
        <v-tabs v-model="tab" dark background-color="lightBrown">
          <v-tab><v-icon left>mdi-account</v-icon> พนักงานทั้งหมด</v-tab>
          <v-tab><v-icon left>mdi-account-plus</v-icon> คำขอพนักงานใหม่</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-container>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <employee-home
            :employees="employees"
            @changeTab="(i) => (tab = i)"
            @deleteEmployee="(emp) => deleteEmployee(emp)"
          />
        </v-tab-item>
        <v-tab-item>
          <v-container>
            <request :req="request" />
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </div>
</template>
<script>
import EmployeeHome from '~/components/employee/EmployeeHome.vue'
import { mapGetters } from 'vuex'
import Request from '~/components/dashboard/request.vue'

export default {
  middleware: 'auth',
  components: { EmployeeHome, Request },
  data: () => ({
    loading: true,
    tab: null,
  }),
  computed: {
    ...mapGetters({
      employees: 'employee/getEmployees',
      request: 'request/getJoinRequests',
      roles: 'myrole/getRolesName'
    }),
  },
  methods: {
    deleteEmployee(emp) {
      if (confirm(`ไล่พนักงาน ${emp.name} ออก`)) {
        this.$store.dispatch('employee/deleteEmployee', emp)
        // this.$router.push({ path: `/employee` });
      }
    },
  },
  mounted(){
    this.$nextTick( async () => {
      this.$nuxt.$loading.start()
      await Promise.all([
        this.$store.dispatch('employee/getEmployees'),
        this.$store.dispatch('request/getAllRequest'),
        this.$store.dispatch('myrole/getAllRole')
      ])
      this.loading = false;
      this.$nuxt.$loading.finish()
    })
  }
}
</script>
