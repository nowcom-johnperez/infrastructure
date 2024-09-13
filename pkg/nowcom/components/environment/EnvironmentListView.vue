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
        <span @click="checkStatus(row)">
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
import { ENVIRONMENT_HEADERS } from '../../config/table'
import { EventBus } from '../../config/event-bus';
export default {
  name: 'EnvironmentListView',
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  data() {
    const headers = ENVIRONMENT_HEADERS;
    return {
      headers,
    }
  },
  components: {
    SortableTable,
    BadgeState
  },
  methods: {
    checkStatus (env) {
      EventBus.$emit('env-modal-status', env)
    },
    getBadgeColor (status) {
      let color = 'clickable ml-20 mr-20'

      if (status === 'Processing') {
        color += ' bg-info'
      } else if (status === 'Done') {
        color += ' bg-success'
      } else {
        color += ' bg-error'
      }

      return color;
    },
  }
}
</script>