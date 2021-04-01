<template>
  <div>
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title style="display: flex; align-items: flex-end;">
        <h2>ตารางเวลาทำงาน</h2>
        <p style="margin: 5px 10px 0px 10px;">(กะ)</p>
      </v-toolbar-title>
      <template v-slot:extension>
        <v-tabs v-model="tab" dark background-color="lightBrown">
          <v-tab><v-icon left>mdi-calendar</v-icon> ตารางทั้งหมด</v-tab>
          <v-tab><v-icon left>mdi-calendar-plus</v-icon> สร้างตารางใหม่</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-container>
      <v-tabs-items v-model="tab" v-if="!loading">
        <v-tab-item>
          <slot-home
            :slots="slots"
            @changeTab="t=>tab=t"
            @deleteSlot="s=>deleteSlot(s)"
          />
        </v-tab-item>
        <v-tab-item>
          <slot-main ref="slot">
            <template v-slot:header>
              <v-card-title style="justify-content: space-between">
                สร้างตารางใหม่
                <div>
                  <v-btn color="error" outlined @click="tab=0;">ยกเลิก</v-btn>
                  <v-btn color="success" @click="$refs.slot.saveChange(true); tab=0;">สร้าง</v-btn>
                </div>
              </v-card-title>
            </template>
          </slot-main>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </div>
</template>

<script>
import SlotHome from '~/components/slot/SlotHome.vue';
import SlotMain from '~/components/slot/SlotMain.vue';
import { mapGetters } from 'vuex'

export default {
  middleware: 'auth',
  components: { SlotMain, SlotHome },
  data: ()=>({
    tab:0,
    loading: true,
  }),
  computed:{
    ...mapGetters({
      slots: 'slot/getSlots',
    }),
  },
  methods:{
    deleteSlot(slot){
      if(confirm(`ลบ ${slot.name}`)){
        slot.token = this.$cookies.get('token');
        this.$store.dispatch('slot/deleteSlot', slot);
      }
    },
  },
  // created() {
  //   if(this.slots[0].id === 'fake') {
  //     this.$store.dispatch('slot/getAllSlot', this.$cookies.get('token'));
  //   }
  // },
  mounted(){
    this.$nextTick( async () => {
      this.$nuxt.$loading.start()
      await Promise.all([
        this.$store.dispatch('slot/getAllSlot'),
        this.$store.dispatch('employee/getEmployees')
      ])
      this.loading = false;
      this.$nuxt.$loading.finish()
    })
  }
}
</script>

