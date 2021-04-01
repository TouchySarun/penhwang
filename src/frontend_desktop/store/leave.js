import axios from "axios"
import API from "~/api"
import Vue from 'vue'

export const state = () => ({
  // ข้อมูล
  allLeaves:{
    fake:{
      id:"fake", name: "ลากิจ",
      amount: 10, cycle: "เดือน",
      employees: ["sommai","somkong","somporn", "somchai", "somying"]
    }
  },
  cycleType:[
    'ปี','เดือน'
  ],
  rights:[
    {
      name: 'fake',
      used: 3,
      balance: 18,
    },
    // {
    //   name: 'ลากิจ',
    //   used: 0,
    //   balance: 15,
    // },
    // {
    //   name: 'ลาพักร้อน',
    //   used: 3,
    //   balance: 14,
    // },
  ]
})

export const mutations = {
  SET_ALL_LEAVE(state, payload){
    Vue.set(state, 'allLeaves', payload);
  },
  SET_DATA(state, payload){
    Vue.set(state.allLeaves, payload.id, payload);
  },
  DELETE_LEAVE(state, payload){
    const copy = {...state.allLeaves};
    delete copy[payload.id];
    Vue.set(state, 'allLeaves', copy);
  },
  SET_EMPLOYEES(state, payload){
    Vue.set(state.allLeaves[payload.id], 'employees', payload.employees);
  },
  SET_RIGHTS(state, payload){
    Vue.set(state, 'rights', payload);
  }
}

export const actions = {
  // ทำงานร่วมกับ backend (cleaning data)
  getAllLeave({commit}){
    return this.$axios.$post(API.leaves, {token:this.$cookies.get('token')})
    .then(res => {
      res.isSuccess
      ? commit('SET_ALL_LEAVE', res.data.leaves)
      : console.log(`get all leave ${JSON.stringify(res)}`)
    })
    .catch(err => {
      console.log(err);
    })
  },
  changeData({commit}, leave){
    const data = {
      token: this.$cookies.get('token'),
      leaveId: leave.id,
      leaveData:{
        name: leave.name,
        amount: leave.amount
      }
    };
    this.$axios.$post(API.leaveEdit, data)
    .then(res => {
      res.isSuccess
      ? commit('SET_DATA', leave)
      : console.log(`leave change data ${JSON.stringify(res.data)}`)
    })
    .catch(err => {
      console.log(err);
    })
  },
  newLeave({commit}, leave){
    const data = {
      token: this.$cookies.get('token'),
      name: leave.name,
      amount: leave.amount,
      employees: leave.employees
    }
    this.$axios.$post(API.leaveAdd, data)
    .then( res => {
      if (res.isSuccess) {
        leave.id = res.data.id;
        commit('SET_DATA', leave);
      } else {
        console.log(res.data)
      }
    })
    .catch(err => console.log(err))
  },
  deleteLeave({commit}, leave){
    const data = {
      token: this.$cookies.get('token'),
      leaveId: leave.id,
    }
    this.$axios.$post(API.leaveDelete, data)
    .then( res => {
      res.isSuccess
      ? commit('DELETE_Leave', leave)
      : console.log(res.data)
    })
    .catch(err => console.log(err))
  },
  setEmployees({commit}, leave){
    const data = {
      token: this.$cookies.get('token'),
      leaveId: leave.id,
      employees: leave.employees,
    }
    this.$axios.$post(API.leaveUpdateEmployees, data)
    .then(res =>
      (res.isSuccess)
      ? commit('SET_EMPLOYEES', leave)
      : console.log(`location set emp ${JSON.stringify(res)}`)
    )
    .catch (err => console.log(err))
  },
  getLeaveRights({commit}, employeeId){
    return this.$axios.$post(API.getLeaveRight(employeeId))
    .then(res =>
      (res.isSuccess)
      ? commit('SET_RIGHTS', res.data.leaves)
      : console.log(`location set emp ${JSON.stringify(res)}`)
    )
    .catch (err => console.log(err))
  }
}

export const getters = {
  getLeaves(state){
    const x = state.allLeaves;
    var res = [];
    Object.keys(x).forEach(function(k){
      res.push(x[k]);
    });
    return res;
  },
  getLeaveById: (state) => (id) => {
    return state.allLeaves[id];
  },
  getLeavesById: (state) => (id) => {
    var res = [];
    id.forEach(i => {
      res.push(state.allLeaves[i]);
    })
    return res;
  },
  getLeaveName: (state) => {
    const x = state.allLeaves;
    var res = [];
    Object.keys(x).forEach(function(k){
      res.push(x[k].name);
    });
    return res;
  },

}
