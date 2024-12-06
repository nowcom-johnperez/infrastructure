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
          <!-- <BadgeState
          :label="row.status"
          :color="badgeColor(row.status)"
          /> -->
          <EnvironmentStatus :show-label="false" :statuses="row.statuses" />
        </span>
      </td>
    </template>
    <template #col:name="{ row }">
      <td>
        <div class="list-cluster-name">
          <a href="#" @click.prevent="viewItem(row)">{{ row.metadata?.name }}</a>
        </div>
      </td>
    </template>
    <template #col:size="{ row }">
      <td>
        {{ row.spec?.clusterSize }}
      </td>
    </template>
    <template #col:networkPolicy="{ row }">
      <td>
        {{ row.spec?.networkPolicy }}
      </td>
    </template>
    <template #col:networkType="{ row }">
      <td>
        {{ row.spec?.networkType }}
      </td>
    </template>
  </SortableTable>
</template>

<script>
import EnvironmentStatus from '../environment/EnvironmentStatus.vue';
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
    BadgeState,
    EnvironmentStatus
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