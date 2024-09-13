<template>
  <div class="shared-services-grid">
    <ServiceCard v-for="service in list" :key="service.name" :service="service" />
  </div>
</template>

<script>
import ServiceCard from './ServiceCard.vue';
export default {
  name: 'SharedServicesGridView',
  props: {
    list: {
      type: Array,
      required: true,
    }
  },
  components: {
    ServiceCard
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
  .shared-services-grid {
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
</style>