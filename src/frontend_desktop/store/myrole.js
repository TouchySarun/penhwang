import axios from "axios"
import API from "~/api"
import Vue from 'vue'

export const state = () => ({
  // ข้อมูล
  allRoles:{
    fake:{id:"fake", name:"fake", description:"",
      managers: [],
      employees: [],
      slots:  []
    },
  },
})

export const mutations = {
  // จัดการข้อมูลใน state
  SET_ALL_ROLE(state, payload){
    Vue.set(state, 'allRoles', payload);
  },
  SET_DATA(state, payload){
    Vue.set(state.allRoles, payload.id, payload);
  },
  SET_ROLE_DATA(state, payload){
    state.allRoles[payload.id].name = payload.name;
    state.allRoles[payload.id].description = payload.description;
  },
  DELETE_ROLE(state, payload){
    const copy = {...state.allRoles}
    delete copy[payload.id];
    Vue.set(state, 'allRoles', copy);
  },
  SET_MANAGERS(state, payload){
    Vue.set(state.allRoles[payload.id], 'managers', payload.managers);
  },
  SET_EMPLOYEES(state, payload){
    Vue.set(state.allRoles[payload.id], 'employees', payload.employees);
  },
  SET_SLOTS(state, payload){
    Vue.set(state.allRoles[payload.id], 'slots', payload.slots);
  },
}

export const actions = {
  // ทำงานร่วมกับ backend (cleaning data)
  getAllRole({commit}){
    return this.$axios.$post(API.roles, {token:this.$cookies.get('token')})
    .then(res =>
      res.isSuccess
      ? commit('SET_ALL_ROLE', res.data.roles)
      : console.log(`get all leave ${JSON.stringify(res.data)}`)
    )
    .catch(err =>
      console.log(err)
    )
  },
  changeData({commit}, role){
    const data = {
      token: this.$cookies.get('token'),
      roleId: role.id,
      employees: role.employees,
      managers: role.managers,
      slots: role.slots,
      roleDetail:{
        name: role.name,
        description: role.description,
      }
    };
    this.$axios.$post(API.roleEdit, data)
    .then(res => {
      res.isSuccess
      ? commit('SET_DATA', role)
      : console.log(`role change data ${JSON.stringify(res.data)}`)
    })
    .catch(err => {
      console.log(err);
    })
  },
  newRole({commit}, role){
    //get id form backend
    const data = {
      token: this.$cookies.get('token'),
      name: role.name,
      description: role.description,
      employees: role.employees,
      managers: role.managers,
      slots: role.slots,
    }
    this.$axios.$post(API.roleAdd, data)
    .then( res => {
      if (res.isSuccess) {
        role.id = res.data.id;
        commit('SET_DATA', role);
      } else {
        console.log(res.data)
      }
    })
    .catch(err => console.log(err))
  },
  deleteRole({commit}, role){
    const data = {
      token: this.$cookies.get('token'),
      roleId: role.id,
    }
    this.$axios.$post(API.roleDelete, data)
    .then( res => {
      res.isSuccess
      ? commit('DELETE_ROLE', role)
      : console.log(res.data)
    })
    .catch(err => console.log(err))
  },
  setManagers({commit}, role){
    const data = {
      token: this.$cookies.get('token'),
      roleId: role.id,
      managers: role.managers,
    }
    this.$axios.$post(API.roleUpdateManagers, data)
    .then(res =>
      (res.isSuccess)
      ? commit('SET_MANAGERS', role)
      : console.log(`role set mng ${JSON.stringify(res)}`)
    )
    .catch (err => console.log(err))
  },
  setEmployees({commit}, role){
    const data = {
      token: this.$cookies.get('token'),
      roleId: role.id,
      employees: role.employees,
    }
    this.$axios.$post(API.roleUpdateEmployees, data)
    .then(res =>
      (res.isSuccess)
      ? commit('SET_EMPLOYEES', role)
      : console.log(`role set emp ${JSON.stringify(res)}`)
    )
    .catch (err => console.log(err))
  },
  setSlots({commit}, role){
    const data = {
      token: this.$cookies.get('token'),
      roleId: role.id,
      slots: role.slots,
    }
    this.$axios.$post(API.roleUpdateSlot, data)
    .then(res =>
      (res.isSuccess)
      ? commit('SET_SLOTS', role)
      : console.log(`role set slt ${JSON.stringify(res)}`)
    )
    .catch (err => console.log(err))
  }
}

export const getters = {
  getRoles: (state) => {
    const x = state.allRoles;
    var res = [];
    Object.keys(x).forEach(function(k){
      res.push(x[k]);
    });
    return res;
  },
  getRoleById: (state) => (id) => {
    return state.allRoles[id];
  },
  getRolesById: (state) => (id) => {
    var res = [];
    id.forEach(i => {
      res.push(state.allRoles[i]);
    })
    return res;
  },
  getRolesName: (state) => {
    const x = state.allRoles;
    var res = [];
    res.push('ทั้งหมด');
    Object.keys(x).forEach(function(k){
      res.push(x[k].name);
    });
    return res;
  },

}
