<template>
  <div v-if="nodes.length && hasMetricNodeSchema" class="mb-20">
    <h3 class="mt-40">
      {{ t('clusterIndexPage.sections.capacity.label') }}
    </h3>
    <div
      class="hardware-resource-gauges"
      :class="{
        live: !hasLonghornSchema,
      }"
    >
      <HardwareResourceGauge
        :name="'CPU'"
        :reserved="cpuReserved"
        :used="cpuUsed"
      />
      <HardwareResourceGauge
        :name="'Memory'"
        :reserved="ramReserved"
        :used="ramUsed"
      />
      <HardwareResourceGauge
        v-if="hasLonghornSchema"
        :name="'Storage'"
        :used="storageUsed"
        :reserved="storageAllocated"
        :reserved-title="t('harvester.dashboard.hardwareResourceGauge.allocated')"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  parseSi, formatSi, exponentNeeded, UNITS, createMemoryValues
} from '@shell/utils/units';
import { METRIC, LONGHORN } from '@shell/config/types';
import { allHash } from '@shell/utils/promise';
import HardwareResourceGauge from '@shell/components/HardwareResourceGauge';
import { harvesterService } from '../../services/api';
import metricPoller from '@shell/mixins/metric-poller';

const PARSE_RULES = {
  memory: {
    format: {
      addSuffix:        true,
      firstSuffix:      'B',
      increment:        1024,
      maxExponent:      99,
      maxPrecision:     2,
      minExponent:      0,
      startingExponent: 0,
      suffix:           'iB',
    }
  }
};

