import Vuex from "vuex"
import axios from "axios"
import API from "~/api"
import Vue from 'vue'

export const state = () => ({
  // ข้อมูล
  company: {
    "passcode": 'fake',
    "name": "ซมซานเทค",
    "tel": "0811111111",
    "email": "example@mail.com",
    "address": {
      "building":"30 ปี",
      "room":"422",
      "floor":"4",
      "houseNo": "",
      "villageNo": "",
      "lane": "",
      "road": "",
      "subDistrict": "สุเทพ",
      "district": "เมืองเชียงใหม่",
      "province": "เชียงใหม่",
      "postalCode": "50200"
    }
  }
})

export const mutations = {
  // จัดการข้อมูลใน state
  SET_COMPANY(state, company) {
    Vue.set(state, 'company', company);
  },
  SET_MANAGERS(state, managers) {
    Vue.set(state.company, 'managers', managers);
  }
}

export const actions = {
  // ทำงานร่วมกับ backend (cleaning data)
  async get({ commit }){
    try {
      const res = await this.$axios.$post(API.getCompany,  {token:this.$cookies.get('token')})
      if(res.isSuccess) {
        commit('SET_COMPANY', res.data);
        return true
      }else{
        return false
      }
    } catch (error) {
      console.log(error);
      return false
    }
  },
  async changeData({commit}, company){
    company.token = this.$cookies.get('token')
    try{
      const res = await this.$axios.$post(API.companyEdit, company)
      if(res.isSuccess) {
        commit('SET_COMPANY', company)
        return true
      }else{
        console.log(res);
        return false
      }
    } catch (err) {
      console.log(err);
      return false
    }
  },
  async deleteCompany({commit}, passcode){
    try{
      const res = await this.$axios.$post(API.companyDelete, passcode)
      if(res.isSuccess){
        commit('SET_COMPANY', {})
        return true;
      }else{
        return false;
      }
    } catch (err) {
      return false;
    }
  },
  async setManagers({commit}, {passcode, managers}){
    const data = {
      token: this.$cookies.get('token'),
      passcode,
      managers
    }
    console.log(data);
      return await this.$axios.$post(API.companyUpdateManager, data)
      .then(res =>
        res.isSuccess
        ? commit('SET_MANAGERS', managers)
        : console.error(res)
      )
      .catch (err => console.err(err))
  }
}

export const getters = {
  getCompany(state) {
    return state.company
  }
}
