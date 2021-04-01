<template>
  <v-card class="mx-auto" max-width="400">
    <v-img
      class="black--text align-end"
      height="200px"
      src="https://sv1.picz.in.th/images/2021/03/02/oG7jvk.png?fbclid=IwAR1zzXKz-uvXjt6w3bAzeADRcHsqQvS068j2j5Bq2-Nnqnj0MNuVmvbX6Jg"
    />
    <v-tabs v-model="tab">
      <v-tab>ข้อมูลส่วนตัว </v-tab>
      <v-tab>วันลา</v-tab>
    </v-tabs>
    <v-container
      style="height: 100vh; background-color: #f5f5f5"
      v-if="!loading"
    >
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <div class="cardMobile">
            <v-row justify="space-between">
              <v-col>
                <h3 style="margin: 2vw 0vw 2vw 2vw; color: #1a237e">
                  ข้อมูลติดต่อ
                </h3>
              </v-col>
              <v-col>
                <div style="display: flex; flex-direction: row-reverse">
                  <v-btn
                    v-if="!editing"
                    dark
                    icon
                    color="info"
                    @click="editing = true"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="editing"
                    dark
                    color="success"
                    @click="saveChange"
                  >
                    บันทึก
                  </v-btn>
                  <div style="width: 1vw"></div>
                  <v-btn
                    v-if="editing"
                    outlined
                    color="error"
                    @click="deleteChange"
                  >
                    ยกเลิก
                  </v-btn>
                </div>
              </v-col>
            </v-row>
            <Details ref="contact" :editing="editing" :items="contact" />
          </div>
          <div class="cardMobile">
            <h3 style="margin: 2vw 0vw 2vw 2vw; color: #1a237e">
              ข้อมูลการทำงาน
            </h3>
            <Details ref="personal" :items="personal" />
          </div>
        </v-tab-item>
        <v-tab-item>
          <h3>สิทธิ์วันลา</h3>
          <v-data-table
            :headers="headers"
            :items="day"
            mobile-breakpoint
            hide-default-footer
          >
            <template v-slot:item.name="{ item }">
              <h3>
                {{ item.name }}
              </h3>
            </template>
            <template v-slot:item.used="{ item }">
              <v-chip>
                {{ item.used }}
              </v-chip>
            </template>
            <template v-slot:item.balance="{ item }">
              <v-chip color="success" dark>
                {{ item.balance }}
              </v-chip>
            </template>
          </v-data-table>
          <br />
          <leave-history :req="req" />
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </v-card>
</template>

<script>
import api from '~/api/index'
import LeaveHistory from '~/components/profile/leaveHistory.vue'
import Details from '~/components/Details.vue'
export default {
  components: {
    LeaveHistory,
    Details,
  },
  data: () => ({
    day: [],
    req: [],
    employee: { salary: {} },
    loading: true,
    editing: false,
    tab: 0,
    headers: [
      {
        text: 'ประเภทการลา',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: 'ใช้แล้ว', value: 'used' },
      { text: 'คงเหลือ', value: 'balance' },
    ],
  }),
  computed: {
    personal() {
      return [
        {
          att: 'role',
          icon: 'mdi-bookmark',
          label: 'แผนก ',
          data: this.employee.role,
          color: 'info',
          type: 'select',
          items: [],
        },
        {
          att: 'pos',
          icon: 'mdi-star',
          label: 'ตำแหน่ง ',
          data: this.employee.pos,
          color: 'warning',
          type: 'norm',
        },
        {
          att: 'type',
          icon: 'mdi-cube-outline',
          label: 'ประเภท ',
          data: this.employee.salary.type,
          color: 'amber',
          type: 'select',
          items: [],
        },
        {
          att: 'amount',
          icon: 'mdi-cash',
          label: 'เงินเดือน ',
          data:
            this.employee.salary.type == 'รายวัน'
              ? this.employee.salary.amount + ' บาท / ชั่วโมง'
              : this.employee.salary.amount + ' บาท / เดือน',
          color: 'success',
          type: 'norm',
        },
      ]
    },
    contact() {
      return [
        {
          att: 'name',
          icon: 'mdi-account',
          label: 'ชื่อ-สกุล ',
          data: this.employee.name,
          color: 'light-blue darken-3',
          type: 'norm',
        },
        {
          att: 'tel',
          icon: 'mdi-phone',
          label: 'เบอร์ติดต่อ ',
          data: this.employee.tel,
          color: 'cyan',
          type: 'norm',
        },
        {
          att: 'lineId',
          icon: 'mdi-cellphone-android',
          label: 'lineId ',
          data: this.employee.lineId,
          color: 'success',
          type: 'norm',
        },
        {
          att: 'email',
          icon: 'mdi-email',
          label: 'อีเมล ',
          data: this.employee.email,
          color: 'pink accent-2',
          type: 'norm',
        },
      ]
    },
  },
  methods: {
    reserve() {
      this.loading = true
      setTimeout(() => (this.loading = false), 2000)
    },
    saveChange() {
      const x = this.$refs.contact.saveData()
      this.$nextTick(() => {
        this.$nuxt.$loading.start()
        this.$axios
          .$post(api.employeeEdit, {
            empId: this.$route.params.id,
            employeeDetail: x,
          })
          .then((res) => {
            this.loading = false
            if (res.isSuccess) {
              alert('แก้ไขสำเร็จ')
            } else {
              alert('ไม่สำเร็จ')
            }
          })
          .catch((err) => console.error(err))
        this.$nuxt.$loading.finish()
      })
      this.editing = false
    },
    deleteChange() {
      this.editing = false
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      this.$axios
        .$post(api.getProfile, { employeeId: this.$route.params.id })
        .then((res) => {
          if (res.isSuccess) {
            this.employee = res.data.employee
            this.req = res.data.requests
            this.day = res.data.leaveRight
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


<style lang="scss" scoped>
p {
  margin: 1.5% 1.5% !important;
}
.hide-btn {
  overflow: hidden;
  max-height: 0px !important;
  min-height: 0px !important;
  max-width: 0px !important;
  min-width: 0px !important;
  padding: 0%;
  border: none;
}
h3 {
  margin-bottom: 3px;
}
.cardMobile {
  border: solid #bcaaa4 0.8px;
  border-radius: 5px; //ขอบมน
  margin: 3px 3px 25px 3px;
  background-color: #ffffff;
}
.v-tabs-items {
  background-color: inherit !important;
}
</style>
