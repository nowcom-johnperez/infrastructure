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
  </SortableTable>
</template>

<script>
import SortableTable from '@shell/components/SortableTable';
import { BadgeState } from '@components/BadgeState';
import { SHARED_SERVICES_HEADERS } from '../../config/table'
import { getBadgeColor } from '../../services/helpers/shared-service';
import SharedServiceView from './SharedServiceView.vue';
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
    badgeColor (status) {
      return getBadgeColor(status)
    },
    viewItem(item) {
      EventBus.$emit('component-view', {
        item,
        component: SharedServiceView
      })
    }
  }
}
</script>