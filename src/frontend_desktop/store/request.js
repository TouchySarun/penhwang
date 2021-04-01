import axios from "axios"
import API from "~/api"
import Vue from 'vue'

// request = company/leave/request + company/changeShiftRequest + company/jobApplication
// leave type = ลา + เปลี่ยนกะ + เข้าร่วมบริษัท
export const state = () => ({
  // ข้อมูล
  test: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  allRequests: [
    {
      id: 'fake',
      owner: 'fake',// id
      name: '...',
      recipient: 'fake',// id
      isWatched: false, isConfirmed: false, requestTime: 'Sun Feb 21 2021 10:00:00 GMT+0700 (Indochina Time)', confirmedTime: '',
      reason: 'this is fake', confirmedReason: '',
      type: 'เข้าร่วม',
      leaveName: 'ลากิจ',
      start: 'Mon Feb 22 2021 08:00:00 GMT+0700 (Indochina Time)', end: 'Wed Feb 24 2021 08:00:00 GMT+0700 (Indochina Time)',
    }
  ],
})

export const mutations = {
  SET_AllREQUEST(state, payload){
    Vue.set(state, 'allRequests', payload);
  },
  SET_DATA(state, payload) {
    const x = () => {
      for(let i=0; i< state.allRequests.length; i++){
        if (state.allRequests[i].id === payload.id) {
          return i;
        }
      }
    }
    payload.request.isWatched = true;
    payload.request.isConfirmed = payload.isConfirmed;
    payload.request.confirmedTime = (new Date()).toString();
    Vue.set(state.allRequests, x(), payload.request);
  },
  NEW_REQUEST(state, payload) {
    state.allRequests.push(payload);
  }
}

export const actions = {
  // ทำงานร่วมกับ backend (cleaning data)
  getAllRequest({commit}){
    return this.$axios.$post(API.getAllRequest, {token:this.$cookies.get('token')} )
    .then(res =>
      res.isSuccess
      ? commit('SET_AllREQUEST', res.data.allRequests)
      : console.log(res)
    )
    .catch(err =>
      console.log(err)
    )
  },
  confirmRequest({ commit }, request) {
    request.recipient = this.$cookies.get('employeeId');
    if(!request.reason){request.reason = ''}
    if(!request.confirmedReason){request.confirmedReason = '-'}
    const api = (r) =>{ if(r.type ==='ลา'){
      return API.leaveManage(r.recipient,r.owner,r.id,r.leaveId,'true',r.confirmedReason)
    }else if(r.type ==='เปลี่ยนกะ'){
      return API.changeSlotManage(r.recipient,r.id,'true',r.confirmedReason)
    }else if(r.type ==='เข้าร่วม'){
      return API.jobApplicationManage(r.recipient, r.id, 'true')
    }}
    console.log(request);
    console.log("apiRequest" + api(request))
    this.$axios.$post(api(request))
    .then(res =>
      res.isSuccess
      ? commit('SET_DATA', { request, isConfirmed: true })
      : console.log(res)
    )
    .catch (err =>
      console.log(err)
    )
  },
  rejectRequest({ commit }, request) {
    request.recipient = this.$cookies.get('employeeId');
    if(!request.reason){request.reason = ''}
    if(!request.confirmedReason){request.confirmedReason = ''}
    const api = (r) =>{ if(r.type ==='ลา'){
      return API.leaveManage(r.recipient,r.owner,r.id,r.leaveId,'false',r.confirmedReason)
    }else if(r.type ==='เปลี่ยนกะ'){
      return API.changeSlotManage(r.recipient,r.id,'false',r.confirmedReason)
    }else if(r.type ==='เข้าร่วม'){
      return API.jobApplicationManage(r.recipient, r.id, 'false')
    }}
    console.log("apiRequest" + api(request))
    // commit('SET_DATA', { request, isConfirmed: false })
    this.$axios.$post(api(request))
    .then(res =>
      res.isSuccess
      ? commit('SET_DATA', { request, isConfirmed: false })
      : console.log(res)
    )
    .catch (err =>
      console.log(err)
    )
  },
  newRequest({ commit }, request) {
    request.id = 'newRequest';
    commit('NEW_REQUEST', request);
  },
}

export const getters = {
  getRequests(state) {
    var res = [];
    state.allRequests.forEach((req) => {
      if (!req.isWatched) {
        res.push(req);
      }
    });
    return res;
  },
  getWatchedRequests(state) {
    var res = [];
    state.allRequests.forEach((req) => {
      if (req.isWatched) {
        res.push(req);
      }
    });
    return res;
  },
  getJoinRequests(state) {
    var res = [];
    state.allRequests.forEach((req) => {
      if (req.type == 'เข้าร่วม' && !req.isWatched) {
        res.push(req);
      }
    });
    return res;
  },
  getRequestsById: (state) => (id) => {
    var res = [];
    state.allRequests.forEach((req) => {
      if(req.owner === id){
        res.push(req);
      }
    });
    return res === [] ? undefined: res;
  },
  getRequestById: (state) => (id) => {
    state.allRequests.forEach((req) => {
      if(req.id === id){
        return req
      }
    });
  }
}
