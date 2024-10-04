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
  </div>
</template>

<script>
import { HCI } from '@shell/config/types';
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
  },

  methods: {
    async getCluster() {
      this.cluster = await this.$store.dispatch('management/find', { type: HCI.CLUSTER, id: 'c-m-sdtmhjdg' })
    },
    async getAllCluster() {
      this.clusters = await this.$store.dispatch('management/findAll', { type: HCI.CLUSTER })
    },
    async getDashboard() {
      this.dashboard = await this.$store.dispatch('management/findAll', { type: HCI.DASHBOARD })
    },
    async testDirectCall() {
      fetch('/v1/harvesterhci.io.clusters')
      .then(response => response.json())
      .then(data => {
        console.log('API Data:', data);
      })
      .catch(error => {
        console.error('Error fetching from API:', error);
      });
    }
  },

  mounted() {
    this.getAllCluster()
    // this.getCluster()
    // this.getDashboard()
    // this.testDirectCall()
  }
}
</script>