<template>
  <v-container v-if="!loading">
    <role-main :roleDetail="roleDetail"/>
    <v-btn
      @click="deleteRole(roleGetter($route.params.id));"
      color="error"
      outlined
      block
    >ลบแผนก</v-btn>
  </v-container>
</template>
<script>
import RoleMain from '~/components/employee/RoleMain.vue';
import { mapGetters } from 'vuex'

export default {
  components: { RoleMain },
  data:() => ({
    roleDetail: undefined,
    loading: true,
  }),
  computed:{
    ...mapGetters({
      roleGetter: 'myrole/getRoleById',
      employeeGetter: 'employee/getEmployeeById',
      slotGetter: 'slot/getSlotById'
    }),
  },
  methods:{
    deleteRole(role){
      if(confirm(`ลบแผนก ${role.name}`)){
        this.$store.dispatch('myrole/deleteRole', role);
        this.$router.push({ path: `/role` });
      }
    }
  },
  mounted(){
    this.$nextTick( async () => {
      this.$nuxt.$loading.start()
      await Promise.all([
        this.$store.dispatch('employee/getEmployees'),
        this.$store.dispatch('slot/getAllSlot'),
        this.$store.dispatch('myrole/getAllRole')
      ])
        this.roleDetail = JSON.parse(JSON.stringify(this.roleGetter(this.$route.params.id)))
      this.loading = false;
      this.$nuxt.$loading.finish()
    })
  }
  // async created(){
  //   const token = this.$cookies.get('token');
  //   if(this.employeeGetter('fake'))
  //     await this.$store.dispatch('employee/getEmployees', token);
  //   if(this.slotGetter('fake'))
  //     await this.$store.dispatch('slot/getAllSlot', token);
  //   if(this.roleGetter('fake')){
  //     await this.$store.dispatch('myrole/getAllRole', token)
  //     .then( success => {
  //       this.roleDetail = this.roleGetter(this.$route.params.id);
  //       return this.roleDetail;
  //     })
  //     .catch( err => console.log(err))
  //   }else{
  //     this.roleDetail = this.roleGetter(this.$route.params.id);
  //   }
  // }
}
</script>
