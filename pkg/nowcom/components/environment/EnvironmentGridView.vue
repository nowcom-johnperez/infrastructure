<template>
  <div class="environment-grid">
    <EnvironmentCard v-for="service in list" :key="service.name" :service="service" />
  </div>
</template>

<script>
import EnvironmentCard from './EnvironmentCard.vue';
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