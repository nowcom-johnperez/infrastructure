<template>
  <div>
    <div v-if="!loading">
      <template v-if="list.length > 0">
        <div class="environment-grid">
          <EnvironmentCard v-for="service in paginatedList" :key="service.name" :service="service" @view-click="viewItem" />
        </div>

        <GridPagination :total-pages="totalPages" @page-update="updatePage" :page="currentPage" />
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
    },
    currentPage: {
      type: Number,
      default: 1,
    }
  },
  components: {
    EnvironmentCard,
    GridPagination,
    Banner
  },
  data() {
    return {
      page: 1,
      pageSize: 6
    }
  },
  watch: {
    currentPage(value) {
      if (value !== this.page) {
        this.page = value
      }
    },
  },
  computed: {
    paginatedList() {
      const start = (this.page - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      return this.list.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.list.length / this.pageSize);
    },
  },
  methods: {
    updatePage(p) {
      this.page = p
      this.$emit('onUpdatePage', this.page)
    },
    viewItem(item) {
      EventBus.$emit('component-view', {
        item,
        component: EnvironmentView
      })
    },
  },
  mounted() {
    this.page = this.currentPage
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