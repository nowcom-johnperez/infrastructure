<template>
  <SortableTable :headers="headers" :rows="items" :rowActionsWidth="10" :rows-per-page="5" keyField="name" :loading="loading">
    <template #cell:longName="{row}">
      <span>{{ row.displayName || row.longName }}</span>
    </template>
    <template #cell:action="{row}">
      <span>
        <i v-if="row.action === 'Allow'" class="fa fa-check mr-5" aria-hidden="true" style="color: green"></i>
        <i v-else class="fa fa-close mr-5" aria-hidden="true" style="color: red"></i>
        {{ row.action }}
      </span>
    </template>
    <template #row-actions="row">
      <cButton class="cbtn btn-primary" :disabled="loading || !row.isEnabled">
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
      loading: false,
      headers: []
    }
  },
  created() {
    this.headers = RULES_HEADERS;
  },
}
</script>