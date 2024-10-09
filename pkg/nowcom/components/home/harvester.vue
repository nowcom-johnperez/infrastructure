<template>
  <div>
    <p>Harvester Dashboard: <pre>{{ dashboard }}</pre></p>
    <p>Harvester Config Schema: <pre>{{ hasHarvesterConfig }}</pre></p>
    <p>Harvester Cluster Schema: <pre>{{ hasHarvesterCluster }}</pre></p>
    <p>Cluster</p>
    <pre>
      {{ cluster }}
    </pre>

    <p>All Clusters</p>
    <pre>{{ clusters }}</pre>

    <!-- <p>Test</p>
    <pre>{{ getAllManage }}</pre> -->
  </div>
</template>

<script>
import { HCI, MANAGEMENT } from '@shell/config/types';
import { allHash } from '@shell/utils/promise';
import { harvesterService } from '../../services/api';
export default {
  name: 'HarvesterTest',
  data() {
    return {
      cluster: null,
      clusters: [],
      dashboard: null
    }
  },
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

    // getAllManage() {
    //   return this.$store.getters['management/all'](HCI.CLUSTER)
    // }
  },

  async fetch() {
    // const hash = await allHash({
    //   hciClusters:  this.$store.dispatch(`management/findAll`, { type: HCI.CLUSTER }),
    //   mgmtClusters: this.$store.dispatch(`management/findAll`, { type: MANAGEMENT.CLUSTER })
    // });

    this.cluster = await harvesterService.getAll()
    this.clusters = await harvesterService.getUserTemplates()

    console.log(`test`, this.cluster)
    console.log(`user data template`, this.clusters)
    // this.clusters = hash.mgmtClusters
  },

  methods: {
  }
}
</script>