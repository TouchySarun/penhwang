<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="ชื่อแผนก"
        single-line
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn color="primary" dark @click="$emit('changeTab', 1)">
        <v-icon style="margin-right: 10px;">mdi-account-multiple-plus</v-icon>
        เพิ่มแผนกใหม่
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="(l,i) in roles"
          :key="i"
          style="width: 40vw; border:solid 0.8px #6D4C4140;"
          v-show="l.name.includes(search)">
          <v-expansion-panel-header disable-icon-rotate style="align-items: start">
            <nuxt-link :to="`role/${l.id}`">
              <div style="width: 100%; margin-left: 2%">
                <h3 style="color: #6D4C41">{{l.name}}</h3>
                <p>{{l.description}}</p>
              </div>
            </nuxt-link>
            <template v-slot:actions>
              <v-btn icon>
                <v-icon color="info">mdi-chevron-down</v-icon>
              </v-btn>
              <v-btn icon @click="$emit('deleteRole', l)">
                <v-icon color="error">mdi-delete-forever</v-icon>
              </v-btn>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="panel-detail">
            <v-row no-gutters>
              <v-col cols="12" sm="4">
                <v-icon color="warning">mdi-account-star</v-icon>
                หัวหน้าแผนก: <span style="background-color: #FFB300;">{{l.managers.length}}</span>คน
              </v-col>
              <v-col cols="12" sm="4">
                <v-icon color="info">mdi-account</v-icon>
                พนักงานในแผนก: <span style="background-color: #039BE5;">{{l.employees.length}}</span>คน
              </v-col>
              <v-col cols="12" sm="4">
                <v-icon>mdi-clock</v-icon>
                กะที่สามารถใช้งานได้: <span style="background-color: #546E7A;">{{l.slots.length}}</span>กะ
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props:['roles'],
  data:()=>({
    search:"",
  }),
}
</script>
<style lang="scss" scoped>
p{
  padding: 0 !important;
  margin: 0;
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
  span{
    color: white;
    padding: 1px 5px;
    margin: 0px 5px;
    border-radius: 5px;
  }
}
a {  text-decoration: none;}
</style>
