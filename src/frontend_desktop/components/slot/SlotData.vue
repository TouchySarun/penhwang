<template>
  <div class="slotData">
    <v-form v-model="valid" :readonly=!editing>
      <v-container v-for="(day,i) in daysF" :key="i">
        <v-row>
          <v-col cols="12" md="3">
            <v-chip :color="day.color" label>
              <v-checkbox
                v-model="day.checkbox"
                :label="day.name"
              ></v-checkbox>
            </v-chip>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="day.startTime"
              type="time"
              label="เข้างาน"
              color="success"
              @change="(d)=>{if(d)day.checkbox=true}"
              :required="day.checkbox"
              :rules="(day.checkbox)?timeRules:[]" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="day.endTime"
              type="time"
              label="ออกงาน"
              color="warning"
              @change="(d)=>{if(d)day.checkbox=true}"
              :required="day.checkbox"
              :rules="(day.checkbox)?endRules(day.startTime):[]" />
          </v-col>
        </v-row>
        <v-divider />
      </v-container>
    </v-form>
  </div>
</template>

<script>
export default {
  props:{
    editing:{
      type: Boolean,
      default: false
    },
    items:{
      type: Array,
      default: ()=>([
        {
          day_of_week:0,
          in: undefined,
          out: undefined,
        },
        {
          day_of_week:1,
          in: undefined,
          out: undefined,
        },
        {
          day_of_week:2,
          in: undefined,
          out: undefined,
        },
        {
          day_of_week:3,
          in: undefined,
          out: undefined,
        },
        {
          day_of_week:4,
          in: undefined,
          out: undefined,
        },
        {
          day_of_week:5,
          in: undefined,
          out: undefined,
        },
        {
          day_of_week:6,
          in: undefined,
          out: undefined,
        },
      ])
    }
  },
  data:()=>({
    valid: false,
    days:[],
    timeRules: [
      v => !!v || 'This is required'
    ],
  }),
  methods:{
    print(x){
      console.log(x)
    },
    endRules(startTime){
      var r = [...this.timeRules]
      if(startTime){
        const rule = v => v > startTime || 'เวลาออกงานต้องหลังเวลาเข้างาน'
        r.push(rule)
      }
      return r
    },
    delChange(){
      console.log("del change");
      this.resetDays();
    },
    saveChange(){
      console.log("save change");
      var d = [];
      this.days.forEach(item=>{
        d.push({
          day_of_week: item.day_of_week,
          in: item.startTime,
          out: item.endTime,
        })
      })
      return d
    },
    resetDays(){
      this.days = [];
      const thDays = {
        0:'วันอาทิตย์',
        1:'วันจันทร์',
        2:'วันอังคาร',
        3:'วันพุธ',
        4:'วันพฤหัส',
        5:'วันศุกร์',
        6:'วันเสาร์',
      }
      const thDaysColor = {
        0:'red lighten-3',
        1:'yellow lighten-4',
        2:'pink lighten-4',
        3:'green lighten-4',
        4:'orange lighten-4',
        5:'blue lighten-4',
        6:'purple lighten-4',
      }
      this.items.forEach(item=>{
        this.days.push({
          day_of_week: item.day_of_week,
          name: thDays[item.day_of_week],
          color: thDaysColor[item.day_of_week],
          checkbox: (item.in)?true:false,
          startTime: item.in,
          endTime: item.out,
        })
      })
    }
  },
  computed:{
    daysF() {
      this.days.forEach(item=>{
        if(!item.checkbox){
          item.startTime = undefined,
          item.endTime = undefined
        }
      })
      return this.days
    }
  },
  watch: {
    items: function (val) {this.resetDays()}
  },
  created(){
    this.resetDays();
  }
}
</script>

<style>
</style>
