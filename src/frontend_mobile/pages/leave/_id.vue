<template>
  <v-card class="mx-auto" max-width="400">
    <v-img
      class="black--text align-end"
      height="200px"
      src="https://www.img.in.th/images/5dfbbff4a010135e3f6ff5a84fc99499.png?fbclid=IwAR0hDONZV89-e2Ij3hRHc5Gy-m7wgz0R2yi6k2emkwn0k9dYKTvZ9_oOADs"
    >
      <!-- <v-card-title
        ><h2 style="background-color: white; padding: 5px">
          แบบฟอร์มการลางาน
        </h2></v-card-title
      > -->
    </v-img>
    <div style="background-color: #f5f5f5; height: 100vh">
      <h2 style="padding: 10px 15px 0 15px">แบบฟอร์มการลางาน</h2>
      <v-form style="padding: 5%">
        <v-select
          v-model="leaveType"
          item-text="name"
          item-value="id"
          :items="leaves"
          required
          label="ประเภทการลา"
          outlined
          solo
        ></v-select>
        <h3 style="color: #43a047">Start Date Time</h3>
        <br />
        <DateTimeInput
          @onDateChange="(d) => (date1 = d)"
          @onTimeChange="(t) => (time1 = t)"
        />
        <h3 style="color: #ab47bc">End Date Time</h3>
        <br />
        <DateTimeInput
          @onDateChange="(d) => (date2 = d)"
          @onTimeChange="(t) => (time2 = t)"
        />
        <h3>เหตุผล</h3>
        <v-textarea
          v-model="reason"
          auto-grow
          dense
          outlined
          rows="2"
          row-height="20"
          hide-details
          background-color="#FFFFFF"
        ></v-textarea>
        <br />
        <v-spacer />
        <v-btn
          :disabled="!(leaveType !== '' && dateValid)"
          block
          color="primary"
          large
          @click="sendForm"
        >
          <h3>ส่งแบบฟอร์ม</h3>
        </v-btn>
        <br />
      </v-form>
    </div>
  </v-card>
</template>

<script>
import api from '~/api/index'
export default {
  data: () => ({
    loading: true,
    date1: null,
    date2: null,
    reason: '',
    leaveType: '',
    leaves: [],
  }),
  computed: {
    dateTime1() {
      return new Date(`${this.date1}T00:00:00+07:00`)
    },
    dateTime2() {
      return new Date(`${this.date2}T23:50:00+07:00`)
    },
    dateValid() {
      return (
        // (this.date1 !== this.date2 || this.time1 !== this.time2) &&
        // !!this.date1 &&
        // !!this.date2 &&
        // !!this.time1 &&
        // this.time2
        this.date1 !== this.date2 && !!this.date1 && !!this.date2
      )
    },
  },
  methods: {
    showSuccess() {
      alert('ส่งคำขอสำเร็จ')
    },
    showError() {
      alert('ล้มเหลว')
    },
    sendForm() {
      var leaveData = {
        employeeId: this.$route.params.id,
        leaveId: this.leaveType,
        reason: this.reason,
        start: this.dateTime1,
        end: this.dateTime2,
      }
      this.$nextTick(() => {
        this.$nuxt.$loading.start()
        this.$axios
          .$post(api.leaveReq, leaveData)
          .then((res) => {
            if (res.isSuccess) {
              this.loading = false
              this.showSuccess()
            } else {
              this.loading = false
              console.log(res)
              this.showError()
            }
          })
          .catch((err) => console.error(err))
        this.$nuxt.$loading.finish()
      })
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      this.$axios
        .$post(api.getLeaveRight(this.$route.params.id))
        .then((res) => {
          if (res.isSuccess) {
            this.leaves = res.data.leaves
            this.loading = false
          } else {
            console.log(res)
          }
        })
        .catch((err) => console.error(err))
      this.$nuxt.$loading.finish()
    })
  },
}
</script>

