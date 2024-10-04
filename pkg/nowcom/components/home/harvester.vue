<template>
  <div>
    <p>Harvester Dashboard Schema: <pre>{{ hasHarvesterDashboard }}</pre></p>
    <p>Harvester Config Schema: <pre>{{ hasHarvesterConfig }}</pre></p>
    <p>Harvester Cluster Schema: <pre>{{ hasHarvesterCluster }}</pre></p>
    <p>Cluster</p>
    <pre>
      {{ clusters }}
    </pre>
  </div>
</template>

<script>
import { HCI } from '@shell/config/types';
export default {
  name: 'HarvesterTest',
  computed: {
    hasHarvesterDashboard() {
      const schema = this.$store.getters['management/schemaFor'](HCI.DASHBOARD);

      return schema
      // return !!schema?.collectionMethods.find((x) => x.toLowerCase() === 'post');
    },

    hasHarvesterCluster() {
      const schema = this.$store.getters['management/schemaFor'](HCI.CLUSTER);

      return schema
      // return !!schema?.collectionMethods.find((x) => x.toLowerCase() === 'post');
    },

    hasHarvesterConfig() {
      const schema = this.$store.getters['management/schemaFor'](HCI.HARVESTER_CONFIG);

      return schema
      // return !!schema?.collectionMethods.find((x) => x.toLowerCase() === 'post');
    },

    clusters() {
      return this.$store.dispatch('management/find', { type: HCI.CLUSTER })
    },

    allClusters() {
      return this.$store.dispatch('management/findAll', { type: HCI.CLUSTER })
    }
  },
}
</script>