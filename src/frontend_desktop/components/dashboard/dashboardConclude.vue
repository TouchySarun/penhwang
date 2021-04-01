<template>
  <v-row>
    <v-col cols="2">
      <v-btn @click="$emit('click', 'active'); now='active'" :elevation="(now==='active')?10:1">
        <dashboard-card color="#D81B60" title="ทำงานอยู่" :text="conclude.inTime + conclude.late - conclude.out" icon="mdi-star-circle" />
      </v-btn>
    </v-col>
    <v-col cols="2">
      <v-btn @click="$emit('click', 'inTime'); now='inTime'" :elevation="(now==='inTime')?10:1">
        <dashboard-card color="success" title="เข้างาน" :text="conclude.inTime" icon="mdi-emoticon-happy" />
      </v-btn>
    </v-col>
    <v-col cols="2">
      <v-btn @click="$emit('click', 'late'); now='late'" :elevation="(now==='late')?10:1">
        <dashboard-card color="warning" title="สาย" :text="conclude.late" icon="mdi-emoticon-sad" />
      </v-btn>
    </v-col>
    <v-col cols="2">
      <v-btn @click="$emit('click', 'leave'); now='leave'" :elevation="(now==='leave')?10:1">
        <dashboard-card color="info" title="ลา" :text="conclude.leave" icon="mdi-emoticon-tongue" />
      </v-btn>
    </v-col>
    <v-col cols="2">
      <v-btn @click="$emit('click', 'out'); now='out'" :elevation="(now==='out')?10:1">
        <dashboard-card color="purple" title="ออกงาน" :text="conclude.out" icon="mdi-emoticon-cool" />
      </v-btn>
    </v-col>
  </v-row>
</template>
<script>
export default {
  props:{
    conclude: {
      type: Object,
      default: ()=>({
        inTime: 0,
        late: 0,
        leave: 0,
        out: 0
      })
    },
  },
  data:()=>({
    now: 'active',
  })
}
</script>
<style scoped>
.col{
  min-width: 155px;
}
.v-btn{
  height: fit-content !important;
  padding: 0 !important;
  width: 100% !important;
}
</style>
