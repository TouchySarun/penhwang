<template>
  <div v-if=!loading>
    <div
      style="display: flex; width: 100%; align-items: center; padding: 1% 2%"
    >
      <v-avatar size="62">
        <img :src="employee.img" />
      </v-avatar>
      <h2 style="width: 60vw">
        {{ employee.name }}
      </h2>
    </div>
    <v-tabs v-model="tab" dark background-color="lightBrown">
      <v-tab><v-icon left>mdi-account</v-icon>ข้อมูลส่วนตัว</v-tab>
      <v-tab><v-icon left>mdi-stethoscope</v-icon>วันลา</v-tab>
      <v-tab><v-icon left>mdi-clock</v-icon>ประวัติการทำงาน</v-tab>
    </v-tabs>
    <v-container>
      <v-tabs-items v-model="tab">
        <!-- ข้อมูลส่วนตัว -->
        <v-tab-item>
          <div style="display: flex">
            <v-spacer />
            <v-btn
              v-if="!editing"
              @click="editing = true"
              outlined
              icon
              color="info"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn v-if="editing" @click="deleteChange" outlined color="red">
              ยกเลิก
            </v-btn>
            <v-btn
              v-if="editing"
              @click="saveChange"
              :icon="!editing"
              color="success"
            >
              บันทึก
            </v-btn>
          </div>
          <v-row>
            <v-col
              ><Details ref="personal" :editing="editing" :items="personal" />
            </v-col>
            <v-col
              ><Details ref="contact" :editing="editing" :items="contact" />
            </v-col>
          </v-row>
          <br />
          <v-btn @click="deleteEmployee(employee)" color="error" outlined block
            >ไล่พนักงานออก</v-btn
          >
        </v-tab-item>
        <!-- วันลา -->
        <v-tab-item>
          <br />
          <h3>สิทธิ์วันลา</h3>
          <v-data-table :headers="headers" :items="rights" hide-default-footer>
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
          <leave-history :req="requests" />
          <br />
        </v-tab-item>
        <!-- ประวัติการทำงาน -->
        <v-tab-item>
          <employee-history-table
            :workHour="workHour"
            @getWorkHour="(d) => getWorkHour(d.start, d.end)"
          />
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </div>
</template>
<script>
import CompanyDetailSelector from '~/components/company/companyDetailSelector.vue'
import DashboardCard from '~/components/DashboardCard.vue'
import Details from '~/components/company/Details.vue'
import EmployeeHistoryTable from '~/components/employee/EmployeeHistoryTable.vue'
import { mapState, mapGetters } from 'vuex'
import LeaveHistory from '~/components/employee/LeaveHistory.vue'

export default {
  middleware: 'auth',
  components: {
    DashboardCard,
    CompanyDetailSelector,
    Details,
    EmployeeHistoryTable,
    LeaveHistory,
  },
  data: () => ({
    loading: true,
    editing: false,
    tab: 0,
    employee: {salary:{}},
    headers: [
      {
        text: 'ประเภทการลา',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: 'ใช้แล้ว', value: 'used' },
      { text: 'คงเหลือ', value: 'balance' },
    ]
  }),
  computed: {
    ...mapState('employee', ['workHour']),
    ...mapState('leave', ['rights']),
    ...mapGetters({
      employeeGetter: 'employee/getEmployeeById',
      types: 'employee/getTypes',
      req: 'request/getRequestsById',
    }),
    requests() {
      return this.req(this.$route.params.id);
    },
    personal() {
      return [
        {
          att: 'name',
          icon: 'mdi-account',
          label: 'ชื่อ สกุล ',
          data: this.employee.name,
          color: 'info',
          type: 'norm',
        },
        {
          att: 'role',
          icon: 'mdi-bookmark',
          label: 'แผนก ',
          data: this.employee.role,
          color: 'info',
          type: 'norm',
          unEditable: true,
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
          color: 'success',
          type: 'select',
          items: this.types,
        },
        {
          att: 'amount',
          icon: 'mdi-cash',
          label: 'เงินเดือน ',
          data: this.employee.salary.amount,
          color: 'success',
          type: 'norm',
        },
      ]
    },
    contact() {
      return [
        {
          att: 'tel',
          icon: 'mdi-phone',
          label: 'เบอร์ติดต่อ ',
          data: this.employee.tel,
          color: 'success',
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
          color: 'info',
          type: 'norm',
        },
      ]
    },
  },
  methods: {
    deleteChange() {
      this.editing = false
    },
    saveChange() {
      this.editing = false
      const d1 = this.$refs.personal.saveData()
      const d2 = this.$refs.contact.saveData()
      const newData = {
        id: this.employee.id,
        name: d1.name,
        role: d1.role,
        pos: d1.pos,
        salary: { type: d1.type, amount: d1.amount },
        tel: d2.tel,
        lineId: d2.lineId,
        email: d2.email,
      }
      this.$store.dispatch('employee/setData', newData)
      .then(isSuccess =>
        this.employee = JSON.parse(JSON.stringify(this.employeeGetter(this.$route.params.id)))
      )
      .catch(err => console.error(err));
    },
    getWorkHour(start, end) {
      this.$store.dispatch('employee/getWorkHour', {
        id: this.$route.params.id,
        start,
        end,
      })
    },
    deleteEmployee(emp) {
      if (confirm(`ไล่พนักงาน ${emp.name} ออก`)) {
        this.$store.dispatch('employee/deleteEmployee', emp)
        this.$router.push({ path: `/employee` })
      }
    },

  },
  mounted(){
    this.$nextTick( async () => {
      this.$nuxt.$loading.start()
      await Promise.all([
        this.$store.dispatch('request/getAllRequest'),
        this.$store.dispatch('leave/getLeaveRights', this.$route.params.id),
        this.$store.dispatch('employee/getEmployees')
      ])
      this.employee = JSON.parse(JSON.stringify(this.employeeGetter(this.$route.params.id)))
      this.$store.dispatch('employee/clearWorkHour');
      this.loading = false;
      this.$nuxt.$loading.finish()
    })
  },
}
</script>
