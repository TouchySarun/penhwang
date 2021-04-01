<template>
  <v-card>
    <v-card-title>
      กราฟสรุปประวัติย้อนหลัง
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
    >
      <template v-slot:item.inTime="{ item }">
        <v-chip
          color="#43A047"
          dark
        >
          {{ item.inTime }}
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
    </v-data-table>
  </v-card>
</template>
<script>
export default {
  props: ['items'],
  data: ()=>({
    search: null,
    headers: [
      {
        text: 'วันที่',
        align: 'start',
        value: 'date',
      },
      { text: 'ตรงเวลา', value: 'inTime' },
      { text: 'สาย', value: 'late' },
      { text: 'ลา', value: 'leave' },
      { text: 'ขาด', value: 'miss' },
    ],

  })
}
</script>
