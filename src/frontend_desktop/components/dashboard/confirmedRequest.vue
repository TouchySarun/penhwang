<template>
  <div>
    <v-btn text @click="show = !show" block>
      <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      คำขอที่อนุมัติแล้ว
      <v-spacer></v-spacer>
    </v-btn>
    <v-expansion-panels v-show="show">
      <v-expansion-panel
        v-for="(item,i) in req"
        :key="i"
        :class="reqClass(item.type)"
      >
        <v-expansion-panel-header disable-icon-rotate>
          <v-avatar style="flex: 0;" dark :color="reqColor(item.type)">
            <v-icon dark>{{reqIcon(item.type)}}</v-icon>
          </v-avatar>
          <div style="padding-left: 1vw;">
            <div style="display:flex; flex-wrap:wrap;">
              <p>{{ item.type }}</p>
              <div style="width: 1vw"/>
              <span>{{(item.type !== 'เข้าร่วม')?employeeGetter(item.owner).name: item.name}}</span>
            </div>
            <div v-if="item.type === 'ลา'" class="detail">
              ขอลาวันที่: <span>{{formatDate(item.start)}}</span>  ถึงวันที่: <span>{{formatDate(item.end)}}</span>
            </div>
            <div v-if="item.type === 'เปลี่ยนกะ'" class="detail">
              ขอเปลี่ยนจาก: <span>{{item.oldSlotName}}</span>  เป็น: <span>{{item.newSlotName}}</span>
            </div>
            <div v-if="item.type === 'เข้าร่วม'" class="detail">
              line id:<span>{{item.lineId}}</span>
              email:<span>{{item.email}}</span>
              เบอร์โทร:<span>{{item.tel}}</span>
            </div>
          </div>
          <template v-slot:actions>
            <v-icon color="teal"> mdi-check</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-icon small>mdi-clock</v-icon>{{ formatDate(item.requestTime) }}
        </v-expansion-panel-content>

        <v-expansion-panel-content>
          <v-icon small>mdi-alarm-check</v-icon>อนุมัติเมื่อ: {{ formatDate(item.confirmedTime) }} (ผู้อนุมัติ {{employeeGetter(item.recipient).name}})
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  props:['req'],
  data:()=>({
    show: false,
  }),
  computed:{
    myReq(){return JSON.parse(JSON.stringify(this.req))},
    ...mapGetters({
      employeeGetter: 'employee/getEmployeeById',
    }),
  },
  methods: {
    reqClass(t){
      if(t==='ลา'){
        return 'leave-req'
      }else if(t==='เปลี่ยนกะ'){
        return 'change-shift-req'
      }else if(t==='เข้าร่วม'){
        return 'job-application-req'
      }
    },
    reqIcon(t){
      if(t==='ลา'){
        return 'mdi-stethoscope'
      }else if(t==='เปลี่ยนกะ'){
        return 'mdi-calendar-clock'
      }else if(t==='เข้าร่วม'){
        return 'mdi-account-plus'
      }
    },
    reqColor(t){
      if(t==='ลา'){
        return 'warning'
      }else if(t==='เปลี่ยนกะ'){
        return 'accent'
      }else if(t==='เข้าร่วม'){
        return 'error'
      }
    },
    shiftZero(m){
      var res;
      (m >= 10) ? res=`${m}`: (m>0) ? res=`0${m}`: res="00";
      return res;
    },
    formatDate(d){
      var date = new Date(d);
      return date.toLocaleString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) +
      " " +
      this.shiftZero(date.getHours()) +
      ":" +
      this.shiftZero(date.getMinutes()) +
      " น.";
    },
  }
}
</script>
<style lang="scss" scoped>
  @import './assets/request.scss';
</style>