export default {
  name: 'ResourceView',
  mixins: [metricPoller],
  components: {
    HardwareResourceGauge,
  },

  async fetch() {
    const hash = {
      longhornNodes:    harvesterService.fetchHarvester(LONGHORN.NODES),
      longhornSettings: harvesterService.fetchHarvester(LONGHORN.SETTINGS),
      nodes: harvesterService.getClusterNodes(),
      metricNodes: harvesterService.getMetricNodes()
    }

    const res = await allHash(hash)

    for ( const k in res ) {
      this[k] = res[k];
    }

    this.loadMetrics()
  },

  data() {
    return {
      nodes: [],
      metricNodes: [],
      projects: [],
      longhornSettings: [],
      longhornNodes: [],
      hasLonghornSchema: true,
      totalCPU: 0,
      totalMemory: 0,
      totalUsageCPU: 0,
      totalUsageMemory: 0
    }
  },
  computed: {
    ...mapGetters(['currentCluster']),
    hasMetricNodeSchema() {
      const inStore = this.$store.getters['currentProduct'].inStore;

      return !!this.$store.getters[`${ inStore }/schemaFor`](METRIC.NODE);
    },

    storageStats() {
      const storageOverProvisioningPercentageSetting = this.longhornSettings.find(s => s.id === 'longhorn-system/storage-over-provisioning-percentage');
      const stats = this.longhornNodes.reduce((total, node) => {
        const disks = node?.spec?.disks || {};
        const diskStatus = node?.status?.diskStatus || {};

        // total.used += node?.spec?.allowScheduling ? node.used : 0;

        Object.keys(disks).map((key) => {
          total.scheduled += node?.spec?.allowScheduling ? (diskStatus[key]?.storageScheduled || 0) : 0;
          total.reserved += disks[key]?.storageReserved || 0;
        });
        Object.values(diskStatus).map((diskStat) => {
          total.maximum += diskStat?.storageMaximum || 0;
          if (diskStat?.storageAvailable && diskStat?.storageMaximum) {
            total.used += diskStat.storageMaximum - diskStat.storageAvailable;
          }
        });

        return total;
      }, {
        used:      0,
        scheduled: 0,
        maximum:   0,
        reserved:  0,
        total:     0
      });

      stats.total = ((stats.maximum - stats.reserved) * Number(storageOverProvisioningPercentageSetting?.value ?? 0)) / 100;

      return stats;
    },

    cpuReserved() {
      const total = parseSi(this.currentCluster?.status?.allocatable?.cpu);

      return {
        total,
        useful: parseSi(this.currentCluster?.status?.requested?.cpu),
        units:  this.t('clusterIndexPage.hardwareResourceGauge.units.cores', { count: total })
      };
    },

    cpuUsed() {
      return {
        total:  this.totalCPU,
        useful: this.totalUsageCPU,
      };
    },

    ramReserved() {
      return createMemoryValues(this.currentCluster?.status?.allocatable?.memory, this.currentCluster?.status?.requested?.memory);
    },

    ramUsed() {
      return createMemoryValues(this.totalMemory, this.totalUsageMemory);
      
    },

    storageUsed() {
      const stats = this.storageStats;
      return this.createMemoryValues(stats.maximum, stats.used);
    },

    storageAllocated() {
      const stats = this.storageStats;
      const reserved = this.nodes.reduce((total, node) => {
        total += parseSi(node.status?.capacity['ephemeral-storage'] || 0) - parseSi(node.status?.allocatable['ephemeral-storage'] || 0)
        return total;
      }, 0)
      return this.createMemoryValues(stats.maximum, stats.reserved);
    },
  },

  methods: {
    createMemoryValues(total, useful) {
      const parsedTotal = parseSi((total || '0').toString());
      const parsedUseful = parseSi((useful || '0').toString());
      const format = this.createMemoryFormat(parsedTotal);
      const formattedTotal = formatSi(parsedTotal, format);
      let formattedUseful = formatSi(parsedUseful, {
        ...format,
        addSuffix: false,
      });

      if (!Number.parseFloat(formattedUseful) > 0) {
        formattedUseful = formatSi(parsedUseful, {
          ...format,
          canRoundToZero: false,
        });
      }

      return {
        total:  Number(parsedTotal),
        useful: Number(parsedUseful),
        formattedTotal,
        formattedUseful,
        units:  this.createMemoryUnits(parsedTotal),
      };
    },

    createMemoryFormat(n) {
      const exponent = exponentNeeded(n, PARSE_RULES.memory.format.increment);

      return {
        ...PARSE_RULES.memory.format,
        maxExponent: exponent,
        minExponent: exponent,
      };
    },

    createMemoryUnits(n) {
      const exponent = exponentNeeded(n, PARSE_RULES.memory.format.increment);

      return `${ UNITS[exponent] }${ PARSE_RULES.memory.format.suffix }`;
    },

    async fetchClusterResources(type, opt = {}, store) {
      const inStore = store || this.$store.getters['currentProduct'].inStore;

      const schema = this.$store.getters[`${ inStore }/schemaFor`](type);

      if (schema) {
        try {
          const resources = await this.$store.dispatch(`${ inStore }/findAll`, { type, opt });

          return resources;
        } catch (err) {
          console.error(`Failed fetching cluster resource ${ type } with error:`, err); // eslint-disable-line no-console

          return [];
        }
      }

      return [];
    },

    async loadMetrics() {
      const metricNodes = await harvesterService.getMetricNodes()

      let totalCPU = 0
      let totalMemory = 0
      let totalUsageCPU = 0
      let totalUsageMemory = 0

      this.nodes.forEach((n) => {
        totalCPU += parseSi(n.status?.capacity.cpu || 0)
        totalMemory += parseSi(n.status?.capacity.memory || 0)
      })

      metricNodes.forEach((t) => {
        totalUsageCPU += parseSi(t.usage?.cpu || 0)
        totalUsageMemory += parseSi(t.usage?.memory || 0)
      })

      this.totalCPU = totalCPU
      this.totalMemory = totalMemory

      this.totalUsageCPU = totalUsageCPU
      this.totalUsageMemory = totalUsageMemory

      this.metricNodes = metricNodes
    },
  }
}
</script>

<style lang="scss" scoped>
.capacity-container {
  display: flex;
  justify-content: space-evenly;
}
</style>