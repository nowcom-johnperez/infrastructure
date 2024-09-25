<template>
  <div>
    <div class="shared-services-grid">
      <ServiceCard
        v-for="service in paginatedList"
        :key="service.name"
        :service="service"
        @view-click="viewItem"
      />
    </div>

    <GridPagination :total-pages="totalPages" @page-update="(page) => currentPage = page" />
  </div>
</template>

<script>
import ServiceCard from './ServiceCard.vue';
import SharedServiceView from './SharedServiceView.vue';
import GridPagination from '../common/GridPagination.vue';
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
    ServiceCard,
    GridPagination
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 6
    };
  },
  computed: {
    paginatedList() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      return this.list.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.list.length / this.pageSize);
    }
  },
  methods: {
    viewItem(item) {
      EventBus.$emit('component-view', {
        item,
        component: SharedServiceView
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.shared-services-grid {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
</style>
