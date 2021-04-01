<template>
  <v-card>
    <slot name="header">
      <v-card-title>
        <h2>{{my.name}}</h2>
      </v-card-title>
    </slot>
    <v-card-text>
      <v-form ref="form">
        <div style="float:right;" v-if="$route.params.id">
          <v-btn v-if="editing" color="error" @click="delChange">ยกเลิก</v-btn>
          <v-btn v-if="editing" color="success" @click="saveChange(false)">บันทึก</v-btn>
          <v-btn v-else color="info" @click="editing=true">แก้ไข</v-btn>
        </div>
        <v-text-field
          v-model="my.name"
          label="ชื่อ"
          :readonly="!editing"/>
        <v-row justify="space-between">
          <v-col cols="7">
            <v-text-field
              v-model="my.amount"
              label="สิทธิ์วันลา"
              type="number"
              :readonly="!editing"/>
          </v-col>
          <!-- <v-col cols="4">
            <v-select
              v-model="my.cycle"
              label="รอบ"
              :items="cycleType"
            />
          </v-col> -->
        </v-row>
      </v-form>
      <v-text-field v-model="employeeName" label="ค้นหาพนักงาน"/>
      <employee-home
        :employees="employees"
        :search="employeeName"
        @deleteEmployee="d=>removeEmployee(d)">
        <template v-slot="">
          <v-card-title>
            <span>พนักงานที่สามารถใช้ประเภทนี้</span>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" width="800">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="green" dark v-bind="attrs" v-on="on">
                  เพิ่มพนักงาน
                </v-btn>
              </template>
              <employee-selector
                ref="employee"
                :role="true"
                :items="selectableEmployees"
                @closeTab="dialog = false;"
                @saveData="(d)=>{
                  dialog = false;
                  addEmployees(d);
                }"
              />
            </v-dialog>
          </v-card-title>
        </template>
      </employee-home>
    </v-card-text>
  </v-card>
</template>

<script>
import EmployeeSelector from '~/components/employee/EmployeeSelector.vue';
import { mapState, mapGetters } from 'vuex';
import Vue from 'vue';

export default {
  components: { EmployeeSelector },
  props:['leaveDetail'],
  data:()=>({
    //editing
    editing: false,
    my:{
      name: '',
      amount: 0,
      cycle: '',
      employees:[],
    },
    //control dialogs
    dialog: false,
    //searching values
    employeeName: '',
    //else
    postType:{
      employee: 'employee',
    }
  }),
  computed:{
    selectableEmployees(){
      var x = this.employees
      return this.allEmployees.filter(e=>!x.includes(e));
    },
    ...mapGetters({
      allEmployees: 'employee/getEmployees',
      employeeGetter: 'employee/getEmployeesById',
      leaveGetter: 'leave/getLeaveById',
    }),
    ...mapState('leave', ['cycleType']),
    employees(){return this.employeeGetter(this.my.employees)},
  },
  methods:{
    delChange() {
      this.editing = false;
      this.my = JSON.parse(JSON.stringify(
        this.leaveGetter(this.$route.params.id)
      ));
    },
    saveChange(isNew) {
      this.editing = false;
      var method = '';
      isNew ? method='newLeave': method='changeData';
      this.$store.dispatch(`leave/${method}`, this.my);
    },
    addEmployees(emp){
      Vue.set(this.my, 'employees', this.my.employees.concat(emp));
      this.postData(this.postType.employee);
    },
    removeEmployee(emp){
      if(confirm(`ให้พนักงาน ${emp.name} เลิกใช้วันลาประเภท ${this.my.name}`)){
        this.my.employees = this.my.employees.filter(e => e !== emp.id);
        if(this.$refs.employee){
          this.$refs.employee.reset();
        }
        this.postData(this.postType.employee);
      }
    },
    postData(type){
      if(this.$route.params.id){
        if(type === this.postType.employee){
          this.$store.dispatch('leave/setEmployees', this.my);
        }
      }
    }
  },
  watch: {
    leaveDetail(val){this.my = JSON.parse(JSON.stringify(val))}
  },
  created() {
    if (this.$route.params.id) {
      this.leaveDetail !== undefined
      ? this.my = JSON.parse(JSON.stringify(this.leaveDetail))
      : this.my = {
        name: '',
        amount: '',
        employees: []
      }
    } else {
        this.editing = true
    }
  },
}
</script>
