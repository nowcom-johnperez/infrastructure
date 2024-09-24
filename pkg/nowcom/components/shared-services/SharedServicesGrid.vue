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

    <!-- Pagination Controls -->
    <div class="pagination-controls">
      <button :disabled="currentPage === 1" @click="prevPage" class="btn role-primary btn-sm">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="nextPage" class="btn role-primary btn-sm">Next</button>
    </div>
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
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.shared-services-grid {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;

  button {
    margin: 0 1rem;
  }
}
</style>
