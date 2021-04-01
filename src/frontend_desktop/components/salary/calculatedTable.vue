<template>
  <v-card>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="ชื่อ/ ประเภทพนักงาน"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers2"
      :items="itemsFormated"
      :search="search"
    >
      <template v-slot:item.base="{ item }">
        <v-chip
          color="#43A047"
          dark
        >
          {{ item.base }}
        </v-chip>
      </template>
      <template v-slot:item.ot="{ item }">
        <v-chip
          color="#43A047"
          dark
        >
          {{ item.ot }}
        </v-chip>
      </template>
      <template v-slot:item.late="{ item }">
        <v-chip
          color="#FFB300"
          dark
        >
          {{ item.late }}
        </v-chip>
      </template>
      <template v-slot:item.leave="{ item }">
        <v-chip
          color="#039BE5"
          dark
        >
          {{ item.leave }}
        </v-chip>
      </template>
      <template v-slot:item.miss="{ item }">
        <v-chip
          color="#E64A19"
          dark
        >
          {{ item.miss }}
        </v-chip>
      </template>
      <template v-slot:item.final="{ item }">
        <v-chip
          color="#E8F5E9"
        >
          {{ item.final }}
        </v-chip>
      </template>

    </v-data-table>
  </v-card>
</template>
<script>
export default {
  props: ['items'],
  data: ()=>({
    search: null,
    headers2: [
      {
        text: 'รายชื่อพนักงาน',
        align: 'start',
        value: 'name',
      },
      { text: 'ประเภทเงินเดือน', value: 'type' },
      { text: 'เงินเดือน', value: 'base' },
      { text: 'สาย', value: 'late' },
      { text: 'ลา(ที่บริษัทไม่จ่าย)', value: 'leave' },
      { text: 'ขาด', value: 'miss' },
      { text: 'เงินเดือนสุทธิ', value: 'final' },
    ],
  }),
  computed: {
    itemsFormated: function(){
      var r = []
      for(var x in this.items){
        r.push({
          name: this.items[x].name,
          type: this.items[x].type,
          base: (this.items[x].baseNum) ? `${this.items[x].base} x ${this.items[x].baseNum}`: this.items[x].base,
          ot: `${this.items[x].ot} x ${this.items[x].otNum}`,
          late: `${this.items[x].late} x ${this.items[x].lateNum}`,
          leave: `${this.items[x].leave} x ${this.items[x].leaveNum}`,
          miss: `${this.items[x].miss} x ${this.items[x].missNum}`,
          final: this.items[x].final
        })
      }
      return r
    },
  },
}
</script>
