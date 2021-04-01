<template>
  <v-container >
    <v-card width="550" class="mx-auto my-12" elevation="10">
      <v-toolbar dark color="primary">
        <v-btn icon dark nuxt to="/">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>เข้าสู่ระบบ</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text style="padding-top: 20px">
        <v-card-title class="font-weight-bold">
          <v-row align="center">
            <v-col>
              <v-avatar color="teal" size="30" style="margin-right: 5px">
                <span class="white--text headline">1</span>
              </v-avatar>
              เปิดแอปพลิเคชัน Line > เข้าช่องแชท PenHwang
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-title class="font-weight-bold">
          <v-row align="center">
            <v-col>
              <v-avatar color="teal" size="30" style="margin-right: 5px">
                <span class="white--text headline">2</span>
              </v-avatar>
              ไปที่ตั้งค่า > เลือก
              <span style="color: green; font-size: 25px">" เข้าสู่ระบบ "</span>
              <br /><span style="margin-left: 40px"
                >ระบบจะส่งรหัสตอบกลับมา</span
              >
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-title class="font-weight-bold">
          <v-row align="center" style="margin-bottom: 10px">
            <v-col>
              <v-avatar color="teal" size="30" style="margin-right: 5px">
                <span class="white--text headline">3</span>
              </v-avatar>
              กรอกรหัสยืนยันที่ได้รับ
            </v-col>
          </v-row>
          <v-text-field
            class="input-btn"
            height="55px"
            solo
            hide-details
            v-model="otp"
          ></v-text-field>
          <v-btn class="small-btn" x-large color="info" @click="login">
            ยืนยัน
          </v-btn>
        </v-card-title>
      </v-card-text>
    </v-card>
    <!-- <v-btn @click="loginReq">log in request</v-btn> -->
  </v-container>
</template>

<style scoped>
.small-btn {
  margin-left: 10px !important;
}
.input-btn >>> input {
  font-size: 25px;
  text-align: center;
}
</style>


<script>
import API from "~/api/index";
export default {
  layout: 'empty',
  data:()=>({
    otp: '',
  }),
  methods:{
    async login(){
      const res = await this.$axios.post(API.login, {otp:this.otp});
      if(res.data.isSuccess){
        this.$cookies.set(
          'token',
          res.data.data.token,
          {
            path: '/'
          }
        )
        this.$cookies.set(
          'employeeId',
          res.data.data.employeeId,
          {
            path: '/'
          }
        )
       this.$router.push('/dashboard');
      }
    },
    logout(){
      this.$cookies.remove('token')
    },
    async loginReq(){
      const res = await this.$axios.post(`${API.v1}/loginReq`, {uid: "somtouch"});
      if(res.data.isSuccess){
        this.otp = res.data.data.otp;
      }
    }
  },
}
</script>
