<script>
import ResourceDetail from '../components/resource-manager/ResourceDetail.vue';
import { PRODUCT_NAME, RESOURCE_MANAGEMENT } from '../config/constants';
import { getConfig } from '../config/api';
const { CLUSTER } = getConfig();
export default {
  name:       'ResourceManagerCreate',
  components: { ResourceDetail },
  computed: {
    parentRouteOverride () {
      return `${PRODUCT_NAME}-c-cluster-${RESOURCE_MANAGEMENT}`
    },
    doneRoute() {
      return {
        name: `${PRODUCT_NAME}-c-cluster-${RESOURCE_MANAGEMENT}`,
        params: {
          cluster: CLUSTER
        }
      }
    },
  },
  methods: {
    done() {
      this.$router.replace(this.doneRoute)
    }
  }
};
</script>

<template>
  <ResourceDetail :doneEvent="true" @done="done" :parentRouteOverride="parentRouteOverride" />
</template>