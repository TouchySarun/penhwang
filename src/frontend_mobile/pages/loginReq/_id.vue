<template>
  <v-container fill-height>
    <v-layout column align-center justify-center>
      <v-divider vertical inset />
      <v-dialog v-model="dialog" persistent max-width="290">
        <v-card style="padding: 7% 0% 3% 0%">
          <v-card-text
            class="headline"
            style="text-align: center; color: black"
          >
            {{ message }}
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
        @click="loginReq"
        style="padding: 60px 60px 60px 60px; margin-bottom: 20px"
      >
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <h3 style="text-align: center">กดเพื่อขอรหัสเข้าสู่ระบบ</h3>
      <v-divider vertical inset />
    </v-layout>
  </v-container>
</template>

<script>
import api from '~/api/index'
import Details from '~/components/Details.vue'
export default {
  components: { Details },
  data: () => ({
    dialog: false,
    message: '',
  }),
  methods: {
    loginReq() {
      this.$nextTick(() => {
        this.$nuxt.$loading.start()
        this.$axios
          .$post(api.loginReq(this.$route.params.id))
          .then((res) => {
            this.loading = false
            if (res.isSuccess) {
              this.message = 'รหัสยืนยันของคุณคือ ' + res.data.otp
              this.dialog = true
            } else {
              this.message =
                'คุณไม่สามารถขอรหัสยืนยันได้ เนื่องจากไม่ได้เป็นฝ่ายบุคคล(HR)'
              this.dialog = true
              console.log(res);
            }
          })
          .catch((err) => console.error(err))
        this.$nuxt.$loading.finish()
      })
    },
  },
}
</script>
