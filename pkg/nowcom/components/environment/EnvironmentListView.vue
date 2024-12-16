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
    <template #col:explorer="{ row }">
      <td>
        <a v-if="row?.clusterId !== 'Pending'" :href="`/c/${row.clusterId}/explorer#cluster-events`" @click.prevent="exploreCluster(row.clusterId)" class="btn role-secondary btn-sm">
          Explore
        </a>

        <button v-if="canDelete" class="btn btn-sm btn-danger ml-5" @click="deleteItem(row)">
          <i class="icon icon-trash" />
        </button>
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
import { CAPI } from '@shell/config/types';
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
  computed: {
    canDelete() {
      const schema = this.$store.getters['management/schemaFor'](CAPI.RANCHER_CLUSTER);
      return !!schema?.resourceMethods.find((x) => x.toLowerCase() === 'delete');
    },
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
    },
    deleteItem(env) {
      EventBus.$emit('env-modal-delete', env)
    },
    exploreCluster(clusterId) {
      this.$router.push(`/c/${clusterId}/explorer#cluster-events`)
    }
  }
}
</script>