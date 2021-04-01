<template>
  <div class="companyDetail">
    <v-icon :color="color">{{icon}}</v-icon>
    <div v-if="!editing">
      <p>{{labelF}}</p>
      <h3>{{data}}</h3>
    </div>
    <v-text-field
      v-else
      required
      v-model="mydata"
      :label="label"
      :color="color"
    ></v-text-field>
  </div>
</template>
<script>
export default {
  props: {
    icon: {
      type:String,
      default: undefined
    },
    label: {
      type:String,
      default: undefined
    },
    editing: {
      type:Boolean,
      default: false
    },
    data: {
      type:String,
      default: '',
    },
    color: {
      type:String,
      default: 'primary'
    }
  },
  data:()=>({
    mydata: null
  }),
  computed:{
    labelF(){
      if(this.label !== undefined){
        return this.label+" :"
      }else {
        return''
      }
    },
  },
  methods: {
    saveData(){
      this.$emit('dataChange', this.mydata)
    }
  },
  mounted(){
    this.mydata = JSON.parse(JSON.stringify(this.data))
  }
}
</script>
<style lang="scss" scoped>
.companyDetail{
  display:flex;
  align-items: center;
  padding: 1%;
  transition: 0.2s;
  p, .v-input{
    color: gray;
    margin: 0% 1.5% !important;
  }
  div{
    display: flex;
    width: 100%;
  }
}
.companyDetail:hover{
  padding: 2%;
  background-color: $lightBrown;
  h3{
    text-decoration: underline;
  }
}
</style>
