<template>
  <v-card class="mx-auto" max-width="400">
    <v-img
      class="black--text align-end"
      height="200px"
      src="https://sv1.picz.in.th/images/2021/03/02/oGSzFP.png?fbclid=IwAR0VLvqRq6B-KIlNcKhaECRlJ9vG0f8bH4cXEx_qUpUAHJn1d9a3joKtPPg"
    >
      <!-- <v-card-title
        ><h2 style="background-color: white; padding: 5px">
          ประวัติการทำงาน
        </h2></v-card-title
      > -->
    </v-img>
    <v-row style="height: 100vh">
      <v-col style="margin-left: 3%; margin-right: 3%">
        <h2 style="padding: 10px 15px 0 10px">ประวัติการทำงาน</h2>
        <br />
        <v-row>
          <v-col style="max-width: 180px">
            <p style="margin-bottom: 0; color: #43a047">จาก</p>
            <DateTimeInput @onDateChange="(d) => (start = d)" />
          </v-col>
          <v-col style="max-width: 180px"
            ><p style="margin-bottom: 0; color: #ab47bc">ถึง</p>
            <DateTimeInput @onDateChange="(d) => (end = d)"
          /></v-col>
          <v-btn block color="info" @click="getWorkHour">ค้นหา</v-btn>
        </v-row>
        <br />
        <v-data-table
          :headers="headers"
          :items="workHourFormated"
          :items-per-page="5"
        >
          <template v-slot:item.in="{ item }">
            <v-btn v-if="item.in" :color="getColor(item.inErr)" dark>{{
              item.inDate
            }}</v-btn>
          </template>
          <template v-slot:item.out="{ item }">
            <v-btn v-if="item.out" :color="getColor(item.outErr)" dark>{{
              item.outDate
            }}</v-btn>
          </template>
          <template v-slot:item.sum="{ item }">
            <v-btn v-if="item.leave" color="info" dark>{{ item.sum }}</v-btn>
            <span v-else>{{ item.sum }}</span>
          </template>
          <template v-slot:item.sum="{ item }">
            <v-btn v-if="item.miss" color="error" dark>{{ item.sum }}</v-btn>
            <span v-else>{{ item.sum }}</span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import api from '~/api/index'
export default {
  data: () => ({
    workHour: [],
    start: '',
    end: '',
    headers: [
      { text: 'วัน/เดือน/ปี', value: 'date', align: 'center' },
      { text: 'เวลาเข้า', value: 'in', align: 'center', sortable: false },
      { text: 'เวลาออก', value: 'out', align: 'center', sortable: false },
      { text: 'รวม (hr:min)', value: 'sum', align: 'center', sortable: false },
    ],
  }),
  computed: {
    workHourFormated() {
      var r = []
      var i = -1
      this.workHour.forEach((wh) => {
        wh.attendance.forEach((att) => {
          if (att.type === '1') {
            i++
            r.push({
              date: this.dateFormated(new Date(wh.date)),
              in: new Date(att.time),
              inDate: this.timeFormated(new Date(att.time)),
              inErr: att.isLate,
              inAddr: att.location,
              out: '',
              outDate: '',
              outErr: 1,
              outAddr: '',
              sum: '',
            })
          } else if (att.type === '2') {
            r[i].out = new Date(att.time)
            r[i].outDate = this.timeFormated(new Date(att.time))
            r[i].outErr = att.isLate
            r[i].outAddr = att.location
            var sum = (r[i].out - r[i].in) / 1000 / 60
            var h = this.shiftZero(sum / 60)
            var m = this.shiftZero(sum % 60)
            r[i].sum = h + ':' + m
          } else if (att.type === '3') {
            i++
            r.push({
              date: wh.date,
              sum: 'ลา',
              leave: true,
            })
          } else if (att.type === '4') {
            i++
            r.push({
              date: wh.date,
              sum: 'ขาด',
              miss: true,
            })
          }
        })
      })
      return r
    },
  },
  methods: {
    getColor: (late) => (late ? 'warning' : 'success'),
    shiftZero(m) {
      var res
      m >= 10 ? (res = `${m}`) : m > 0 ? (res = `0${m}`) : (res = '00')
      return res
    },
    timeFormated(d) {
      var m = this.shiftZero(d.getMinutes())
      var h = this.shiftZero(d.getHours())
      return `${h}:${m}`
    },
    dateFormated(d) {
      var date = this.shiftZero(d.getDate())
      var m = this.shiftZero(d.getMonth() + 1)
      var y = this.shiftZero(d.getFullYear())
      return `${date}/ ${m}/ ${y}`
    },
    getWorkHour() {
      this.$nextTick(async () => {
        this.$nuxt.$loading.start()
        const data = {
          id: this.$route.params.id,
          start: this.start,
          end: this.end,
        }
        await this.$axios
          .$post(api.getWorkHour, data)
          .then((res) => {
            this.loading = false
            res.isSuccess
              ? (this.workHour = res.data.workHour)
              : console.log(res)
          })
          .catch((err) => {
            console.log(err)
          })
      })
    },
  },
}
</script>
