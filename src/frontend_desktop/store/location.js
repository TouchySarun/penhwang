import axios from "axios"
import API from "~/api"
import Vue from 'vue'

export const state = () => ({
  // ข้อมูล
  allLocations:{
    fake:{
      id: "fake", name:"home",
      lat: 13.746774, lng: 100.5348332, error: 50.0,
      employees:["sommai","somkong","somporn", "somchai", "somying"]
    }
  },
  maxError: 200,
  minError: 50,
})

export const mutations = {
  SET_ALL_LOCATION(state, payload){
    Vue.set(state, 'allLocations', payload);
  },
  SET_DATA(state, payload){
    Vue.set(state.allLocations, payload.id, payload);
  },
  DELETE_LOCATION(state, payload){
    const copy = {...state.allLocations};
    delete copy[payload.id];
    Vue.set(state, 'allLocations', copy);
  },
  SET_EMPLOYEES(state, payload){
    Vue.set(state.allLocations[payload.id], 'employees', payload.employees);
  }
}

export const actions = {
  // ทำงานร่วมกับ backend (cleaning data)
  getAllLocation({commit}){
    return this.$axios.$post(API.locations,  {token:this.$cookies.get('token')})
    .then(res =>
      res.isSuccess
      ? commit('SET_ALL_LOCATION', res.data.locations)
      : console.log(res)
    )
    .catch(err =>
      console.log(err)
    )
  },
  changeData({commit}, location){
    const data = {
      token: this.$cookies.get('token'),
      locationId: location.id,
      locationDetail:{
        name: location.name,
        lat: location.lat,
        lng: location.lng,
        error: location.error,
      }
    };
    this.$axios.$post(API.locationEdit, data)
    .then(res => {
      if(res.isSuccess) {
        commit('SET_DATA', location);
        return true
      }else{
        console.log(res.data)
        return false
      }
    })
    .catch(err => {
      console.log(err);
    })
  },
  newLocation({commit}, location){
    const data = {
      token: this.$cookies.get('token'),
      name: location.name,
      lat: location.lat,
      lng: location.lng,
      error: location.error,
      employees: location.employees
    }
    this.$axios.$post(API.locationAdd, data)
    .then( res => {
      if (res.isSuccess) {
        location.id = res.data.id;
        commit('SET_DATA', location);
      } else {
        console.log(res.data)
      }
    })
    .catch(err => console.log(err))
  },
  deleteLocation({commit}, location){
    const data = {
      token: this.$cookies.get('token'),
      locationId: location.id,
    }
    this.$axios.$post(API.locationDelete, data)
    .then( res => {
      if (res.isSuccess) {
        commit('DELETE_LOCATION', location);
      } else {
        console.log(res.data)
      }
    })
    .catch(err => console.log(err))
  },
  setEmployees({commit}, location){
    const data = {
      token: this.$cookies.get('token'),
      locationId: location.id,
      employees: location.employees,
    }
    this.$axios.$post(API.locationUpdateEmployees, data)
    .then(res =>
      (res.isSuccess)
      ? commit('SET_EMPLOYEES', location)
      : console.log(`error when send request to backend ${JSON.stringify(res)}`)
    )
    .catch (err => console.log(err))
  }
}

export const getters = {
  getLocations(state){
    const x = state.allLocations;
    var res = [];
    Object.keys(x).forEach(function(k){
      res.push(x[k]);
    });
    return res;
  },
  getLocationById: (state) => (id) => {
    return state.allLocations[id];
  },
  getLocationsById: (state) => (id) => {
    var res = [];
    id.forEach(i => {
      res.push(state.allLocations[i]);
    })
    return res;
  },
  getLocationName: (state) => {
    const x = state.allLocations;
    var res = [];
    Object.keys(x).forEach(function(k){
      res.push(x[k].name);
    });
    return res;
  },

}
