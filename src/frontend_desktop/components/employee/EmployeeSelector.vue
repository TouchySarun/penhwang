<template>
  <v-card>
    <v-card-title class="headline grey lighten-2">
      <slot name="header">เลือกพนักงาน</slot>
    </v-card-title>
    <v-card-text>
      <br>
      <v-row justify="space-between">
        <v-col cols="8">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="ชื่อพนักงาน"
            single-line
          />
        </v-col>
        <v-col cols="3">
          <v-select
            v-if="role"
            v-model="roleText"
            :items="roles"
            label="แผนก"
          />
        </v-col>
      </v-row>
      <v-row justify="space-between">
        <v-col cols="auto">
          เลือกอยู่ <v-chip color="info">{{selected.length}}</v-chip> คน
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
        :value="l.id"
        v-show="l.name.includes(search) && (l.role.includes(roleText) ||roleText === 'ทั้งหมด')"
        hide-details
        color="info"
        class="t-checkbox"
      >
        <template v-slot:label>
          <div class="t-label" :style="(selected.includes(l.id))?`background-color:#EFEBE9;`:``">
            <v-avatar size="48">
              <img :src="l.img" :alt="l.name">
            </v-avatar>
            <div style="width: 100%; margin-left: 2%">
              <h3 style="color: #6D4C41"><v-icon left color="primary">mdi-account</v-icon>{{l.name}}</h3>
              <v-row style="margin:0;">
                <div v-if="l.role && role" style="margin-right: 1vw"><v-icon left color="success">mdi-bookmark</v-icon>{{l.role}}</div>
                <div v-if="l.pos"><v-icon left color="warning">mdi-star</v-icon>{{l.pos}}</div>
              </v-row>
            </div>
          </div>
        </template>
      </v-checkbox>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  props:{
    items:{
      type:Array,
      default: ()=>([])
    },
    role:{
      type:Boolean,
      default: false
    }
  },
  data:()=>({
    search:"",
    roleText:"",
    selected:[],
  }),
  computed:{
    ...mapGetters({
      roles: 'myrole/getRolesName',
    }),
  },
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
