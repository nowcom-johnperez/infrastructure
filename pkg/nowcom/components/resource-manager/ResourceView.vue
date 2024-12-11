<template>
  <div>
    <CustomCapacity />
    <div class="mb-30">
       <CustomProjectNamespace :create-project-location-override="customProjectCreateLocation" />
    </div>
  </div>
</template>

<script>
import { PRODUCT_NAME, RESOURCE_MANAGEMENT } from '../../config/constants';
import CustomProjectNamespace from './CustomProjectNamespace.vue';
import CustomCapacity from './CustomCapacity.vue';
import { MANAGEMENT } from '@shell/config/types';
export default {
  name: 'ResourceView',
  components: {
    CustomCapacity,
    CustomProjectNamespace
  },
  computed: {
    customProjectCreateLocation() {
      return {
        name: `${PRODUCT_NAME}-c-cluster-${RESOURCE_MANAGEMENT}-create`,
        params: {
          resource: MANAGEMENT.PROJECT,
          product:  this.$store.getters['currentProduct'].name,
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.capacity-container {
  display: flex;
  justify-content: space-evenly;
}
</style>