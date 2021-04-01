<template>
  <v-row justify="end" align="start" >
    <v-col cols="8">
      <div style="padding:0">
        <img
        src="https://sv1.picz.in.th/images/2021/03/11/DfnoFy.png"
        alt=""
        style="width: 100%; height: 100%"
      />
      </div>
    </v-col>
    <v-col cols="4">
      <v-card height="100vh" style="position: fixed">
        <v-card-title style="margin-top: 10px">
          <h3>Welcome to PenHwang</h3>
          <h4 style="color: #6d4c41">:Time and Attendance</h4>
          <!-- <v-btn color="primary" nuxt to="/inspire" x-large>
            เริ่มต้นใช้งาน
          </v-btn> -->
        </v-card-title>
        <v-card-text>
          <!-- 1สร้างบริษัท -->
          <v-dialog
            v-model="createDialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="big-btn"
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
                elevation="8"
              >
                <v-col cols="12">
                  <v-row
                    width="100%"
                    style="place-content: center; margin-bottom: 50px"
                  >
                    <v-icon dark style="font-size: 70px">
                      mdi-home-modern
                    </v-icon>
                  </v-row>
                  <v-row width="100%" style="place-content: center">
                    <span class="body-1" style="font-weight: bold">
                      <h2>สร้างบริษัทใหม่</h2>
                    </span>
                  </v-row>
                </v-col>
              </v-btn>
            </template>
            <v-card>
              <v-toolbar dark color="primary">
                <v-btn icon dark @click="createDialog = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>สร้างบริษัทใหม่</v-toolbar-title>
              </v-toolbar>

              <v-stepper v-model="e1">
                <v-stepper-header>
                  <v-stepper-step :complete="e1 > 1" step="1">
                    เพิ่มเพื่อนกับ PenHwang
                  </v-stepper-step>

                  <v-divider></v-divider>

                  <v-stepper-step :complete="e1 > 2" step="2">
                    ขอรหัสยืนยัน
                  </v-stepper-step>

                  <v-divider></v-divider>

                  <v-stepper-step step="3"> กรอกรหัสยืนยัน </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items>
                  <v-stepper-content step="1">
                    <v-card class="mx-7" color="#F5F5F5">
                      <v-card-title class="head-text">
                        เพิ่มเพื่อนกับ PenHwang
                        <v-col
                          class="text-right"
                          style="
                            display: flex;
                            flex-wrap: wrap;
                            flex-direction: row-reverse;
                          "
                        >
                          <v-btn
                            class="small-btn"
                            color="success"
                            @click="e1 = 2"
                          >
                            ถัดไป
                          </v-btn>

                          <v-btn text @click="createDialog = false">
                            กลับ
                          </v-btn>
                        </v-col>
                      </v-card-title>
                      <first-page-step
                        number="1"
                        text="เปิดแอปพลิเคชัน Line แล้วไปที่ > เพิ่มเพื่อน (ไอคอนคน)"
                        picture="https://sv1.picz.in.th/images/2021/02/27/oVk5YE.jpg"
                        :isHorizontal="true"
                      />
                      <v-card-title class="font-weight-bold">
                        <v-row align="center">
                          <v-col cols="6" style="margin-left: 5%">
                            <v-avatar
                              color="teal"
                              size="30"
                              style="margin-right: 5px"
                            >
                              <span class="white--text headline">2</span>
                            </v-avatar>
                            สแกน QR code หรือค้นหา
                            <span style="color: green">@253shagi</span><br />
                            <img
                              src="https://qr-official.line.me/sid/L/253shagi.png"
                              width="150"
                              height="150"
                              style="margin-left: 20%"
                            />
                          </v-col>
                          <v-col cols="auto">
                            <img
                              src="https://sv1.picz.in.th/images/2021/02/27/oV9q2V.jpg"
                              style="width: 25vw; height: 20vh"
                            />
                          </v-col>
                        </v-row>
                      </v-card-title>
                      <first-page-step
                        number="3"
                        text="เมื่อเจอแล้วทำการกดปุ่ม เพิ่มเพื่อน"
                        picture="https://sv1.picz.in.th/images/2021/02/27/oV9OtS.jpg"
                      />
                    </v-card>
                  </v-stepper-content>
                  <v-stepper-content step="2">
                    <v-card class="mx-7" color="#F5F5F5">
                      <v-card-title class="head-text">
                        ขอรหัสยืนยัน
                        <v-col
                          class="text-right"
                          style="
                            display: flex;
                            flex-wrap: wrap;
                            flex-direction: row-reverse;
                          "
                        >
                          <v-btn
                            class="small-btn"
                            color="success"
                            @click="e1 = 3"
                          >
                            ถัดไป
                          </v-btn>
                          <v-btn text @click="e1 = 1"> กลับ </v-btn>
                        </v-col>
                      </v-card-title>
                      <v-card-title class="font-weight-bold">
                        <v-row align="center">
                          <v-col cols="6" style="margin-left: 5%">
                            พิมพ์
                            <span style="color: green; font-size: 25px"
                              >" สร้างบริษัทใหม่ "</span
                            >
                            ในช่องแชท ระบบจะส่งรหัสตอบกลับมา
                          </v-col>
                          <v-col cols="auto">
                            <img
                              src="https://sv1.picz.in.th/images/2021/02/27/oV9q2V.jpg"
                              style="width: 25vw; height: 20vh"
                            />
                          </v-col>
                        </v-row>
                      </v-card-title>
                    </v-card>
                  </v-stepper-content>
                  <v-stepper-content step="3">
                    <v-card class="mx-7" color="#F5F5F5">
                      <v-card-title class="font-weight-bold">
                        <v-layout
                          class="head-text"
                          column
                          align-center
                          justify-center
                        >
                          กรุณากรอกรหัสยืนยันที่ได้รับ
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              class="input-btn"
                              height="70px"
                              solo
                              hide-details
                              v-model="otp"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="3"
                            style="
                              display: flex;
                              flex-wrap: wrap;
                              flex-direction: row-reverse;
                            "
                          >
                            <v-btn
                              class="small-btn"
                              color="info"
                              @click="login"
                            >
                              ยืนยัน
                            </v-btn>
                            <v-btn text @click="e1 = 2"> กลับ </v-btn>
                          </v-col>
                        </v-layout>
                      </v-card-title>
                    </v-card>
                  </v-stepper-content>
                </v-stepper-items>
              </v-stepper>
            </v-card>
          </v-dialog>
          <!-- 2เข้าสู่ระบบ -->
          <v-btn
            class="big-btn"
            color="primary"
            dark
            elevation="8"
            nuxt
            to="/login"
          >
            <v-col cols="12">
              <v-row
                width="100%"
                style="place-content: center; margin-bottom: 50px"
              >
                <v-icon dark style="font-size: 60px">
                  mdi-login-variant
                </v-icon>
              </v-row>
              <v-row width="100%" style="place-content: center">
                <span class="body-1" style="font-weight: bold">
                  <h2>เข้าสู่ระบบ</h2>
                </span>
              </v-row>
            </v-col>
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.big-btn {
  /* padding: 10vw !important; */
  width: 30vw !important;
  height: 35vh !important;
  margin-top: 8% !important;
}
.small-btn {
  margin-left: 10px !important;
}
.head-text {
  margin-left: 40px;
  font-size: 30px;
  color: #3e2723;
  font-weight: bold;
}
.input-btn >>> input {
  font-size: 25px;
  text-align: center;
}
</style>

<script>
import api from '~/api/index'
import FirstPageStep from '~/components/FirstPageStep.vue'
export default {
  components: { FirstPageStep },
  layout: 'empty',
  data() {
    return {
      otp: '',
      createDialog: false,
      joinDialog: false,
      e1: 1,
      e2: 1,
      dialog: false,
    }
  },
  methods:{
    async login(){
      const res = await this.$axios.post(api.login, {otp:this.otp})
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
       this.$router.push('/company');
      }
    }
  }
}
</script>
