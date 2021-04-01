<template>
  <v-card>
    <slot name="header">
      <v-card-title>
        <h2>ตารางเวลาทำงาน</h2>
        <p style="margin: 5px 10px 0px 10px; padding: 0">(กะ)</p>
        <h2>{{ my.name }}</h2>
      </v-card-title>
    </slot>
    <v-card-text>
      <v-row>
        <v-col
          cols="7"
          style="
            border: solid 0.8px #00000030;
            border-radius: 5px;
            padding: 2%;
            margin-bottom: 2%;
          "
        >
          <v-form ref="form">
            <div style="float: right" v-if="$route.params.id">
              <v-btn v-if="editing" color="error" @click="delChange"
                >ยกเลิก</v-btn
              >
              <v-btn v-if="editing" color="success" @click="saveChange(false)"
                >บันทึก</v-btn
              >
              <v-btn v-else color="info" @click="editing = true">แก้ไข</v-btn>
            </div>
            <v-row align="center">
              <v-col cols="7">
                <v-text-field
                  v-model="my.name"
                  :readonly="!editing"
                  label="ชื่อ"
                />
              </v-col>
              <v-col cols="4">
                <v-row>
                  <v-text-field
                    v-model="my.lateAfter"
                    :readonly="!editing"
                    label="สายหลังจากผ่านไป"
                    prepend-icon="mdi-clock"
                    suffix="นาที"
                  ></v-text-field>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
          <slot-data
            ref="slotData"
            :editing="editing"
            :items="my.time"/>
        </v-col>
        <v-col cols="5">
          <v-text-field v-model="employeeName" label="ค้นหาพนักงาน" />
          <employee-home
            :employees="employees"
            :search="employeeName"
            @deleteEmployee="(d) => removeEmployee(d)"
          >
            <template v-slot="">
              <v-card-title>
                <span>พนักงานที่ใช้กะนี้อยู่</span>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" width="800">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="green" dark v-bind="attrs" v-on="on">
                      เพิ่มพนักงาน
                    </v-btn>
                  </template>
                  <employee-selector
                    ref="employee"
                    :items="selectableEmployees"
                    :role="true"
                    @closeTab="dialog = false"
                    @saveData="
                      (d) => {
                        dialog = false
                        addEmployees(d)
                      }
                    "
                  />
                </v-dialog>
              </v-card-title>
            </template>
          </employee-home>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import EmployeeSelector from '~/components/employee/EmployeeSelector.vue'
import SlotData from './SlotData.vue'
import { mapGetters } from 'vuex'
import Vue from 'vue'

export default {
  components: { EmployeeSelector, SlotData },
  props:['slotDetail'],
  data: () => ({
    //editing
    editing: false,
    my: {
      employees: [],
      name: '',
      time: undefined,
      lateAfter: '',
    },
    //control dialogs
    dialog: false,
    //searching values
    employeeName: '',
    //else
    postType: {
      employee: 'employee',
    },
  }),
  computed: {
    selectableEmployees() {
      var x = this.employees
      return this.allEmployees.filter((e) => !x.includes(e))
    },
    ...mapGetters({
      allEmployees: 'employee/getEmployees',
      employeeGetter: 'employee/getEmployeesById',
      slotGetter: 'slot/getSlotById',
    }),
    employees() {
      return this.employeeGetter((this.my.employees)?this.my.employees:[])
    },
  },
  methods: {
    delChange() {
      this.editing = false;
      this.$refs.slotData.delChange();
      this.my = JSON.parse(JSON.stringify(this.slotGetter(this.$route.params.id)));
    },
    saveChange(isNew) {
      this.editing = false;
      this.my.time = this.$refs.slotData.saveChange();
      var method = '';
      (isNew) ? method='newSlot': method='changeData';
      this.$store.dispatch(`slot/${method}`, {
        token: this.$cookies.get('token'),
        slotId: this.$route.params.id,
        employees: this.my.employees,
        name: this.my.name,
        lateAfter: this.my.lateAfter,
        time: this.my.time
      });
    },
    addEmployees(emp) {
      Vue.set(this.my, 'employees', this.my.employees.concat(emp))
      this.postData(this.postType.employee)
    },
    removeEmployee(emp) {
      if (confirm(`ให้พนักงาน ${emp.name} เลิกใช้ ${this.my.name}`)) {
        this.my.employees = this.my.employees.filter((e) => e !== emp.id)
        if (this.$refs.employee) {
          this.$refs.employee.reset()
        }
        this.postData(this.postType.employee)
      }
    },
    postData(type) {
      if (this.$route.params.id) {
        if (type === this.postType.employee) {
          this.$store.dispatch('slot/setEmployees', {
            token: this.$cookies.get('token'),
            slotId: this.$route.params.id,
            employees: this.my.employees
          })
        }
      }
    },
  },
  watch: {
    slotDetail: function (val) {this.my = JSON.parse(JSON.stringify(val))}
  },
  created() {
    if (this.$route.params.id) {
      this.slotDetail !== undefined
      ? this.my = JSON.parse(JSON.stringify(this.slotDetail))
      : this.my = {
        employees: [],
        name: '',
        time: undefined,
        lateAfter: '',
      }
    } else {
      this.editing = true
    }
  }
}
</script>
