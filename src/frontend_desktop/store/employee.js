import Vuex from "vuex"
import axios from "axios"
import API from "~/api"
import Vue from "vue"

export const state = () => ({
  // ข้อมูล
  allEmployees:{
    fake:{
      id:"fake",
      name:"สมทัช มัดใจ",
      role: "เจ้าของบริษัท",
      pos: "หัวหน้าพนักงาน",
      tel: "0800000000",
      salary: { type: "ประจำ", amount: 20000},
      lineId:"mock_lineId",
      email:"sample@email.com",
      img:"https://sprofile.line-scdn.net/0hFOWKo3F_GWB6MjBtSolnHwpiGgpZQ0ByV1ReU0wyE1gXBQ1mUlJSBk4xF1JGBVhmVFVUDh1lRwN2IW4GZGTlVH0CR1dDB1YzUF1fhQ"
    },
  },
  types:[
    "ประจำ",
    "รายวัน",
  ],
  workHour:[],
  attendance:[],
})

export const mutations = {
  SET_ALL_EMPLOYEE(state, payload){
    Vue.set(state, 'allEmployees', payload);
  },
  SET_DATA(state, payload){
    Vue.set(state.allEmployees, payload.id, payload);
  },
  DELETE_EMPLOYEE(state, payload){
    const copy = {...state.allEmployees};
    delete copy[payload.id];
    Vue.set(state, 'allEmployees', copy);
  },
  SET_WORKHOUR(state, payload){
    state.workHour = payload;
  },
  SET_ATTENDANCE(state, payload){
    Vue.set(state, 'attendance', payload);
  }
}

export const actions = {
  async getEmployees({commit}){
    return this.$axios.$post(API.getEmployees, {token:this.$cookies.get('token')})
    .then(res =>
      res.isSuccess
      ? commit('SET_ALL_EMPLOYEE', res.data.employees)
      : console.log(`get all emp ${JSON.stringify(res)}`)
    )
    .catch(err => console.log(err))
  },
  async getWorkHour({commit}, payload){
    const data = {
      token: this.$cookies.get('token'),
      ...payload
    };
    await this.$axios.$post(API.getEmployeeWorkHour, data)
    .then(res => {
      res.isSuccess
      ? commit('SET_WORKHOUR', res.data.workHour) // res.data
      : console.log(`get all emp ${JSON.stringify(res)}`)
    })
    .catch(err => {
      console.log(err);
    })
  },
  clearWorkHour({commit}){
    commit('SET_WORKHOUR', []);
  },
  async getAttendance({commit}, payload){
    const da = payload.date.split('-');
    const data = {
      token: this.$cookies.get('token'),
      start: new Date(da[0], parseInt(da[1] - 1), 1),
      end: new Date(da[0], parseInt(da[1]), 0)
    }
    return this.$axios.$post(API.getEmployeeAttendance, data)
    .then(res =>
      res.isSuccess
      ? commit('SET_ATTENDANCE', res.data.attendance)
      : console.log(res)
    )
    .catch(err => console.err(err))
  },
  setData({commit}, employee){
    const data = {
      token: this.$cookies.get('token'),
      empId: employee.id,
      employeeDetail:{
        name: employee.name,
        pos: employee.pos,
        salary: employee.salary,
        email: employee.email,
        tel: employee.tel,
        lineId: employee.lineId
      }
    };
    return this.$axios.$post(API.employeeEdit, data)
    .then(res =>
      res.isSuccess
      ? commit('SET_DATA', employee)
      : console.log(res)
    )
    .catch(err =>  console.log(err))
  },
  deleteEmployee({commit}, employee){
    const data = {
      token: this.$cookies.get('token'),
      employeeId: employee.id,
    }
    this.$axios.$post(API.employeeDelete, data)
    .then( res => {
      res.isSuccess
      ? commit('DELETE_EMPLOYEE', employee)
      : console.log(res.data)
    })
    .catch(err => console.log(err))
  }
}

export const getters = {
  getEmployees(state){
    const x = state.allEmployees;
    var res = [];
    Object.keys(x).forEach(function(k){
      res.push(x[k]);
    });
    return res;
  },
  getEmployeeById: (state) => (id) => {
    return state.allEmployees[id];
  },
  getEmployeesById: (state) => (id) => {
    var res = [];
    id.forEach(i => {
      res.push(state.allEmployees[i]);
    })
    return res;
  },
  getTypes: (state) => {
    var t = JSON.parse(JSON.stringify(state.types));
    t.unshift('ทั้งหมด');
    return t;
  },
}
