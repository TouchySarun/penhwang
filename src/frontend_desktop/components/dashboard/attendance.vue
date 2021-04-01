<template>
  <div>
    <br>
    <v-row>
      <v-col cols="8">
        <v-select
          :items="roles"
          v-model="role"
          label="แผนก"
          outlined
          dense
        ></v-select>
      </v-col>
      <v-col cols="4">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="date"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="Picker in menu"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              dense
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            no-title
            scrollable
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="menu = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.menu.save(date)"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <dashboard-conclude :conclude="conclude" @click="v=>show=v"/>
    <br>
    <v-text-field v-model="searchName" label="ชื่อพนักงาน" append-icon="mdi-magnify" outlined dense/>
    <div style="max-height: 50vh; overflow: auto; padding:0px 20px;">
      <v-alert v-for="(item, i) in items" :key="i" color="lightBrown" outlined v-show="isShow(item)">
        <div style="display:flex; align-items:center;">
          <v-avatar>
            <img
              :src="item.img"
              :alt="item.name"
            />
          </v-avatar>
          <div class="attendance-data">
            <h3>{{item.name}}</h3>
            <v-row>
              <v-col :style="`background-color:${(item.isLate)?'#FFB300':'#43A047'}`">
                <h4>เข้างาน</h4>
                <p>
                  <v-icon v-if="item.isLate" color="white">mdi-emoticon-sad</v-icon>
                  <v-icon v-else color="white">mdi-emoticon-happy</v-icon>
                  {{item.in}}
                </p>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col :style="`background-color:${(item.out !== null)?'#BA68C8':'#ECEFF1'}`">
                <h4>ออกงาน</h4>
                <p v-if="item.out !== null">
                  <v-icon color="white">mdi-emoticon-cool</v-icon>
                  {{item.out}}
                </p>
                <p v-else>
                  - - -
                </p>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-alert>
    </div>
  </div>
</template>
<script>
export default {
  props:['items', 'roles', 'sum'],
  data:()=>({
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    searchName:"",
    role:"",
    show:"active",
    conclude: {}
  }),
  watch:{
    role: function (val) {
      this.sum.forEach(r=>{
        if(val.includes(r.role)){
          console.log(`return this: ${r.data}`)
          this.conclude = r.data
        }
      })
    },
  },
  created(){
    this.role = "ทั้งหมด"
  },
  methods:{
    getTypeColor(t){
      if(t === 'เข้างาน'){
        return 'success'
      }else if(t === 'สาย'){
        return 'warning'
      }else if(t === 'ยังไม่เข้า'){
        return 'error'
      }else if(t === 'ออกงาน'){
        return 'info'
      }
    },
    isShow(item){
      return (
        (
          item.name.includes(this.searchName) &&
          (item.role.includes(this.role) || this.role == "ทั้งหมด")
        ) && (
          (this.show === "active" && !(item.out !== null)) ||
          (this.show === "late" && item.isLate) ||
          (this.show === "out" && item.out !== null) ||
          (this.show === "inTime" && !(item.isLate))
        )
      )
    },

  }
}
</script>
<style lang="scss" scoped>
.attendance-data{
  width:100%;
  margin-left: 10px;
  color:white;
  h3{
    background-color: white;
    position: relative;
    padding: 1px 10px;
    color: black;
    border-radius: 5px;
  }
  p{
    margin: 0 !important;
  }
}
</style>
