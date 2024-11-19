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
          :color="badgeColor(row.status)"
          />
        </span>
      </td>
    </template>
    <template #col:name="{ row }">
      <td>
        <div class="list-cluster-name">
          <a href="#" @click.prevent="viewItem(row)">{{ row.name }}</a>
        </div>
      </td>
    </template>
    <template #col:cpu="{ row }">
      <td>
        <tr>
          <td align="left">
            {{ row.sizeInfo.master.cpu }} / {{ row.sizeInfo.master.memory }}G
          </td>
        </tr>
        <tr v-if="row.sizeInfo.worker">
          <td  align="left">
            {{ row.sizeInfo.worker.cpu }} / {{ row.sizeInfo.worker.memory }}G
          </td>
        </tr>
      </td>
    </template>
    <template #col:role="{ row }">
      <td>
        <tr>
          <td align="left">
            {{ row.sizeInfo.master.role }}
          </td>
        </tr>
        <tr v-if="row.sizeInfo.worker">
          <td  align="left">
            {{ row.sizeInfo.worker.role }}
          </td>
        </tr>
      </td>
    </template>
  </SortableTable>
</template>

<script>
import EnvironmentView from '../environment/EnvironmentView.vue';
import SortableTable from '@shell/components/SortableTable';
import { BadgeState } from '@components/BadgeState';
import { ENVIRONMENT_HEADERS } from '../../config/table'
import { getBadgeColor } from '../../services/helpers/environment'
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
    badgeColor (status) {
      return getBadgeColor(status)
    },
    checkStatus (env) {
      EventBus.$emit('env-modal-status', env)
    },
    viewItem(item) {
      EventBus.$emit('component-view', {
        item,
        component: EnvironmentView
      })
    }
  }
}
</script>