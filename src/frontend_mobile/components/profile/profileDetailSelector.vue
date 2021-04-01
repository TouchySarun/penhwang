<template>
  <div class="profileDetail">
    <v-icon :color="color">{{ icon }}</v-icon>
    <div v-if="!editing">
      <p>{{ labelF }}</p>
      <h3>{{ data }}</h3>
    </div>
    <v-select
      :color="color"
      v-else
      v-model="mydata"
      :label="label"
      :items="items"
      required
    ></v-select>
  </div>
</template>
<script>
export default {
  props: {
    icon: {
      type: String,
      default: 'mdi-account',
    },
    label: {
      type: String,
      default: 'ชื่อ',
    },
    editing: {
      type: Boolean,
      default: false,
    },
    data: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => ['sample1', 'sample2'],
    },
    color: {
      type: String,
      default: 'primary',
    },
  },
  data: () => ({
    mydata: null,
  }),
  computed: {
    labelF() {
      if (this.label !== undefined) {
        return this.label + ' :'
      } else {
        return ''
      }
    },
  },
  methods: {
    saveData() {
      this.$emit('dataChange', this.mydata)
    },
  },
  mounted() {
    this.mydata = JSON.parse(JSON.stringify(this.data))
  },
}
</script>
<style lang="scss" scoped>
.profileDetail {
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
.profileDetail:hover {
  padding: 2%;
  background-color: #efebe960;
  h3 {
    text-decoration: underline;
  }
}
</style>
