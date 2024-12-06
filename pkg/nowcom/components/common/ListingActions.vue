<template>
  <div class="listing-actions">
    
    <div class="header">
      <slot name="header">
        <h1>{{ headerLabel }}</h1>
      </slot>
    </div>
    <div class="table-heading">
      <router-link
        to="#"
        class="btn btn-sm role-secondary mr-5"
        data-testid="cluster-delete-button"
        v-if="false"
      >
        <i class="fa fa-trash mr-5"></i>
        {{ t('environment.delete') }}
      </router-link>
      <router-link
        v-if="canCreate"
        :to="createLocation"
        class="btn btn-sm role-primary mr-5"
        data-testid="cluster-create-button"
      >
        <i class="fa fa-plus mr-5"></i>
        {{ t('generic.create') }}
      </router-link>
    </div>
    <div class="search-input">
      <input :value="searchQuery" placeholder="Filter" @input="$emit('update:search-query', $event.target.value)" />
    </div>
    <button class="btn btn-sm role-primary mr-5" @click="$emit('set-view', 'grid')">
      <i class="icon icon-apps" />
    </button>
    <button class="btn btn-sm role-primary" @click="$emit('set-view', 'list')">
      <i class="icon icon-list-flat" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'ListingActions',
  props: {
    headerLabel: {
      type: String,
      default: 'Environments'
    },
    searchQuery: {
      type: String,
      required: true,
    },
    isGridView: {
      type: Boolean,
      required: true,
    },
    canCreate: {
      type: Boolean,
      default: false
    },
    createLocation: {
      type: Object,
      default: () => {}
    }
  },
}
</script>

<style lang="scss" scoped>
.listing-actions {
  display: flex;
  margin-bottom: 20px;
  align-items: center;

  .table-heading {
    margin-top: 5px;
  }

  .header {
    margin-right: auto;
  }

  .search-input {
    margin-right: 10px;
  }

  input {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 5px 10px;
    height: 36px;
    font-size: 14px;
    
  }

  button {
    height: 36px;
  }

  .icon {
    font-size: 18px;
  }
}
</style>