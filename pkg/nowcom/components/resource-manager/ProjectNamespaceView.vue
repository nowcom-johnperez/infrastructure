<template>
  <div class="proj-namespace-detail-view">
    <div class="proj-namespace-detail-header">
      <div class="proj-namespace-detail-info">
        <h2 class="section-title">Project "{{ currentObj.spec.displayName }}"</h2>
        <p class="section-subtitle">List of namespaces under this project.</p>
      </div>
    </div>


    <div class="proj-namespace-detail-table">
      <ResourceTable
        ref="table"
        class="table project-namespaces-table"
        v-bind="$attrs"
        :schema="schema"
        :headers="headers"
        :rows="rows"
        :sort-generation-fn="sortGenerationFn"
        :loading="loading"
        group-tooltip="resourceTable.groupBy.project"
        key-field="_key"
        v-on="$listeners"
      >
        <template #cell:name="{row}">
          <span>{{ row.metadata.name }}</span>
        </template>
        <template #cell:memory="{ row }">
          <ConsumptionGauge
            :capacity="row.memory.total"
            :used="row.memory.useful"
            :units="row.memory.units"
          />
        </template>

        <template #cell:cpu="{ row }">
          <ConsumptionGauge
            :capacity="row.cpu.total"
            :used="row.cpu.useful"
          />
        </template>
        <template #row-actions="{ row }">
          <button type="button" class="btn role-secondary btn-sm" @click="editConfig(row)">Edit Config</button>
        </template>
      </ResourceTable>
    </div>
  </div>
</template>

<script>
import { PRODUCT_NAME } from '../../config/constants';
import { mapGetters } from 'vuex';
import { STATE, AGE, NAME, CPU, RAM } from '@shell/config/table-headers';
import {
  colorForState, mapStateToEnum, stateDisplay, stateSort
} from '@shell/plugins/dashboard-store/resource-class';
import {
  parseSi, createMemoryValues
} from '@shell/utils/units';
import { EventBus } from '../../config/event-bus';
import { MODE, _EDIT } from '@shell/config/query-params';
import { MANAGEMENT, NAMESPACE } from '@shell/config/types';
import ResourceTable, { defaultTableSortGenerationFn } from '@shell/components/ResourceTable';
import ConsumptionGauge from '@shell/components/ConsumptionGauge.vue'
import ResourceFetch from '@shell/mixins/resource-fetch';
import { harvesterService } from '../../services/api';
export default {
  name: 'ProjectNamespaceView',
  mixins: [ResourceFetch],
  props: {
    currentObj: {
      type: Object,
      required: true,
    }
  },
  components: {
    ResourceTable,
    ConsumptionGauge
  },
  data() {
    return {
      schema: '',
      harvesterNS: [],
      nsResourceQuotas: []
    }
  },
  async fetch() {
    const inStore = this.$store.getters['currentStore'](NAMESPACE);

    this.schema = this.$store.getters[`${ inStore }/schemaFor`](NAMESPACE);

    if ( !this.schema ) {
      // clusterReady:   When switching routes, it will cause clusterReady to change, causing itself to repeat rendering。
      // this.$store.dispatch('loadingError', `Type ${ NAMESPACE } not found`);

      return;
    }

    await this.$fetchType(NAMESPACE);
    this.harvesterNS = await harvesterService.getNamespaces()
    this.nsResourceQuotas = await harvesterService.getNamespaceQuota()
  },
  mounted() {
    this.$fetch()
  },
  computed: {
    ...mapGetters(['currentCluster', 'currentProduct']),
    rows() {
      if (this.harvesterNS.length === 0) return []

      return this.harvesterNS.filter((ns) => {
        return ns.metadata?.labels['field.cattle.io/projectId'] === this.currentObj?.metadata?.name || ns.name === this.currentObj?.metadata.name
      }).map((namespace) => {
        const resourceQuota = namespace.metadata?.annotations['field.cattle.io/resourceQuota'] ? JSON.parse(namespace.metadata?.annotations['field.cattle.io/resourceQuota']) : {}
        const state = namespace.metadata?.fields[1]
        const color = colorForState(state).replace('text-', 'bg-');
        const display = stateDisplay(state);
        const quota = this.nsResourceQuotas.find((res) => res.metadata?.namespace === namespace.id) || {}

        const cpuReserved = parseSi(quota?.status?.hard['limits.cpu'] || 0)
        const cpuUsed = parseSi(quota?.status?.used['limits.cpu'] || 0)

        const memoryReserved = parseSi(quota?.status?.hard['limits.memory'] || 0)
        const memoryUsed = parseSi(quota?.status?.used['limits.memory'] || 0)

        const memory = createMemoryValues(memoryReserved, memoryUsed)
        const cpu = createMemoryValues(cpuReserved, cpuUsed)

        return {
          ...namespace,
          state:                  mapStateToEnum(state),
          stateBackground:        color,
          stateDisplay:           display,
          stateSort:              stateSort(color, display),
          creationTimestamp:      namespace.metadata?.creationTimestamp,
          memory,
          cpu,
          resourceQuota,
        }
      })
    },
    headers() {
      const additional = [
        {
          name: 'cpu',
          label: 'CPU',
          sort: ['cpu'],
          search: ['cpu'],
        },
        {
          name: 'memory',
          label: 'Memory',
          sort: ['memory'],
          search: ['memory'],
        },
      ]
      return [
        STATE,
        NAME,
        ...additional,
        // CPU,
        // RAM,
        AGE
      ].filter((h) => h);
    },
  },
  methods: {
    sortGenerationFn() {
      // The sort generation function creates a unique value and is used to create a key including sort details.
      // The unique key determines if the list is redrawn or a cached version is shown.
      // Because we ensure the 'not in a project' group is there via a row, and timing issues, the unqiue key doesn't change
      // after a namespace is removed... so the list won't update... so we need to inject a string to ensure the key is fresh
      const base = defaultTableSortGenerationFn(this.schema, this.$store);

      return base + (this.showMockNotInProjectGroup ? '-mock' : '');
    },

    editConfig(namespace) {
      const namespaceEditLocation = {
        name:   'c-cluster-product-resource-id',
        params: {
          product: 'explorer',
          cluster:  this.currentCluster.id,
          resource: NAMESPACE,
          id: namespace?.metadata?.name || ''
        },
        query: { [MODE]: _EDIT },
        hash: '#container-resource-limit'
      }
      this.$router.push(namespaceEditLocation)
    }
  }
}
</script>