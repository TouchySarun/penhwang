<template>
  <v-card>
    <slot name="header">
      <v-card-title style="justify-content: space-between">
        <h2>แผนก {{my.name}}</h2>
      </v-card-title>
    </slot>
    <v-card-text>
      <v-row>
        <v-col cols="7">
          <v-form style="border: solid 0.8px #00000030; border-radius: 5px; padding: 2%; margin-bottom: 2%;">
            <div style="float: right;" v-if="$route.params.id">
              <v-btn v-if="editing" color="error" @click="delChange" outlined>ยกเลิก</v-btn>
              <v-btn v-if="editing" color="success" @click="saveChange(false)">บันทึก</v-btn>
              <v-btn v-else color="info" @click="editing=true">แก้ไข</v-btn>
            </div>
            <v-text-field
              v-model="my.name"
              label="ชื่อ"
              :readonly="!editing"
            ></v-text-field>
            <v-textarea
              v-model="my.description"
              label="รายละเอียด"
              :readonly="!editing"
            ></v-textarea>
          </v-form>
          <v-card>
            <v-card-title>
              กะที่สามารถใช้งานได้
            </v-card-title>
            <slot-home
              :slots="slots"
              :search="slotName"
              @deleteSlot="slot => removeSlot(slot)"
            >
              <template v-slot="">
                <v-card-title>
                  <v-text-field
                    v-model="slotName"
                    append-icon="mdi-magnify"
                    label="ชื่อกะ"
                    single-line
                  ></v-text-field>
                  <v-dialog v-model="dialog" width="800">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="green" dark v-bind="attrs" v-on="on">
                        เพิ่มกะ
                      </v-btn>
                    </template>
                    <slot-selector
                      ref="slot"
                      :items="selectableSlots"
                      @closeTab="dialog = false;"
                      @saveData="(d)=>{
                        dialog = false;
                        addSlots(d);
                      }"
                    />
                  </v-dialog>
                </v-card-title>
              </template>
            </slot-home>
          </v-card>
        </v-col>
        <v-col cols="5">
          <v-text-field v-model="employeeName" label="ค้นหาพนักงาน"></v-text-field>
          <employee-home
            :employees="managers"
            :search="employeeName"
            @deleteEmployee="d => removeManager(d)"
            style="overflow: auto; max-height: 45vh; margin-bottom: 2%;">
            <template v-slot="">
              <v-card-title>
                <span>หัวหน้าแผนก</span>
                <v-spacer></v-spacer>
                <v-dialog v-model="managerDialog" width="800">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="green" dark v-bind="attrs" v-on="on">
                      เพิ่มหัวหน้า
                    </v-btn>
                  </template>
                  <employee-selector
                    ref="manager"
                    :items="selectableManagers"
                    @closeTab="managerDialog = false;"
                    @saveData="(d)=>{
                      managerDialog = false;
                      addManagers(d);
                    }"
                  />
                </v-dialog>
              </v-card-title>
            </template>
          </employee-home>
          <employee-home
            :employees="employees"
            :search="employeeName"
            @deleteEmployee="d => removeEmployee(d)">
            <template v-slot="">
              <v-card-title>
                <span>พนักงานในแผนก</span>
                <v-spacer></v-spacer>
                <v-dialog v-model="empDialog" width="800">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="green" dark v-bind="attrs" v-on="on">
                      เพิ่มพนักงาน
                    </v-btn>
                  </template>
                  <employee-selector
                    ref="employee"
                    :items="selectableEmployees"
                    @closeTab="empDialog = false;"
                    @saveData="(d)=>{
                      empDialog = false;
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
import SlotHome from '~/components/slot/SlotHome.vue';
import { mapGetters } from 'vuex';
import Vue from 'vue';

export default {
  components: { SlotHome, EmployeeSelector },
  props: ['roleDetail'],
  data:()=>({
    //editing
    editing: false,
    //มี my data เพราะ ตอน editing จะได้ delchange ได้
    my:{
      name:'',
      description:'',
      managers: [],
      employees: [],
      slots: []
    },
    //control dialogs
    dialog: false,
    managerDialog: false,
    empDialog: false,
    //searching values
    employeeName: '',
    slotName: '',
    //else
    postType:{
      employee:'employee',
      manager:'manager',
      slot:'slot',
      all:'all',
    }
  }),
  computed:{
    selectableManagers(){
      const x = this.managers;
      const y = this.employees;
      return this.allEmployees.filter(e=>(!x.includes(e) && !y.includes(e)));
    },
    selectableEmployees(){
      const x = this.managers;
      const y = this.employees;
      return this.allEmployees.filter(e=>(!x.includes(e) && !y.includes(e)));
    },
    selectableSlots(){
      const x = this.slots;
      return this.allSlots.filter(e=>!x.includes(e));
    },
    ...mapGetters({
      allEmployees: 'employee/getEmployees',
      allSlots: 'slot/getSlots',
      employeeGetter: 'employee/getEmployeesById',
      slotGetter: 'slot/getSlotsById',
      roleGetter: 'myrole/getRoleById',
    }),
    managers(){return this.employeeGetter(this.my.managers)},
    employees(){return this.employeeGetter(this.my.employees)},
    slots(){return this.slotGetter(this.my.slots)},
  },
  methods:{
    delChange() {
      this.editing = false;
      this.my = JSON.parse(JSON.stringify(this.roleGetter(this.$route.params.id)));
    },
    saveChange(isNew) {
      this.editing = false;
      var method = '';
      isNew ? method='newRole' : method='changeData';
      this.$store.dispatch(`myrole/${method}`, this.my);
    },
    addSlots(slots) {
      Vue.set(this.my, 'slots', this.my.slots.concat(slots));
      this.postData(this.postType.slot);
    },
    removeSlot(slot){
      if(confirm(`นำ ${slot.name} ออกจากแผนก ${this.my.name}`)){
        this.my.slots = this.my.slots.filter(m => m !== slot.id);
        this.postData(this.postType.slot);
        if(this.$refs.slot){
          this.$refs.slot.reset();
        }
      }
    },
    addManagers(managers) {
      Vue.set(this.my, 'managers', this.my.managers.concat(managers));
      this.postData(this.postType.manager);
    },
    removeManager(manager) {
      if(confirm(`นำ ${manager.name} ออกจากหัวหน้าแผนก ${this.my.name}`)){
        this.my.managers = this.my.managers.filter(m => m !== manager.id);
        this.postData(this.postType.manager);
        if(this.$refs.manager){
          this.$refs.manager.reset();
        }
      }
    },
    addEmployees(employees){
      Vue.set(this.my, 'employees', this.my.employees.concat(employees));
      this.postData(this.postType.employee);
    },
    removeEmployee(emp){
      if(confirm(`นำ ${emp.name} ออกจากแผนก ${this.my.name}`)){
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
          this.$store.dispatch('myrole/setEmployees', this.my);
        }else if(type === this.postType.manager){
          this.$store.dispatch('myrole/setManagers', this.my);
        }else if(type === this.postType.slot){
          this.$store.dispatch('myrole/setSlots', this.my);
        }
      }
    },
  },
  watch: {
    roleDetail: function (val) {this.my = JSON.parse(JSON.stringify(val))}
  },
  created() {
    if (this.$route.params.id) {
      this.roleDetail !== undefined
      ? this.my = JSON.parse(JSON.stringify(this.roleDetail))
      : this.my = {
        name: '',
        description: '',
        employees: [],
        managers: [],
        slots: []
      }
    } else {
        this.editing = true
    }
  },
}
</script>

