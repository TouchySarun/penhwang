<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="ชื่อ/ แผนก/ ประเภท"
        single-line
        hide-details
      ></v-text-field>
      <v-select label="แผนก" v-model="role" outlined dense hide-details :items="roles"/>
      <v-select label="ประเภทเงินเดือน" v-model="type" outlined dense hide-details :items="types"/>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="filtered"
      :search="search"
      @click:row="row=>this.$router.push({ path: `/employee/${row.id}` })"
    >
      <template v-slot:item.inTime="{ item }">
        <v-chip color="#43A047" dark > {{ item.inTime }}</v-chip>
      </template>
      <template v-slot:item.late="{ item }">
        <v-chip color="#FFB300" dark >{{ item.late }}</v-chip>
      </template>
      <template v-slot:item.leave="{ item }">
        <v-chip color="#039BE5" dark>{{ item.leave }}</v-chip>
      </template>
      <template v-slot:item.miss="{ item }">
        <v-chip color="#E64A19" dark>{{ item.miss }}</v-chip>
      </template>
      <template v-slot:item.ot="{ item }">
        <v-chip color="light-green darken-1" dark>{{ item.ot }}</v-chip>
      </template>
      <template v-slot:item.avgWork="{ item }">
        <v-chip color="accent" dark>{{ toHour(item.avgWork) }}</v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
export default {
  props: ['items', 'roles', 'types'],
  data: ()=>({
    search: null,
    role:'',
    type:'',
    headers: [
      { text: 'รายชื่อพนักงาน',value: 'name'},
      { text: 'แผนก', value: 'role'},
      { text: 'ประเภทเงินเดือน', value: 'type'},
      { text: 'ตรงเวลา', value: 'inTime'},
      { text: 'สาย', value: 'late'},
      { text: 'ลา', value: 'leave'},
      { text: 'ขาด', value: 'miss'},
      { text: 'เวลาทำงานเฉลี่ย(ชม.)/วัน', value: 'avgWork'}
    ],
  }),
  computed:{
    filtered(){
      return this.items.filter(item =>
        (item.role && item.type)
        ? (item.role.includes(this.role) || this.role==='ทั้งหมด') && (item.type.includes(this.type) || this.type==='ทั้งหมด')
        : []
      )
    }
  },
  methods:{
    toHour(time){
      const h = parseInt(time);
      const m = parseInt((time - h)*60);
      return `${h}:${m}`
    }
  },
}
</script>
<style lang="scss" scope>
.v-select{
  margin: 1vw !important;
  max-width: 15vw;
}
</style>
