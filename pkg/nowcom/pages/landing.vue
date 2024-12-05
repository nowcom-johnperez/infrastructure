<template>
  <div>
    landing
    <pre>
      {{clusters}}
    </pre>
  </div>
</template>

<script>
import {
  parseSi, formatSi, exponentNeeded, UNITS, createMemoryValues
} from '@shell/utils/units';
import { MANAGEMENT } from '@shell/config/types';

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
  name: 'Landing',
  data() {
    return {
      clusters: []
    }
  },

  async fetch() {
    const clusters = await this.$store.dispatch('management/findAll', { type: MANAGEMENT.CLUSTER })
    this.clusters = clusters.map((cluster) => {
      const format = this.createMemoryUnits(cluster.status?.capacity?.memory)
      return {
        id: cluster.id,
        creatorId: cluster.metadata?.annotations['field.cattle.io/creatorId'],
        ownerNamespace: cluster.metadata?.annotations['objectset.rio.cattle.io/owner-namespace'],
        displayName: cluster.spec?.displayName,
        fleetWorkspaceName: cluster.spec?.fleetWorkspaceName,
        capacity: {
          cpu: cluster.status?.capacity?.cpu,
          memory: formatSi(parseSi(cluster.status?.capacity?.memory), format)
        }
      }
    })
  },

  methods: {
    createMemoryUnits(n) {
      const exponent = exponentNeeded(n, PARSE_RULES.memory.format.increment);

      return `${ UNITS[exponent] }${ PARSE_RULES.memory.format.suffix }`;
    },
  }
}
</script>