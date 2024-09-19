<template>
  <div class="environment-grid">
    <EnvironmentCard v-for="service in list" :key="service.name" :service="service" @view-click="viewItem" />
  </div>
</template>

<script>
import EnvironmentView from '../environment/EnvironmentView.vue';
import EnvironmentCard from './EnvironmentCard.vue';
import { EventBus } from '../../config/event-bus';
export default {
  name: 'EnvironmentGridView',
  props: {
    list: {
      type: Array,
      required: true,
    }
  },
  components: {
    EnvironmentCard
  },
  data() {
    return {}
  },
  methods: {
    viewItem(item) {
      EventBus.$emit('component-view', {
        item,
        component: EnvironmentView
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .environment-grid {
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
</style>