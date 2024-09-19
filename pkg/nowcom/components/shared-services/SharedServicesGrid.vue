<template>
  <div class="shared-services-grid">
    <ServiceCard v-for="service in list" :key="service.name" :service="service" @view-click="viewItem" />
  </div>
</template>

<script>
import ServiceCard from './ServiceCard.vue';
import SharedServiceView from './SharedServiceView.vue';
import { EventBus } from '../../config/event-bus';
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
  methods: {
    viewItem (item) {
      EventBus.$emit('component-view', {
        item,
        component: SharedServiceView
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .shared-services-grid {
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
</style>