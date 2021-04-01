<template>
  <div v-if="!loading">
    <slot-main :slotDetail="slotDetail"/>
    <v-btn
      @click="deleteSlot(slotGetter($route.params.id));"
      color="error"
      outlined
      block
    >ลบตาราง</v-btn>
  </div>
</template>
<script>
import SlotMain from '~/components/slot/SlotMain.vue';
import { mapGetters } from 'vuex';
import loadingVue from '~/components/loading.vue';

export default {
  components: { SlotMain },
  data:()=>({
    slotDetail: undefined,
    loading: true,
  }),
  computed:{
    ...mapGetters({
      slotGetter: 'slot/getSlotById',
      employeeGetter: 'employee/getEmployeeById'
    }),
  },
  methods:{
    deleteSlot(slot){
      if(confirm(`ลบ ${slot.name}`)){
        slot.token = this.$cookies.get('token');
        this.$store.dispatch('slot/deleteSlot', slot);
        this.$router.push({ path: `/slot` });
      }
    }
  },
  mounted(){
    this.$nextTick( async () => {
      this.$nuxt.$loading.start()
      await Promise.all([
        this.$store.dispatch('employee/getEmployees'),
        this.$store.dispatch('slot/getAllSlot')
      ])
        this.slotDetail = JSON.parse(JSON.stringify(this.slotGetter(this.$route.params.id)))
      this.loading = false;
      this.$nuxt.$loading.finish()
    })
  }
  // async created(){
  //   const token = this.$cookies.get('token');
  //   if(this.employeeGetter('fake'))
  //     await this.$store.dispatch('employee/getEmployees', token);
  //   if(this.slotGetter('fake')){
  //     await this.$store.dispatch('slot/getAllSlot', token)
  //     .then( success => {
  //       this.slotDetail = this.slotGetter(this.$route.params.id);
  //       return this.slotDetail;
  //     })
  //     .catch( err => console.log(err))
  //   }else{
  //     this.slotDetail = this.slotGetter(this.$route.params.id);
  //   }
  // }
}
</script>

