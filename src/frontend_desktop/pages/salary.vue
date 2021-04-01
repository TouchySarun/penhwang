<template>
  <div>
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title><h2>เงินเดือน</h2></v-toolbar-title>
      <template v-slot:extension>
        <v-tabs v-model="tab">
          <v-tab><v-icon left> mdi-calendar-clock</v-icon>สรุปเข้า-ออกงาน</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-container>

    <v-tabs-items v-model="tab" v-show="!loading">
      <br>
      <v-tab-item>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="date"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="formatedDate"
              label="ประจำเดือน"
              append-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              dense
              outlined
              hide-details
              color="primary"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            type="month"
            no-title
            scrollable
          >
            <v-btn
              text color="error"
              @click="menu = false"
            >
              ยกเลิก
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              dark color="success"
              @click="$refs.menu.save(date);getAttendance();"
            >
              เริ่มคำนวณ
            </v-btn>
          </v-date-picker>
        </v-menu>
        <attendance-table :items="attendance" :roles="roles" :types="types" />
      </v-tab-item>
    </v-tabs-items>
    </v-container>
  </div>
</template>

<script>
import attendanceTable from '~/components/salary/attendanceTable.vue'
import { mapGetters, mapState } from 'vuex'

export default {
components: { attendanceTable },
  data: () => ({
    CalculatedTableitems: ['สรุปเข้า-ออกงาน', 'คำนวณเงินเดือน'],
    tab: null,
    date: '',
    menu: null,
    search: '',
    loading: true,
  }),
  computed:{
    ...mapState('employee',['attendance']),
    ...mapGetters({
      types: 'employee/getTypes',
      roles: 'myrole/getRolesName'
    }),
    formatedDate(){
      const strArray=['xxx','ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ค.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
      if(this.date !== null){
        const da = this.date.split('-');
        return strArray[parseInt(da[1], 10)]+" "+da[0];
      }else{
        return this.date;
      }
    }
  },
  methods:{
    getAttendance(){
      if(this.date !== null){
        this.$nextTick( async () => {
          this.loading = true;
          this.$nuxt.$loading.start();
          await this.$store.dispatch('employee/getAttendance',{date: this.date});
          this.loading = false;
          this.$nuxt.$loading.finish();
        })
      }
    },
    myDate(d){
      var x = '';
      ((d.getMonth()+1) < 10)
        ? x = d.getFullYear()+"-0"+(d.getMonth()+1)
        : x = d.getFullYear()+"-"+(d.getMonth()+1)
        return x;
    }
  },
  // created(){
  //   this.getAttendance({});
  //   this.date = this.myDate(new Date());
  // }
  mounted(){
    this.$nextTick( async () => {
      this.$nuxt.$loading.start();
      this.date = this.myDate(new Date());
      await Promise.all([
        this.$store.dispatch('myrole/getAllRole'),
        this.$store.dispatch('employee/getEmployees'),
      ])
      await this.getAttendance()
      this.loading = false;
      this.$nuxt.$loading.finish()
    })
  }
}
</script>
