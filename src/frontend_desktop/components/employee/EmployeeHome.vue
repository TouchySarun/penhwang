<template>
  <v-card>
    <slot :header="''">
    <v-card-title>
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
            v-model="roleText"
            :items="roles"
            label="แผนก"
          />
        </v-col>
      </v-row>
      <v-spacer />
        <v-btn color="primary" dark @click="$emit('changeTab', 1)">
          <v-icon style="margin-right: 10px;">mdi-account-plus</v-icon>
          คำขอพนักงานใหม่
        </v-btn>
    </v-card-title>
    </slot>
    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="(l,i) in employees"
          :key="i"
          style="width: 40vw; border:solid 0.8px #6D4C4140;"
          v-show="l.name.includes(search) && (l.role.includes(roleText)||roleText==='ทั้งหมด')">
          <v-expansion-panel-header disable-icon-rotate style="align-items: start">
            <nuxt-link :to="`/employee/${l.id}`">
              <div style="display: flex;">
                <v-avatar size="48"><img :src="l.img" :alt="l.name"></v-avatar>
                <div style="width: 100%; margin-left: 2%; min-width: 150px;">
                  <h3 style="color: #6D4C41"><v-icon left color="primary">mdi-account</v-icon>{{l.name}}</h3>
                  <v-row style="margin:0;">
                    <p v-if="l.role"><v-icon left color="success">mdi-bookmark</v-icon>{{l.role}}</p>
                    <div style="width: 1vw;"></div>
                    <p v-if="l.position"><v-icon left color="warning">mdi-star</v-icon>{{l.position}}</p>
                  </v-row>
                </div>
              </div>
            </nuxt-link>
            <template v-slot:actions>
              <div style="display: flex; flex-wrap:wrap;">
              <v-btn icon>
                <v-icon color="info">mdi-chevron-down</v-icon>
              </v-btn>
              <v-btn icon @click="$emit('deleteEmployee', l)">
                <v-icon color="error">mdi-delete-forever</v-icon>
              </v-btn>
              </div>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="panel-detail">
            <v-row no-gutters>
              <v-col cols="4" style="min-width: 150px;"><v-icon color="success">mdi-phone</v-icon>โทร: {{l.tel}}</v-col>
              <v-col cols="4" style="min-width: 150px;"><v-icon color="info">mdi-account-box</v-icon>ประเภท: {{l.salary.type}}</v-col>
              <v-col cols="4" style="min-width: 150px;"><v-icon color="success">mdi-cash</v-icon>เงินเดือน: {{l.salary.amount}}</v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  data:()=>({roleText:''}),
  props:{
    employees:{
      type: Array,
      default: ()=>([])
    },
    search:{
      type: String,
      default: "",
    }
  },
  computed:{
    ...mapGetters({
      roles: 'myrole/getRolesName'
    }),
  }
}
</script>
<style lang="scss" scoped>
p{
  padding: 0 !important;
  margin: 0;
}
.panel-detail{
  padding: 0px 10px !important;
  i{
    margin-right: 2%;
  }
  p{
    color: #607D8B;
    margin: 20px 10px 0px 10px !important;
  }
}
a {  text-decoration: none;}
</style>
