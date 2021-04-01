<template>
  <v-card>
    <v-card-title class="headline grey lighten-2">
      <slot name="header">เลือกกะ</slot>
    </v-card-title>
    <v-card-text>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="ชื่อกะ"
        single-line
      ></v-text-field>
      <v-row justify="space-between">
        <v-col cols="auto">
        <p>เลือกอยู่ <v-chip color="info">{{selected.length}}</v-chip> กะ</p>
        </v-col>
        <v-col cols="auto">
        <v-btn color="error" outlined @click="$emit('closeTab')">ยกเลิก</v-btn>
        <v-btn color="success" @click="$emit('saveData', selected); reset();">บันทึก</v-btn>
        </v-col>
      </v-row>
      <v-divider style="margin: 1vh 0;"></v-divider>
      <v-checkbox
        v-for="(l,i) in items" :key="i"
        v-model="selected"
        v-show="l.name.includes(search)"
        :value="l.id"
        hide-details
        color="info"
        class="t-checkbox"
      >
        <template v-slot:label>
          <div class="t-label" :style="(selected.includes(l.id))?`background-color:#EFEBE9;`:``">
            <div style="width: 100%; margin-left: 2%">
              <h3 style="color: #6D4C41"><v-icon left color="primary">mdi-clock</v-icon>{{l.name}}</h3>
            </div>
          </div>
        </template>
      </v-checkbox>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props:{
    items:{
      type:Array,
      default: ()=>([])
    }
  },
  data:()=>({
    search:"",
    selected:[],
  }),
  methods:{
    print(d){
      console.log(d);
    },
    reset(){
      this.selected = [];
    }
  }
}
</script>
<style lang="scss" scoped>
span{
  padding: 2px 5px;
  background-color: #E3F2FD;
  color: #0D47A1;
  border-radius: 5px;
}
.t-label{
  display: flex;
  width: 100%;
  border-radius: 5px;
  border:solid 0.8px #6D4C4140;
  padding: 1% 2%;
}
.t-checkbox{
  padding:2px 5px;
  margin:0;
  border-radius: 5px;
}
.t-label:hover{
  background-color: #EFEBE980;
}
</style>
