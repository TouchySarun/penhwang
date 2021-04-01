<template>
  <div class="companyDetail">
    <v-icon>mdi-map-marker</v-icon>
    <div v-if="!editing">
      <p>ที่อยู่ :</p>
      <h4>{{ addressFormated }}</h4>
    </div>
    <div v-else style="flex-direction: column">
      <v-text-field v-model="newAddress.building" label="อาคาร"></v-text-field>
      <v-row>
        <v-col>
          <v-text-field
            v-model="newAddress.room"
            label="ห้องเลขที่"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="newAddress.floor"
            label="ชั้นที่"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="newAddress.houseNo"
            label="เลขที่"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="newAddress.villageNo"
            label="หมู่"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field v-model="newAddress.lane" label="ซอย"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field v-model="newAddress.road" label="ถนน"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="newAddress.subDistrict"
            label="ตำบล/แขวง"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="newAddress.district"
            label="อำเภอ/เขต"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="newAddress.province"
            label="จังหวัด"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="newAddress.postalCode"
            label="รหัสไปรษณีย์"
          ></v-text-field>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
export default {
  props: ['editing', 'address'],
  data: () => ({
    newAddress: null,
  }),
  computed: {
    addressFormated: function () {
      var r = ``
      var thaiWord = [
        'ตึก ',
        'ห้อง ',
        'ชั้น ',
        'บ้านเลขที่ ',
        'หมู่ ',
        'ซอย ',
        'ถนน ',
        'ตำบล ',
        'อำเภอ ',
        'จังหวัด ',
        'รหัสไปรษณีย์ ',
      ]
      var i = 0
      for (var x in this.address) {
        if (this.nonEmptyText(this.address[x])) {
          r += thaiWord[i] + this.address[x] + ', '
        }
        i++
      }
      return r
    },
  },
  methods: {
    saveData() {
      this.$emit('dataChange', this.newAddress)
    },
    nonEmptyText(t) {
      return t !== '' && t !== '-'
    },
  },
  mounted() {
    this.newAddress = JSON.parse(JSON.stringify(this.address))
  },
}
</script>
<style lang="scss" scoped>
.companyDetail {
  display: flex;
  align-items: center;
  padding: 1%;
  transition: 0.2s;
  p,
  .v-input {
    color: gray;
    margin: 1.5% 1.5% !important;
    min-width: 15% !important;
  }
  h4 {
    margin: 1.5% !important;
  }
  div {
    display: flex;
    width: 100%;
  }
  .v-icon {
    position: relative;
    top: -40px;
  }
}
</style>
