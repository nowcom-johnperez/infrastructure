<template>
  <SortableTable
    :table-actions="false"
    :row-actions="false"
    key-field="id"
    :rows="list"
    :headers="headers"
    :loading="!list"
    :paging="true" 
    :rows-per-page="10"
    :search="false"
  >
    <template #col:status="{row}">
      <td>
        <span>
          <BadgeState
          :label="row.status"
          :color="getBadgeColor(row.status)"
          />
        </span>
      </td>
    </template>
  </SortableTable>
</template>

<script>
import SortableTable from '@shell/components/SortableTable';
import { BadgeState } from '@components/BadgeState';
import { SHARED_SERVICES_HEADERS } from '../../config/table'
export default {
  name: 'EnvironmentListView',
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  data() {
    const headers = SHARED_SERVICES_HEADERS;
    return {
      headers,
    }
  },
  components: {
    SortableTable,
    BadgeState
  },
  methods: {
    getBadgeColor (status) {
      let color = 'clickable ml-20 mr-20'

      if (status === 'Pending') {
        color += ' bg-info'
      } else if (status === 'Approved') {
        color += ' bg-success'
      } else {
        color += ' bg-error'
      }

      return color;
    },
  }
}
</script>