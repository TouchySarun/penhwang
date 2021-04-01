import API from "~/api"
import Vue from "vue"

export const state = () => ({
  // ข้อมูล
  allEmployees: {
    somtouch: { id: "somtouch", name: "สมทัช มัดใจ", role: "เจ้าของบริษัท", pos: "หัวหน้าพนักงาน", tel: "0800000000", salary: { type: "ประจำ", amount: 20000 }, lineId: "mock_lineId", email: "sample@email.com", img: "https://sprofile.line-scdn.net/0hFOWKo3F_GWB6MjBtSolnHwpiGgpZQ0ByV1ReU0wyE1gXBQ1mUlJSBk4xF1JGBVhmVFVUDh1lRwN2IW4GZGTlVH0CR1dDB1YzUF1fhQ" },
    sommai: { id: "sommai", name: "สมหมาย ใจดี", role: "พนักงานบัญชี", pos: "หัวหน้าพนักงาน", tel: "0800000000", salary: { type: "ประจำ", amount: 20000 }, lineId: "mock_lineId", email: "sample@email.com", img: "https://cdn.vuetifyjs.com/images/john.jpg" },
    somkong: { id: "somkong", name: "สมคง ปงใจ", role: "พนักงานบัญชี", pos: "เลขา", tel: "0800000000", salary: { type: "ประจำ", amount: 20000 }, lineId: "mock_lineId", email: "sample@email.com", img: "https://cdn.vuetifyjs.com/images/john.jpg" },
    somporn: { id: "somporn", name: "สมพร ป้อนเข้าปาก", role: "พนักงานบัญชี", pos: "ทั่วไป", tel: "0800000000", salary: { type: "ประจำ", amount: 20000 }, lineId: "mock_lineId", email: "sample@email.com", img: "https://cdn.vuetifyjs.com/images/john.jpg" },
    somchai: { id: "somchai", name: "สมชาย ใจดี", role: "พนักงานบัญชี", pos: "ทั่วไป", tel: "0800000000", salary: { type: "รายวัน", amount: 320 }, lineId: "mock_lineId", email: "sample@email.com", img: "https://cdn.vuetifyjs.com/images/john.jpg" },
    somying: { id: "somying", name: "สมหญิง จริงใจ", role: "พนักงานบัญชี", pos: "ทั่วไป", tel: "0800000000", salary: { type: "รายวัน", amount: 320 }, lineId: "mock_lineId", email: "sample@email.com", img: "https://cdn.vuetifyjs.com/images/john.jpg" },
    somsee: { id: "somsee", name: "สมศรี ปรีดี", role: "พนักงานขาย", pos: "หัวหน้าพนักงาน", tel: "0800000000", salary: { type: "รายวัน", amount: 320 }, lineId: "mock_lineId", email: "sample@email.com", img: "https://cdn.vuetifyjs.com/images/john.jpg" },
    sompop: { id: "sompop", name: "สมพบ ประสบเหตุ", role: "พนักงานขาย", pos: "ทั่วไป", tel: "0800000000", salary: { type: "รายวัน", amount: 320 }, lineId: "mock_lineId", email: "sample@email.com", img: "https://cdn.vuetifyjs.com/images/john.jpg" },
    somrak: { id: "somrak", name: "สมรัก คึกคักจัง", role: "พนักงานขาย", pos: "ทั่วไป", tel: "0800000000", salary: { type: "รายวัน", amount: 320 }, lineId: "mock_lineId", email: "sample@email.com", img: "https://cdn.vuetifyjs.com/images/john.jpg" },
    somtiew: { id: "somtiew", name: "สมทิว ปิ๊วปิ๊ว", role: "พนักงานขาย", pos: "ทั่วไป", tel: "0800000000", salary: { type: "รายวัน", amount: 320 }, lineId: "mock_lineId", email: "sample@email.com", img: "https://cdn.vuetifyjs.com/images/john.jpg" }
  },
  types: [
    "ประจำ",
    "รายวัน",
  ],
  workHour: [],
  attendance: [],
})

export const mutations = {
  SET_DATA(state, payload) {
    Vue.set(state.allEmployees, payload.id, payload);
  },
  DELETE_EMPLOYEE(state, payload) {
    const copy = { ...state.allEmployees };
    delete copy[payload.id];
    Vue.set(state, 'allEmployees', copy);
  },
  SET_WORKHOUR(state, payload) {
    state.workHour = payload;
  },
  SET_ATTENDANCE(state, payload) {
    state.attendance = payload;
  }
}

