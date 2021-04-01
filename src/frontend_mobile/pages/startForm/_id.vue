<template>
  <v-card class="mx-auto" max-width="400">
    <v-img
      class="black--text align-end"
      height="200px"
      src="https://sv1.picz.in.th/images/2021/03/02/oG0eav.png?fbclid=IwAR1zzXKz-uvXjt6w3bAzeADRcHsqQvS068j2j5Bq2-Nnqnj0MNuVmvbX6Jg"
    >
      <!-- <v-card-title
        ><h2 style="background-color: white; padding: 5px">
          แบบฟอร์มเข้าบริษัท
        </h2></v-card-title
      > -->
    </v-img>
    <div style="background-color: #f5f5f5; height: 100%">
      <h2 style="padding: 10px 15px 0 15px">แบบฟอร์มเข้าบริษัท</h2>
      <v-form v-model="valid" style="padding: 5%">
        <h3 style="color: #6d4c41">
          <v-icon left style="color: #ff6f00"> mdi-key </v-icon>Passcode
          ของบริษัทของคุณ
        </h3>
        <i style="color: #757575">ติดต่อกับผู้ดูแลของคุณเพื่อรับรหัสผ่าน</i>
        <v-textarea
          v-model="passcode"
          :rules="passcodeRules"
          required
          auto-grow
          outlined
          rows="2"
          row-height="20"
          hide-details
          background-color="#FFFFFF"
        ></v-textarea>
        <br />

        <h3>ชื่อ :</h3>
        <i style="color: #757575">ไม่ต้องใส่คำนำหน้าชื่อ</i>
        <v-textarea
          v-model="firstname"
          :rules="firstnameRules"
          required
          auto-grow
          dense
          outlined
          rows="2"
          row-height="20"
          hide-details
          background-color="#FFFFFF"
        ></v-textarea>
        <br />

        <h3>นามสกุล :</h3>
        <v-textarea
          v-model="lastname"
          :rules="lastnameRules"
          required
          auto-grow
          dense
          outlined
          rows="2"
          row-height="20"
          hide-details
          background-color="#FFFFFF"
        ></v-textarea>
        <br />

        <h3>Line ID :</h3>
        <v-textarea
          v-model="lineId"
          :rules="lineIdRules"
          required
          append-icon="mdi-cellphone"
          auto-grow
          dense
          outlined
          rows="2"
          row-height="20"
          hide-details
          background-color="#FFFFFF"
        ></v-textarea>
        <br />

        <h3>Email :</h3>
        <v-textarea
          v-model="email"
          :rules="emailRules"
          required
          append-icon="mdi-email-outline"
          auto-grow
          dense
          outlined
          rows="2"
          row-height="20"
          hide-details
          background-color="#FFFFFF"
        ></v-textarea>
        <br />

        <h3>เบอร์โทรศัพท์ :</h3>
        <v-textarea
          v-model="tel"
          :rules="telRules"
          required
          append-icon="mdi-phone"
          auto-grow
          dense
          outlined
          rows="2"
          row-height="20"
          hide-details
          background-color="#FFFFFF"
        ></v-textarea>
        <br />

        <v-spacer />
        <v-btn :disabled="!valid" block color="primary" large @click="sendForm">
          <h3>ส่งแบบฟอร์ม</h3>
        </v-btn>
      </v-form>
    </div>
  </v-card>
</template>

<script>
import api from '~/api/index'
export default {
  data: () => ({
    valid: false,
    passcode: null,
    passcodeRules: [(v) => !!v || 'Passcode is required'],
    firstname: null,
    firstnameRules: [(v) => !!v || 'First name is required'],
    lastname: null,
    lastnameRules: [(v) => !!v || 'Last name is required'],
    tel: null,
    telRules: [(v) => !!v || 'Phone number is required'],
    email: null,
    emailRules: [(v) => !!v || 'Email is required'],
    lineId: null,
    lineIdRules: [(v) => !!v || 'Line ID is required'],
  }),
  methods: {
    sendForm() {
      const data = {
        lineUserId: this.$route.params.id,
        lineId: this.lineId,
        companyId: this.passcode,
        name: `${this.firstname} ${this.lastname}`,
        email: this.email,
        tel: this.tel,
      }
      this.$nextTick(() => {
        this.$nuxt.$loading.start()
        this.$axios
          .$post(api.employeeAdd, data)
          .then((res) => {
            if (res.isSuccess) {
              this.loading = false
              alert('ส่งคำขอสำเร็จ รอฝ่ายบุคคลยืนยัน')
            } else {
              this.loading = false
              console.log(res)
              alert('ล้มเหลว โปรดลองใหม่ passcode ของคุณอาจไม่ถูกต้อง')
            }
          })
          .catch((err) => console.error(err))
        this.$nuxt.$loading.finish()
      })
    },
  },
}
</script>

