<template>
  <div>
    <v-btn text @click="show = !show" block style="padding-left: 0px">
      <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      <h3>การลาของฉัน</h3>
      <v-spacer />
    </v-btn>
    <v-expansion-panels v-show="show">
      <v-expansion-panel
        v-for="(item, i) in req"
        :key="i"
        :class="reqClass(item.type)"
      >
        <v-expansion-panel-header
          disable-icon-rotate
          style="padding: 10px 20px 15px 20px"
        >
          <template v-slot:actions>
            <v-chip color="success" dark v-if="item.isConfirmed" small outlined
              >อนุมัติแล้ว</v-chip
            >
            <v-chip
              color="error"
              dark
              v-if="!item.isConfirmed && item.isWatched"
              small
              outlined
              >ถูกปฎิเสธ</v-chip
            >
            <v-chip color="#FBC02D" dark v-if="!item.isWatched" small
              >รออนุมัติ</v-chip
            >
          </template>
          <v-avatar style="flex: 0" size="35" dark :color="reqColor(item.type)">
            <v-icon small dark>{{ reqIcon(item.type) }}</v-icon>
          </v-avatar>
          <div style="padding-left: 5px; height: 7vh">
            <div style="display: flex; flex-wrap: wrap; margin-bottom: 1vh">
              <h4>{{ item.type }}</h4>
            </div>
            <div v-if="item.type === 'ลา'" class="detail">
              เริ่ม: <span>{{ formatDate(item.start) }}</span>
              <br />
              <br />
              ถึง: <span>{{ formatDate(item.end) }}</span>
            </div>
            <div v-if="item.type === 'เปลี่ยนกะ'" class="detail">
              จาก: <span>{{ item.oldSlotName }}</span>
              <br />
              <br />
              เป็น:
              <span>{{ item.newSlotName }}</span>
            </div>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content style="color: gray; font-size: 80%">
          <v-text-field
            label="คำขอ"
            v-model="item.reason"
            readonly
            dense
          ></v-text-field>
          <v-text-field
            label="เหตุผล"
            v-model="item.confirmedReason"
            readonly
            dense
          ></v-text-field>
          <v-icon small>mdi-clock</v-icon> ส่งเมื่อ:
          {{ formatDate(item.requestTime) }}
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
export default {
  props: {
    req: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    show: true,
  }),
  methods: {
    reqClass(t) {
      if (t === 'ลา') {
        return 'leave-req'
      } else if (t === 'เปลี่ยนกะ') {
        return 'change-shift-req'
      } else if (t === 'เข้าร่วม') {
        return 'job-application-req'
      }
    },
    reqIcon(t) {
      if (t === 'ลา') {
        return 'mdi-stethoscope'
      } else if (t === 'เปลี่ยนกะ') {
        return 'mdi-calendar-clock'
      } else if (t === 'เข้าร่วม') {
        return 'mdi-account-plus'
      }
    },
    reqColor(t) {
      if (t === 'ลา') {
        return 'warning'
      } else if (t === 'เปลี่ยนกะ') {
        return 'accent'
      } else if (t === 'เข้าร่วม') {
        return 'error'
      }
    },
    shiftZero(m) {
      return m >= 10 ? `${m}` : m > 0 ? `0${m}` : '00'
    },
    formatDate(d) {
      var date = new Date(d)
      return (
        date.toLocaleString('th-TH', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }) +
        ' ' +
        this.shiftZero(date.getHours()) +
        ':' +
        this.shiftZero(date.getMinutes()) +
        ' น.'
      )
    },
  },
}
</script>
<style lang="scss" scoped>
@import './assets/request.scss';
.v-chip {
  font-size: 12px !important;
  // color: white !important;
}
</style>
