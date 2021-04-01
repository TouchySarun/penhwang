<template>
  <v-card class="mx-auto" max-width="400">
    <v-img
      class="black--text align-end"
      height="200px"
      src="https://www.img.in.th/images/5dfbbff4a010135e3f6ff5a84fc99499.png?fbclid=IwAR0hDONZV89-e2Ij3hRHc5Gy-m7wgz0R2yi6k2emkwn0k9dYKTvZ9_oOADs"
    >
      <!-- <v-card-title
        ><h2 style="background-color: white; padding: 5px">
          แบบฟอร์มเปลี่ยนกะทำงาน
        </h2></v-card-title -->
      >
    </v-img>
    <div style="background-color: #f5f5f5; height: 100vh">
      <h2 style="padding: 10px 15px 0 15px">แบบฟอร์มเปลี่ยนกะทำงาน</h2>
      <v-form style="padding: 5%">
        <v-select
          v-model="slotId"
          item-text="name"
          item-value="id"
          :items="slots"
          required
          label="เปลี่ยนเป็น ..."
          outlined
          solo
        ></v-select>
        <h3 style="color: #43a047">จะเริ่มเปลี่ยนตั้งแต่</h3>
        <v-menu
          ref="DateStart"
          v-model="DateStart"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="formatDate"
              label="วัน/เดือน/ปี"
              persistent-hint
              prepend-icon="mdi-calendar"
              v-bind="attrs"
              v-on="on"
              outlined
              dense
              hide-details
              background-color="#FFFFFF"
            ></v-text-field>
            <br />
          </template>
          <v-date-picker
            v-model="date1"
            no-title
            @input="DateStart = false"
          ></v-date-picker>
        </v-menu>
        <br />
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
          :disabled="!(slotId !== '' && dateValid)"
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
    DateStart: false,
    loading: true,
    date1: null,
    time1: null,
    reason: '',
    slotId: '',
    slots: [],
    employee: {},
  }),
  computed: {
    dateTime1() {
      return new Date(`${this.date1}T00:00:00+07:00`)
    },
    dateValid() {
      return !!this.date1
    },
    formatDate() {
      if (!this.date1) return null
      const [year, month, day] = this.date1.split('-')
      return `${day}/${month}/${year}`
    },
  },
  methods: {
    findSlot(slotId) {
      for (let i = 0; i < this.slots.length; i++) {
        if (this.slots[i].id === slotId) return this.slots[i].name
      }
      return undefined
    },
    showSuccess() {
      alert('ส่งคำขอสำเร็จ')
    },
    showError() {
      alert('ล้มเหลว')
    },
    sendForm() {
      var data = {
        employeeId: this.$route.params.id,
        passcode: this.employee.companyId,
        start: this.dateTime1,
        newSlot: this.slotId,
        newSlotName: this.findSlot(this.slotId),
        oldSlot: this.employee.slotId,
        oldSlotName: this.findSlot(this.employee.slotId) || 'ไม่มีกะ',
        reason: this.reason,
      }
      this.$nextTick(() => {
        this.$nuxt.$loading.start()
        this.$axios
          .$post(api.changeSlotReq, data)
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
        .$post(api.slotGetUsable(this.$route.params.id))
        .then((res) => {
          if (res.isSuccess) {
            this.slots = res.data.slots
            this.employee = res.data.employee
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

