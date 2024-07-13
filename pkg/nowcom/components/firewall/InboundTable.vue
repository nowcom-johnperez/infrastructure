<template>
  <SortableTable :headers="headers" :rows="inbound" :rowActionsWidth="10" :rows-per-page="5" keyField="priority" :loading="loading">
    <template #cell:longName="{row}">
      <span>{{ row.displayName || row.longName }}</span>
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
      inbound: [],
      headers: []
    }
  },
  created() {
    this.headers = RULES_HEADERS;
  },
}
</script>