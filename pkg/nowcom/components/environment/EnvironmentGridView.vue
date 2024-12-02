<template>
  <div>
    <div v-if="!loading">
      <template v-if="list.length > 0">
        <div class="environment-grid">
          <EnvironmentCard v-for="service in list" :key="service.name" :service="service" @view-click="viewItem" />
        </div>

        <GridPagination :total-pages="totalPages" @page-update="(page) => currentPage = page" />
      </template>
      <template v-else>
        <Banner
          data-testid="no-data-found"
          color="error"
        >
          <p>No environment found</p>
        </Banner>
      </template>
    </div>

    <div v-if="loading">Loading Please wait...</div>
  </div>
    
</template>

<script>
import EnvironmentView from '../environment/EnvironmentView.vue';
import EnvironmentCard from './EnvironmentCard.vue';
import GridPagination from '../common/GridPagination.vue';
import { Banner } from '@components/Banner';
import { EventBus } from '../../config/event-bus';

export default {
  name: 'EnvironmentGridView',
  props: {
    list: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    EnvironmentCard,
    GridPagination,
    Banner
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 6
    }
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
        component: EnvironmentView
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  .environment-grid {
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  }
</style>