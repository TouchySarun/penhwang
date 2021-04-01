<template>
  <div>
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title><h2>บริษัท</h2></v-toolbar-title>
      <template v-slot:extension>
        <v-tabs v-model="tab">
          <v-tab><v-icon left> mdi-home-modern</v-icon>ข้อมูลบริษัท</v-tab>
          <v-tab><v-icon left> mdi-account-multiple</v-icon>ผู้จัดการ</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-container>
      <v-tabs-items v-model="tab" v-if="!loading">
        <v-tab-item>
          <v-row>
            <v-col cols="9">
              <important-obj
                header="Passcode ของบริษัท คือ"
                :highlight="this.company.passcode"
                icon="mdi-home-modern"
                text="กรุณาแจ้งพนักงานให้ใช้รหัสผ่านนี้ในการเชื่อมต่อกับบริษัทของคุณ"
                color="orange darken-1"
                :outlined="false"
              />
              <v-card class="companyData">
                <v-card-title style="justify-content: space-between">
                  ข้อมูลบริษัท
                  <div style="display: flex">
                    <v-btn
                      outlined
                      icon
                      color="info"
                      :class="editing ? 'hide-btn' : ''"
                      @click="editing = true"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      outlined
                      color="red"
                      :class="editing ? '' : 'hide-btn'"
                      @click="editing = false"
                    >
                      ยกเลิก
                    </v-btn>
                    <v-btn
                      :icon="!editing"
                      color="success"
                      :class="editing ? '' : 'hide-btn'"
                      @click="
                        editing = false
                        saveData()
                      "
                    >
                      บันทึก
                    </v-btn>
                  </div>
                </v-card-title>
                <Details
                  ref="details"
                  :editing="editing"
                  :items="myDetails"
                  @dataChange="(d) => saveData(d)"
                />
              </v-card>
              <v-btn
                @click="deleteCompany()"
                block
                outlined
                color="error"
                style="margin: 1vh 0;"
              >ลบบริษัท</v-btn>
            </v-col>
            <v-col>
              <v-card style="width: fit-content">
                <v-card-title>QR Code ของน้องเป็นห่วง</v-card-title>
                <v-divider></v-divider>
                <v-card-text style="text-align: center">
                  <v-img
                    src="https://qr-official.line.me/sid/L/253shagi.png"
                    width="200"
                    height="200"
                  ></v-img>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item>
          <v-text-field
            v-model="employeeName"
            label="ค้นหาพนักงาน"
          ></v-text-field>
          <employee-home
            :employees="managers"
            :search="employeeName"
            @deleteEmployee="(d) => removeManager(d)"
          >
            <template v-slot="">
              <v-card-title>
                <span>ผู้จัดการ</span>
                <v-spacer></v-spacer>
                <v-dialog v-model="managerDialog" width="800">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="green" dark v-bind="attrs" v-on="on">
                      เพิ่มผู้จัดการ
                    </v-btn>
                  </template>
                  <employee-selector
                    ref="manager"
                    :items="selectableManagers"
                    @closeTab="managerDialog = false"
                    @saveData="
                      (d) => {
                        managerDialog = false;
                        addManagers(d);
                      }
                    "
                  />
                </v-dialog>
              </v-card-title>
            </template>
          </employee-home>
        </v-tab-item>
      </v-tabs-items>
      <div style="margin: 1vh 0"></div>
    </v-container>
  </div>
</template>
<script>
import EmployeeHome from '~/components/employee/EmployeeHome.vue'
import importantObj from '~/components/company/importantObj.vue'
import Details from '~/components/company/Details.vue'
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import Vue from 'vue'
export default {
  components: { importantObj, Details, EmployeeHome },
  data: () => ({
    editing: false,
    tab: null,
    managerDialog: false,
    employeeName: '',
    myManagers: [],
    loading: true,
  }),
  computed: {
    ...mapState('company', ['company']),
    ...mapGetters({
      allEmployees: 'employee/getEmployees',
      employeeGetter: 'employee/getEmployeesById',
    }),
    myDetails() {
      return [
        {
          att: 'name',
          icon: 'mdi-home',
          label: 'ชื่อบริษัท ',
          data: this.company.name,
          color: 'primary',
          type: 'norm',
        },
        {
          att: 'tel',
          icon: 'mdi-phone',
          label: 'เบอร์ติดต่อ ',
          data: this.company.tel,
          color: 'success',
          type: 'norm',
        },
        {
          att: 'email',
          icon: 'mdi-email',
          label: 'อีเมล ',
          data: this.company.email,
          color: 'info',
          type: 'norm',
        },
        {
          att: 'address',
          icon: 'mdi-map-marker',
          label: 'ที่อยู่ ',
          data: this.company.address,
          color: 'error',
          type: 'address',
        },
      ]
    },
    selectableManagers() {
      const x = this.managers
      return this.allEmployees.filter((e) => !x.includes(e))
    },
    managers() {
      return this.employeeGetter(this.myManagers)
    },
  },
  methods: {
    saveData(){
      var company = this.$refs.details.saveData();
      company.passcode = this.company.passcode;
      this.$store.dispatch('company/changeData', company);
    },
    deleteCompany(){
      if(confirm('ลบบริษัท ?!?!?!')){
        this.$store.dispatch('company/delete', this.company.passcode);
      }
    },
    addManagers(managers) {
      Vue.set(this, 'myManagers', this.myManagers.concat(managers));
      this.$store.dispatch('company/setManagers', {passcode: this.company.passcode, managers: this.myManagers});
    },
    removeManager(manager) {
      if (confirm(`นำ ${manager.name} ออกจากตำแหน่ง`)) {
        this.myManagers = this.myManagers.filter((m) => m !== manager.id)
        this.$store.dispatch('company/setManagers', {passcode: this.company.passcode, managers:this.myManagers})
        if (this.$refs.manager) {
          this.$refs.manager.reset()
        }
      }
    },
  },
  // async beforeMount() {
  //   await this.$store.dispatch('company/get');
  //   this.myManagers = JSON.parse(JSON.stringify(this.company.managers));
  // },
  mounted(){
    this.$nextTick( async () => {
      this.$nuxt.$loading.start()
      await Promise.all([
        this.$store.dispatch('company/get'),
        this.$store.dispatch('employee/getEmployees')
      ])
      this.myManagers = JSON.parse(JSON.stringify(this.company.managers));
      this.loading = false;
      this.$nuxt.$loading.finish()
    })
  }
}
</script>
<style scoped lang="scss">
.companyData {
  button {
    transition: 0.5s;
    margin-left: 10px;
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
}
</style>
