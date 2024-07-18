<template>
  <SortableTable :headers="headers" :rows="items" :rowActionsWidth="10" :rows-per-page="5" keyField="name" defaultSortBy="priority" defaultSortOrder="asc">
    <template #cell:name="{row}">
      <a v-if="row.priority <= 999" href="#" @click.prevent="onRowClick(row)">{{ row.name || row.longName }}</a>
      <span v-else>{{ row.name || row.longName }}</span>
    </template>
    <template #cell:action="{row}">
      <span>
        <i v-if="row.action === 'Allow'" class="fa fa-check mr-5" aria-hidden="true" style="color: green"></i>
        <i v-else class="fa fa-close mr-5" aria-hidden="true" style="color: red"></i>
        {{ row.action }}
      </span>
    </template>
    <template #row-actions="{row}">
      <cButton class="cbtn btn-primary" :disabled="row.priority > 999" @click="onDeleteClick(row)">
        <span class="fa fa-trash fa-lg mr-5"></span> Delete
      </cButton>
    </template>
  </SortableTable>
</template>

<script>
import { RULES_HEADERS } from '../../config/table'
import SortableTable from '@shell/components/ResourceTable.vue'
import SideBar from '../Sidebar'
import cButton from '../common/Button'
export default {
  name: 'Inbound',
  props: {
    vnetId: {
      type: String,
      required: true
    },
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
    this.headers = RULES_HEADERS;
  },
}
</script>