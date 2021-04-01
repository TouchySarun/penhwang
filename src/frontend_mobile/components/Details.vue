<template>
  <v-form>
    <div class="companyDetail" v-for="(item, i) in items" :key="i">
      <v-icon :color="item.color" v-if="item.icon">{{ item.icon }}</v-icon>
      <div v-if="editing && item.type === 'norm'">
        <v-text-field
          v-model="mydata[item.att]"
          :label="item.label"
          :color="item.color"
        />
      </div>
      <div v-if="editing && item.type === 'select'">
        <v-select
          :color="item.color"
          v-model="mydata[item.att]"
          :label="item.label"
          :items="item.items"
        />
      </div>
      <div v-if="editing && item.type === 'address'">
        <div style="flex-direction: column">
          <v-text-field v-model="mydata[item.att].building" label="อาคาร" />
          <v-row>
            <v-col>
              <v-text-field
                v-model="mydata[item.att].room"
                label="ห้องเลขที่"
              />
            </v-col>
            <v-col>
              <v-text-field v-model="mydata[item.att].floor" label="ชั้นที่" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="mydata[item.att].houseNo" label="เลขที่" />
            </v-col>
            <v-col>
              <v-text-field v-model="mydata[item.att].villageNo" label="หมู่" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="mydata[item.att].lane" label="ซอย" />
            </v-col>
            <v-col>
              <v-text-field v-model="mydata[item.att].road" label="ถนน" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="mydata[item.att].subDistrict"
                label="ตำบล/แขวง"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="mydata[item.att].district"
                label="อำเภอ/เขต"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="mydata[item.att].province"
                label="จังหวัด"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="mydata[item.att].postalCode"
                label="รหัสไปรษณีย์"
              />
            </v-col>
          </v-row>
        </div>
      </div>
      <div v-if="!editing">
        <p v-if="item.label" style="min-width: 100px">{{ item.label }} :</p>
        <h3>{{ formatedData[item.att] }}</h3>
      </div>
    </div>
  </v-form>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    editing: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    mydata: undefined,
  }),
  computed: {
    formatedData() {
      var fd = {}
      this.items.forEach((item) => {
        if (item.type === 'norm' || item.type === 'select') {
          fd[item.att] = item.data
        } else {
          var r = ``
          var thaiWord = {
            building: 'ตึก ',
            room: 'ห้อง ',
            floor: 'ชั้น ',
            houseNo: 'บ้านเลขที่ ',
            villageNo: 'หมู่ ',
            lane: 'ซอย ',
            road: 'ถนน ',
            district: 'ตำบล ',
            subDistrict: 'อำเภอ ',
            province: 'จังหวัด ',
            postalCode: 'รหัสไปรษณีย์ ',
          }
          for (var x in thaiWord) {
            if (this.nonEmptyText(item.data[x])) {
              r += thaiWord[x] + item.data[x] + ', '
            }
          }
          fd[item.att] = r
        }
      })
      return fd
    },
  },
  methods: {
    fetchData() {
      this.items.forEach((item) => {
        this.mydata[item.att] = item.data
      })
    },
    saveData() {
      return this.mydata
    },
    nonEmptyText(t) {
      return t !== '' && t !== '-'
    },
    formatData(d, type) {
      if (type === 'norm' || type === 'select') {
        return d
      } else {
        var r = ``
        var thaiWord = {
          building: 'ตึก ',
          room: 'ห้อง ',
          floor: 'ชั้น ',
          houseNo: 'บ้านเลขที่ ',
          villageNo: 'หมู่ ',
          lane: 'ซอย ',
          road: 'ถนน ',
          district: 'ตำบล ',
          subDistrict: 'อำเภอ ',
          province: 'จังหวัด ',
          postalCode: 'รหัสไปรษณีย์ ',
        }
        for (var x in d) {
          if (this.nonEmptyText(d[x])) {
            r += thaiWord[x] + d[x] + ', '
          }
        }
        return r
      }
    },
  },
  watch: {
    items: function (v) {
      this.fetchData()
    },
  },
  created() {
    this.mydata = {}
    this.fetchData()
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
    margin: 0% 1.5% !important;
  }
  div {
    display: flex;
    width: 100%;
  }
}
.companyDetail:hover {
  padding: 2%;
  h3 {
    text-decoration: underline;
  }
}
</style>
