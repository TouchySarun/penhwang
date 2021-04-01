<template>
  <div>
    <v-btn text @click="show = !show" block style="padding-left: 0px">
      <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      <h3>การลาของฉัน</h3>
      <v-spacer></v-spacer>
    </v-btn>
    <v-expansion-panels v-show="show">
      <v-expansion-panel
        v-for="(item, i) in req"
        :key="i"
        :class="getReqClass(item.type)"
      >
        <v-expansion-panel-header disable-icon-rotate>
          <template v-slot:actions>
            <v-btn color="success" dark v-if="item.isConfirmed">อนุมัติแล้ว</v-btn>
            <v-btn color="error" dark v-if="!item.isConfirmed && item.isWatched">ถูกปฎิเสธ</v-btn>
            <v-btn color="orange" dark v-if="!item.isWatched">รออนุมัติ</v-btn>
          </template>
          <div style="padding-left: 1vw">
            <p>{{ item.type }}</p>
            <div
              style="
                color: gray;
                font-size: 80%;
              "
            >
              <v-icon small>mdi-clock</v-icon> วันที่ขอ: {{ dateFormated(item.requestTime) }}
            </div>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-if="item.type === 'ลา' " >
            ขอลาวันที่: <span>{{dateFormated(item.start)}}</span> ถึงวันที่: <span>{{dateFormated(item.end)}}</span>
          </div>
          <div v-if="item.type === 'เปลี่ยนกะ'">
            ขอเปลี่ยนจาก: <span>{{item.oldSlot}}</span> เป็น: <span>{{item.newSlot}}</span>
          </div>
          <div>คำขอ: {{item.reason}}</div>
          <div v-if="item.isWatched">เหตุผล: {{item.confirmedReason}}</div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
export default {
  props: ['req'],
  data: () => ({
    show: true,
  }),
  methods: {
    getReqClass(t) {
      if (t === 'ลา') {
        return 'sick-leave-req'
      } else if (t === 'เปลี่ยนกะ') {
        return 'change-shift-req'
      } else if (t === 'เข้าร่วม') {
        return 'bus-leave-req'
      } else{
        console.log(t);
      }
    },
    dateFormated(i) {
      const date = new Date(i);
      const d = this.shiftZero(date.getDate());
      const m = this.shiftZero(date.getMonth() + 1);
      const y = this.shiftZero(date.getFullYear());
      return `${d}/ ${m}/ ${y}`;
    },
    shiftZero: (i) => (i < 10)?`0${i}`:i
  },
}
</script>
<style lang="scss" scoped>
.v-expansion-panel-header {
  color: inherit;
  p {
    margin: 0;
  }
  span {
    color: #6d4c41;
    margin-left: 10px;
    font-size: 1.25rem;
  }
}
.v-expansion-panel-content {
  color: #757575;
}
.sick-leave-req {
  border-top: solid #ffb300;
  color: #ffb300 !important;
  .v-expansion-panel-content {
    span {
      background-color: #ffb300;
      color: white;
      padding: 0px 10px;
      border-radius: 5px;
    }
  }
}
.bus-leave-req {
  border-top: solid #ff7043;
  color: #ff7043 !important;
  .v-expansion-panel-content {
    span {
      background-color: #ff7043;
      color: white;
      padding: 0px 10px;
      border-radius: 5px;
    }
  }
}
.change-shift-req {
  border-top: solid #78909c;
  color: #78909c !important;
  .v-expansion-panel-content {
    span {
      background-color: #78909c;
      color: white;
      padding: 0px 10px;
      border-radius: 5px;
    }
  }
}
</style>
