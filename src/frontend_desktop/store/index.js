import Vuex from "vuex"
import axios from "axios"

const createStore=()=>(
  new Vuex.Store({
    state:{
      // ข้อมูล
      company:{}
    },
    mutations:{
      // จัดการข้อมูลใน state
      setCompany(state, company){
        state.company = company
      }
    },
    actions:{
      // ทำงานร่วมกับ backend (cleaning data)
      nuxtServerInit(vuexContext, context){
        return axios.get('https://jsonplaceholder.typicode.com/todos/1')
        .then(res=>{
          // data = res // cleaning here
          data = {
            "passcode": 48535,
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
          vuexContext.commit("setCompany", data)
        }).catch(e=>contex.error(e));
      },
      changeData(vuexContext, company){
        const newData = {...company}
        axios.post('', {newData})
        .then(res=>{
          vuexContext.commit("setCompany", newData)
        })
      }
    },
    getters:{
      // นำ state ไปใช้งาน
      getCompany(state){
        return state.company
      }
    }
  })
);
