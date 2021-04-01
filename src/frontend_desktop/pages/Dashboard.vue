<template>
  <div>
    <h1 style="padding: 0.5vh 1vw; background-color: #6D4C41; color: white;">วันที่: {{ now }}</h1>
    <v-container v-if="!loading">
      <request :req="request"/>
      <confirmed-request :req="watchedReq" />
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ConfirmedRequest from '~/components/dashboard/confirmedRequest.vue';
import Request from '~/components/dashboard/request.vue';

export default {
  middleware: 'auth',
  components: { ConfirmedRequest, Request },
  data:()=>({
    now: null,
    loading: true,
  }),
  created() {
    setInterval(() => {
      const date = new Date();
      this.now =
        date.toLocaleString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }) +
        " " +
        this.shiftZero(date.getHours()) +
        ":" +
        this.shiftZero(date.getMinutes()) +
        " น.";
    }, 1000);
  },
  computed:{
    ...mapGetters({
      request: 'request/getRequests',
      watchedReq: 'request/getWatchedRequests',
      employeeGetter: 'employee/getEmployeeById',
      slotGetter: 'slot/getSlotById',
    }),
  },
  methods:{
    shiftZero(m){
      return (m >= 10) ? `${m}`: (m>0) ? `0${m}`: "00";
    },
    formatDate(d){
      var date = new Date(d);
      return date.toLocaleString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) +
      " " +
      this.shiftZero(date.getHours()) +
      ":" +
      this.shiftZero(date.getMinutes()) +
      " น.";
    },
  },
  mounted(){
    this.$nextTick( async () => {
      this.$nuxt.$loading.start()
      await Promise.all([
        this.$store.dispatch('request/getAllRequest')
      ])
      this.loading = false;
      this.$nuxt.$loading.finish()
    })
  }
}
</script>
