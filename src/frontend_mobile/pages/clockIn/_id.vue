<template>
  <v-container fill-height>
    <v-layout column align-center justify-center>
      <v-divider vertical inset />
      <h1>{{ time }}</h1>
      <h2>{{ now }}</h2>
      <br />
      <v-divider vertical inset />
      <v-dialog v-model="dialog" persistent max-width="290">
        <v-card style="padding: 7% 0% 3% 0%">
          <v-card-text
            class="headline"
            style="text-align: center; color: black"
          >
            {{message}}
          </v-card-text>
          <v-card-actions>
            <v-btn
              block
              large
              color="green darken-1"
              @click="dialog = false"
              class="white--text"
            >
              ตกลง
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
        <v-btn
          color="error"
          fab
          large
          dark
          :disabled="spotName===''"
          @click="clockIn"
          style="padding: 60px 60px 60px 60px; margin-bottom: 20px"
        >
          <v-icon>mdi-alarm</v-icon>
        </v-btn>
          <h3 style="text-align: center">กดเพื่อบันทึกเวลาทำงาน</h3>
        <v-btn color="info" @click="checkLocation" v-if="spotName===''">คำนวณใหม่</v-btn>
      <v-divider vertical inset />
    </v-layout>
  </v-container>
</template>

<script>
import api from '~/api/index'
export default {
  data: () => ({
    now: null,
    time: null,
    dialog: false,
    location: {},
    spotName: '',
    message: 'บันทึกสำเร็จ!!'
  }),
  methods:{
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition);
      } else {
        this.location = "Geolocation is not supported by this browser.";
      }
    },
    showPosition(position) {
      this.location = {
        lat:position.coords.latitude,
        lng:position.coords.longitude
      }
    },
    checkLocation() {
      this.getLocation();
      this.$nextTick(() => {
        this.$nuxt.$loading.start();
        const data = {
          location: this.location,
          employeeId: this.$route.params.id
        }
        this.$axios
          .$post(api.clockReq, data)
          .then((res) => {
            this.loading = false;
            if(res.isSuccess && res.data.pass){
              this.message = 'บันทึกสำเร็จ!!'
              this.spotName = res.data.name
            }else{
              this.message = 'คุณไม่สามารถเช็คชื่อตรงนี้'
              this.dialog = true;
              this.spotName = ''
            }
          })
          .catch((err) => console.error(err))
        this.$nuxt.$loading.finish();
      })
    },
    shiftZero: (t)=>
      t =  0 ? '00':
      t < 10 ? `0${t}`:
      t
    ,
    clockIn(){
      this.$nextTick(() => {
        this.$nuxt.$loading.start();
        const data = {
          location: this.location,
          employeeId: this.$route.params.id,
          spotName: this.spotName
        }
        this.$axios
          .$post(api.clockIn, data)
          .then((res) => {
            this.loading = false;
            if(res.isSuccess){
              this.message = 'บันทึกสำเร็จ!!'
              this.dialog = true;
            }else{
              console.log(res)
            }
          })
          .catch((err) => console.error(err))
        this.$nuxt.$loading.finish();
      })
    }
  },
  created() {
    setInterval(() => {
      const date = new Date();
      this.now = date.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      this.time =
        this.shiftZero(date.getHours()) +
        ':' +
        this.shiftZero(date.getMinutes()) +
        ':' +
        this.shiftZero(date.getSeconds()) +
        ' น.'
    }, 1000)
  },
  mounted() {
    this.getLocation();
    setTimeout( ()=>
      this.checkLocation()
    , 1500)
  },
}
</script>
