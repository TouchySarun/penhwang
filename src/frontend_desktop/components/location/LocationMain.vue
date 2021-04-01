<template>
  <v-card>
    <slot name="header">
      <v-card-title>
        <h2>จุดลงเวลา {{my.name}}</h2>
      </v-card-title>
    </slot>
    <v-card-text>
      <v-row>
        <v-col cols="7">
          <v-form
            ref="form"
            lazy-validation
            style="border: solid 0.8px #00000030; border-radius: 5px; padding: 2%; margin-bottom: 2%;"
          >
            <div style="float:right;" v-if="$route.params.id">
              <v-btn v-if="editing" color="error" @click="delChange">ยกเลิก</v-btn>
              <v-btn v-if="editing" color="success" @click="saveChange(false)">บันทึก</v-btn>
              <v-btn v-else color="info" @click="editing=true">แก้ไข</v-btn>
            </div>
            <v-text-field
              v-model="my.name"
              label="ชื่อ"
              :readonly="!editing"
            ></v-text-field>
            <br>
              <v-slider
                v-model="my.error"
                label="ห่างได้ (เมตร)"
                color="warning"
                thumb-color="warning"
                thumb-label="always"
                style="min-width: 200px;"
                :max="maxError"
                :min="minError"
                :readonly="!editing"
              ></v-slider>
          </v-form>
          <my-gmap :center="tempCenter" :editing="editing"
            @update="(d)=>{
              my.lat=d.lat();
              my.lng=d.lng();
            }"/>
        </v-col>
        <v-col cols="5">
          <v-text-field v-model="employeeName" label="ค้นหาพนักงาน"></v-text-field>
          <employee-home
            :employees="employees"
            :search="employeeName"
            @deleteEmployee="d => removeEmployee(d)">
            <template v-slot="">
              <v-card-title>
                <span>พนักงานที่ใช้จุดลงเวลานี้อยู่</span>
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
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import EmployeeSelector from '~/components/employee/EmployeeSelector.vue';
import { mapState, mapGetters } from 'vuex';
import Vue from 'vue';
import MyGmap from './MyGmap.vue';

export default {
  components: { EmployeeSelector, MyGmap },
  props: ['locationDetail'],
  data:()=>({
    //use to gmap "high speed drag" bug
    tempCenter:{lat:0,lng:0},
    //editing
    editing: false,
    my:{
      id:'',
      name: '',
      error: 50,
      lat: 13.746774,
      lng: 100.5348332,
      employees:[]
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
    ...mapState('location',['maxError', 'minError']),
    ...mapGetters({
      allEmployees: 'employee/getEmployees',
      employeeGetter: 'employee/getEmployeesById',
      locationGetter: 'location/getLocationById',
    }),
    employees(){return this.employeeGetter(this.my.employees)},
  },
  methods:{
    delChange() {
      this.editing = false;
      this.my = JSON.parse(JSON.stringify(this.locationGetter(this.$route.params.id)));
    },
    saveChange(isNew) {
      this.editing = false;
      var method = ''
      isNew ? method='newLocation': method='changeData';
      this.$store.dispatch(`location/${method}`, this.my);
    },
    addEmployees(emp){
      Vue.set(this.my, 'employees', this.my.employees.concat(emp));
      this.postData(this.postType.employee);
    },
    removeEmployee(emp){
      if(confirm(`ให้พนักงาน ${emp.name} เลิกใช้ ${this.my.name}`)){
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
          this.$store.dispatch('location/setEmployees', this.my);
        }
      }
    }
  },
  created() {
    if (this.$route.params.id) {
      this.my = JSON.parse(JSON.stringify(this.locationDetail))
      this.tempCenter = {lat:this.locationDetail.lat, lng:this.locationDetail.lng};
    } else {
        this.editing = true
    }
  }
}
</script>
