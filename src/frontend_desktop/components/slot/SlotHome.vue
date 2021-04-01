<template>
  <v-card>
    <slot :header="''">
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="ชื่อกะ"
          single-line
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark @click="$emit('changeTab', 1)">
          <v-icon style="margin-right: 10px;">mdi-clock</v-icon>
          สร้างตารางใหม่
        </v-btn>
      </v-card-title>
    </slot>
    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="(l,i) in slots"
          :key="i"
          style="width: 40vw; border:solid 0.8px #6D4C4140;"
          v-show="l.name.includes(search)">
          <v-expansion-panel-header disable-icon-rotate style="align-items: start">
            <nuxt-link :to="`/slot/${l.id}`">
              <div style="width: 100%; margin-left: 2%">
                <h3 style="color: #6D4C41">{{l.name}}</h3>
                <p>มีพนักงานใช้กะนี้อยู่ <v-chip color="info" dark>{{(l.employees)?l.employees.length:0}}</v-chip> คน</p>
              </div>
            </nuxt-link>
            <template v-slot:actions>
              <v-btn icon>
                <v-icon color="info">mdi-chevron-down</v-icon>
              </v-btn>
              <v-btn icon @click="$emit('deleteSlot', l)">
                <v-icon color="error">mdi-delete-forever</v-icon>
              </v-btn>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="panel-detail">
            <v-avatar size="24" v-for="(item, i) in l.employees" :key="i" style="margin-right: 5px;">
              <img :src="empImg(item)" alt="item" />
            </v-avatar>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  props:{
    slots:{
      type:Array,
      default:()=>([])
    },
    search:{
      type:String,
      default:""
    }
  },
  computed:{
    ...mapGetters({
      employeeGetter:'employee/getEmployeeById',
    }),
  },
  methods:{
    empImg(id){
      return this.employeeGetter(id).img;
    }
  }
}
</script>
<style lang="scss" scoped>
p{
  padding: 0 !important;
  margin: 0;
}
.v-expansion-panel{
  span{
    // color: white;
    padding: 1px 5px;
    // margin: 0px 5px;
    // border-radius: 5px;
  }
  .v-expansion-panel-header{
    p{
      color:#607D8B;
    }
  }
  .panel-detail{
    padding: 0px 10px !important;
    i{
      margin-right: 2%;
    }
  }
}
a {  text-decoration: none;}
</style>
