<template>
  <v-card>
    <v-card-title style="padding: 0.5vh 1vw; background-color: #6D4C41; color: white;">Date: {{now}}</v-card-title>
    <v-card-text>
    <v-row>
      <v-col cols="8">
        <attendance :items="attendance" :roles="roles" :sum="attendanceConclude"/>
        <v-btn @click="attendance.unshift(
          {
            img: 'https://cdn.vuetifyjs.com/images/john.jpg',
            name: 'สมหมาย มั่นคง',
            in: '08:10',
            out: null,
            role: 'พนักงานขาย',
            isLate: false,
          })">สมหมาย เข้างาน</v-btn>
        <v-btn @click="attendance.shift();attendance.unshift(
          {
            img: 'https://cdn.vuetifyjs.com/images/john.jpg',
            name: 'สมหมาย มั่นคง',
            in: '08:10',
            out: '17:30',
            role: 'พนักงานขาย',
            isLate: false,
          })">สมหมาย ออกงาน</v-btn>
        <dashboard-history :items="history"/>
      </v-col>
      <v-divider
        vertical
      ></v-divider>
      <v-col cols="3.5">
        <request :req="req"/>
        <confirmed-request :req="confirmedReq"/>
      </v-col>
    </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import importantObj from '~/components/company/importantObj.vue'
import Attendance from '~/components/dashboard/attendance.vue'
import ConfirmedRequest from '~/components/dashboard/confirmedRequest.vue'
import DashboardConclude from '~/components/dashboard/dashboardConclude.vue'
import DashboardHistory from '~/components/dashboard/dashboardHistory.vue'
export default {
  components: { importantObj, ConfirmedRequest, DashboardConclude, DashboardHistory },
  data: ()=>({
    now: null,
    tab: null,
    inTime: 30,
    late: 10,
    yet: 50,
    out: 1,
    roles: [
      'ทั้งหมด', 'พนักงานขาย', 'พนักงานจัดของ','พนักงานขับรถ',
    ],
    attendanceConclude:[
      {
        role: 'ทั้งหมด',
        data:{
          inTime: 5,
          late: 1,
          leave: 2,
          out: 2,
        }
      },
      {
        role: 'พนักงานขาย',
        data:{
          inTime: 1,
          late: 1,
          leave: 0,
          out:0,
        }
      },
      {
        role: 'พนักงานจัดของ',
        data:{
          inTime: 4,
          late: 0,
          leave: 2,
          out:2,
        }
      }
    ],
    attendance: [
      {
        img: 'https://cdn.vuetifyjs.com/images/john.jpg',
        name: 'สมศรี ใจรัก',
        in: '08:10',
        out: null,
        role: 'พนักงานขาย',
        isLate: false,
      },
      {
        img: 'https://cdn.vuetifyjs.com/images/john.jpg',
        name: 'สมหญิง จริงใจ',
        in: '08:50',
        out: null,
        role: 'พนักงานขาย',
        isLate: true,
      },
      {
        img: 'https://cdn.vuetifyjs.com/images/john.jpg',
        name: 'สมใจ นะจ๊ะ',
        in: '08:01',
        out: null,
        role: 'พนักงานจัดของ',
        isLate: false,
      },
      {
        img: 'https://cdn.vuetifyjs.com/images/john.jpg',
        name: 'สมศักดิ์ คำแก้ว',
        in: '08:10',
        out: null,
        role: 'พนักงานจัดของ',
        isLate: false,
      },
      {
        img: 'https://cdn.vuetifyjs.com/images/john.jpg',
        name: 'สมชาย สายเสมอ',
        in: '08:02',
        out: '17:30',
        role: 'พนักงานจัดของ',
        isLate: false,
      },
      {
        img: 'https://cdn.vuetifyjs.com/images/john.jpg',
        name: 'สมพง คงอยู่',
        in: '08:05',
        out: '17:50',
        role: 'พนักงานจัดของ',
        isLate: false,
      },
    ],
    req: [
      {
        type: 'ขอลากิจ',
        name: 'สมใจ นะจ๊ะ',
        time: 'วันพุธ 28 ตุลาคม 2563, 09:30'
      },
      {
        type: 'ขอลาป่วย',
        name: 'สมใจ นะจ๊ะ',
        time: 'วันพุธ 28 ตุลาคม 2563, 09:30'
      },
      {
        type: 'ขอเปลี่ยนกะ',
        name: 'สมใจ นะจ๊ะ',
        time: 'วันพุธ 28 ตุลาคม 2563, 09:30'
      },
    ],
    confirmedReq: [
      {
        type: 'ขอลากิจ',
        name: 'สมใจ นะจ๊ะ',
        manager: 'สมหมาย ใจใจ',
        time: 'วันพุธ 28 ตุลาคม 2563, 09:30',
        confirmedTime: 'วันพุธ 28 ตุลาคม 2563, 09:30'
      },
      {
        type: 'ขอลาป่วย',
        name: 'สมใจ นะจ๊ะ',
        manager: 'สมหมาย ใจใจ',
        time: 'วันพุธ 28 ตุลาคม 2563, 09:30',
        confirmedTime: 'วันพุธ 28 ตุลาคม 2563, 09:30'
      },
      {
        type: 'ขอเปลี่ยนกะ',
        name: 'สมใจ นะจ๊ะ',
        manager: 'สมหมาย ใจใจ',
        time: 'วันพุธ 28 ตุลาคม 2563, 09:30',
        confirmedTime: 'วันพุธ 28 ตุลาคม 2563, 09:30'
      },
    ],
    history: [
      {
        date: '01/01/2021',
        department: 159,
        inTime: 6,
        late: 24,
        leave: 4,
        miss: '1',
      },
      {
        date: '01/02/2021',
        department: 237,
        inTime: 9,
        late: 37,
        leave: 3,
        miss: '1',
      },
      {
        date: '01/03/2021',
        department: 262,
        inTime: 16,
        late: 23,
        leave: 60,
        miss: '7',
      },
      {
        date: '01/04/2021',
        department: 305,
        inTime: 37,
        late: 67,
        leave: 4,
        miss: '8',
      },
      {
        date: '01/05/2021',
        department: 356,
        inTime: 16,
        late: 49,
        leave: 3,
        miss: '16',
      },
      {
        date: '01/06/2021',
        department: 375,
        inTime: 0,
        late: 94,
        leave: 0,
        miss: '0',
      },
      {
        date: '01/07/2021',
        department: 392,
        inTime: 2,
        late: 98,
        leave: 0,
        miss: '2',
      },
      {
        date: '01/08/2021',
        department: 408,
        inTime: 32,
        late: 87,
        leave: 6,
        miss: '45',
      },
      {
        date: '01/09/2021',
        department: 452,
        inTime: 25,
        late: 51,
        leave: 4,
        miss: '22',
      },
      {
        date: '01/10/2021',
        department: 518,
        inTime: 26,
        late: 65,
        leave: 7,
        miss: '6',
      },
    ],
  }),
  created() {
    setInterval(() => {
      const date = new Date();
      this.now =
        date.toLocaleString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }) +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        " น.";
    }, 1000);
  },
}
</script>
