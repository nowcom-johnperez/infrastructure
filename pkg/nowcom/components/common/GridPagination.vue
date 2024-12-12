<template>
  <div class="pagination-controls">
    <button :disabled="currentPage === 1" @click="prevPage" class="btn role-primary btn-sm">Previous</button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button :disabled="currentPage === totalPages" @click="nextPage" class="btn role-primary btn-sm">Next</button>
  </div>
</template>

<script>
export default {
  name: 'GridPagination',
  props: {
    totalPages: {
      type: Number,
      required: true
    },
    page: {
      type: Number,
      default: 1,
    }
  },
  data() {
    return {
      currentPage: 1,
    }
  },
  watch: {
    page(value) {
      if (value !== this.currentPage) {
        this.currentPage = value
      }
    }
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.$emit('page-update', this.currentPage)
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.$emit('page-update', this.currentPage)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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