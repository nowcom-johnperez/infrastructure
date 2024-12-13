<script>
// import ComingSoon from '../../common/ComingSoon.vue';
import { SHARED_SERVICES_DATA } from '../../../config/constants';
import ServiceCard from '../../shared-services/ServiceCard.vue';

export default {
  name: 'LinkServicesViewTab',
  data() {
    const sharedServicesList = SHARED_SERVICES_DATA
    return {
      sharedServicesList
    }
  },
  components: {
    ServiceCard
  }
}
</script>

<template>
  <div>
    <div class="shared-services-grid">
      <ServiceCard
        v-for="service in sharedServicesList"
        :key="service.name"
        :service="service"
        btn-label="Connection Info"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .shared-services-grid {
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
</style>