export const actions = {
  async getEmployees({ commit }) {
    try {
      const params = {}
      const res = await this.$axios.$get(API.v1, params)
      if (res.success) {
        // TODO get data form db
      }
    } catch (error) { console.log(error); }
  },
  async getWorkHour({ commit }, payload) {
    try {
      const res = await this.$axios.$get(API.v1, { payload })
      if (res) {
        // TODO get data form db
        const mockdata = [
          {
            date: "Jan 23 2021", amount: 8, attendance: [
              { time: "Sat Jan 23 2021 08:33:35 GMT+0700 (Indochina Time)", location: { lat: 18.7957435, lng: 98.9526714, }, errorTime: 18, type: '1', isLate: true },
              { time: "Sat Jan 23 2021 17:33:35 GMT+0700 (Indochina Time)", location: { lat: 18.7957435, lng: 98.95265, }, errorTime: -1, type: '2', isLate: false },
            ]
          },
          {
            date: "Jan 24 2021", amount: 8, attendance: [
              { time: "Sun Jan 24 2021 08:38:35 GMT+0700 (Indochina Time)", location: { lat: 18.7957435, lng: 98.9526714, }, errorTime: 18, type: '1', isLate: false },
              { time: "Sun Jan 24 2021 17:38:35 GMT+0700 (Indochina Time)", location: { lat: 18.7957435, lng: 98.95265, }, errorTime: -1, type: '2', isLate: false },
            ]
          },
          {
            date: "Jan 25 2021", amount: 0, attendance: [
              { time: "Mon Jan 25 2021 00:00:00 GMT+0700 (Indochina Time)", type: '3', isLate: false },
            ]
          }
        ];
        commit('SET_WORKHOUR', mockdata);
        return mockdata;
      }
    } catch (error) { console.log(error); }
  },
  async getAttendance({ commit }, payload) {
    try {
      const res = await this.$axios.$get(API.v1, { payload })
      if (res) {
        // TODO get data form db
        const mockdata = [
          { id: 'sommai', name: 'สมหมาย ใจดี', role: "พนักงานบัญชี", type: 'รายวัน', inTime: 6, late: 24, leave: 4, miss: 1, ot: "01:00", avgWork: "07:03" },
          { id: 'somkong', name: 'สมคง ปงใจ', role: "พนักงานบัญชี", type: 'รายวัน', inTime: 9, late: 37, leave: 3, miss: 1, ot: "01:00", avgWork: "07:04" },
          { id: 'somporn', name: 'สมพร ป้อนเข้าปาก', role: "พนักงานบัญชี", type: 'ประจำ', inTime: 16, late: 23, leave: 60, miss: 7, ot: "01:00", avgWork: "07:05" },
          { id: 'somchai', name: 'สมชาย ใจดี', role: "พนักงานบัญชี", type: 'ประจำ', inTime: 37, late: 67, leave: 4, miss: 8, ot: "01:00", avgWork: "05:30" },
          { id: 'somying', name: 'สมหญิง จริงใจ', role: "พนักงานบัญชี", type: 'ประจำ', inTime: 16, late: 49, leave: 3, miss: 16, ot: "01:00", avgWork: "06:20" },
          { id: 'somsee', name: 'สมศรี ปรีดี', role: "พนักงานขาย", type: 'ประจำ', inTime: 0, late: 94, leave: 0, miss: 0, ot: "01:00", avgWork: "07:40" },
          { id: 'sompop', name: 'สมพบ ประสบเหตุ', role: "พนักงานขาย", type: 'ประจำ', inTime: 2, late: 98, leave: 0, miss: 2, ot: "01:00", avgWork: "07:25" },
          { id: 'somrak', name: 'สมรัก คึกคักจัง', role: "พนักงานขาย", type: 'รายวัน', inTime: 32, late: 87, leave: 6, miss: 45, ot: "01:00", avgWork: "07:14" },
          { id: 'somtiew', name: 'สมทิว ปิ๊วปิ๊ว', role: "พนักงานขาย", type: 'รายวัน', inTime: 25, late: 51, leave: 4, miss: 22, ot: "01:00", avgWork: "07:16" },
        ];
        commit('SET_ATTENDANCE', mockdata);
        return mockdata;
      }
    } catch (error) { console.log(error); }
  },
  setData({ commit }, employee) {
    commit('SET_DATA', employee);
    // TODO post data to backend
  },
  deleteEmployee({ commit }, employee) {
    commit('DELETE_EMPLOYEE', employee);
  }
}

export const getters = {
  getEmployees(state) {
    const x = state.allEmployees;
    var res = [];
    Object.keys(x).forEach(function (k) {
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
