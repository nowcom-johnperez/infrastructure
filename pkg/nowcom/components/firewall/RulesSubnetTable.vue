<template>
  <SortableTable :headers="headers" :rows="items" :rowActions="false" :rows-per-page="5" keyField="name" defaultSortBy="name" defaultSortOrder="asc">
    <template #cell:longName="{row}">
      <span>{{ row.displayName || row.longName }}</span>
    </template>
  </SortableTable>
</template>

<script>
import { RULES_SUBNET_TRANSLATIONS } from '../../config/table'
import SortableTable from '@shell/components/ResourceTable.vue'
import SideBar from '../Sidebar'
import cButton from '../common/Button'
export default {
  name: 'RulesSubnetTable',
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  components: {
    SortableTable,
    SideBar,
    cButton,
  },
  data() {
    return {
      headers: []
    }
  },
  methods: {
    onRowClick(row) {
      this.$emit('onRowClick', row)
    },
    onDeleteClick(row) {
      this.$emit('onDeleteClick', row)
    }
  },
  created() {
    this.headers = RULES_SUBNET_TRANSLATIONS;
  },
}
</script>