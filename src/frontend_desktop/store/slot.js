import axios from "axios"
import API from "~/api"
import Vue from 'vue'

export const state = () => ({
  // ข้อมูล
  allSlots: {
    fake:{
      id:"fake", name: "กะเช้า",
      time: [
        {day_of_week:0,in: undefined,out: undefined,},
        {day_of_week:1,in: '08:00',out: '17:00',},
        {day_of_week:2,in: '08:00',out: '17:00',},
        {day_of_week:3,in: undefined,out: undefined,},
        {day_of_week:4,in: '08:00',out: '17:00',},
        {day_of_week:5,in: '08:00',out: '17:00',},
        {day_of_week:6,in: '08:00',out: '17:00',},
      ]
    }
  }
})

export const mutations = {
  SET_ALL_SLOTS(state, payload) {
    Vue.set(state, 'allSlots', payload);
  },
  SET_DATA(state, payload){
    Vue.set(state.allSlots, payload.id, payload);
  },
  DELETE_SLOT(state, payload){
    const copy = {...state.allSlots};
    delete copy[payload.id];
    Vue.set(state, 'allSlots', copy);
  },
  SET_EMPLOYEES(state, payload){
    Vue.set(state.allSlots[payload.slotId], 'employees', payload.employees);
  },
  ADD_SLOT(state, payload){
    Vue.set(state.allSlots, payload.id, payload);
  }
}

export const actions = {
  // ทำงานร่วมกับ backend (cleaning data)
  getAllSlot({commit}){
    return this.$axios.$post(API.slots, {token:this.$cookies.get('token')})
    .then(res =>
      res.isSuccess
      ? commit('SET_ALL_SLOTS', res.data.slots)
      : console.log(res)
    )
    .catch(err =>
      console.log(err)
    )
  },
  changeData({commit}, {slotId,employees,name,lateAfter,time}){
    this.$axios.$post(API.slotEdit, {
      token: this.$cookies.get('token'),
      slotId,
      employees,
      slotData:{
        name,
        lateAfter,
        time
      }
    })
    .then(res => {
      if(res.isSuccess) {
        commit('SET_DATA', {id:slotId,name,lateAfter,time,employees});
        return true
      }else{
        return false
      }
    })
    .catch(err => {
      console.log(err);
    })
  },
  newSlot({commit}, slot){
    this.$axios.$post(API.slotAdd, slot)
    .then( res => {
      if (res.isSuccess) {
        slot.id = res.data.id;
        commit('ADD_SLOT', slot);
      } else {
        console.log(res.data)
      }
    })
    .catch(err => console.log(err))
  },
  deleteSlot({commit}, slot){
    const data = {
      token: slot.token,
      slotId: slot.id,
      employees: slot.employees,
    }
    this.$axios.$post(API.slotDelete, data)
    .then( res => {
      if (res.isSuccess) {
        commit('DELETE_SLOT', slot);
      } else {
        console.log(res.data)
      }
    })
    .catch(err => console.log(err))
  },
  setEmployees({commit}, slot){
    this.$axios.$post(API.slotUpdateEmployees, slot)
    .then(res =>
      (res.isSuccess)
      ? commit('SET_EMPLOYEES', slot)
      : console.log(res)
    )
    .catch (err => console.log(err))
  }
}

export const getters = {
  getSlots(state){
    const x = state.allSlots;
    var res = [];
    Object.keys(x).forEach(function(k){
      res.push({
        id:k,
        ...x[k]
      });
    });
    return res;
  },
  getSlotById: (state) => (id) => {
    return state.allSlots[id];
  },
  getSlotsById: (state) => (id) => {
    var res = [];
    id.forEach(i => {
      res.push(state.allSlots[i]);
    })
    return res;
  },
  getSlotsName: (state) => {
    const x = state.allSlots;
    var res = [];
    Object.keys(x).forEach(function(k){
      res.push(x[k].name);
    });
    return res;
  },

}
