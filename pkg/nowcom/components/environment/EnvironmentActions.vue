<template>
  <div class="environment-actions">
    
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
      >
        <i class="fa fa-trash mr-5"></i>
        {{ t('environment.delete') }}
      </router-link>
      <router-link
        v-if="canCreateCluster"
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
import { CAPI } from '@shell/config/types';
import { BLANK_CLUSTER } from '@shell/store/store-types.js';
import { PRODUCT_NAME, ENVIRONMENT } from '../../config/constants';
export default {
  name: 'EnvironmentActions',
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
  },
  computed: {
    canCreateCluster() {
      const schema = this.$store.getters['management/schemaFor'](CAPI.RANCHER_CLUSTER);

      return !!schema?.collectionMethods.find((x) => x.toLowerCase() === 'post');
    },

    createLocation() {
      return {
        name:   `${PRODUCT_NAME}-c-cluster-${ENVIRONMENT}-create`,
        params: {
          product:  PRODUCT_NAME,
          cluster:  BLANK_CLUSTER,
        },
      };
    },
  }
}
</script>

<style lang="scss" scoped>
.environment-actions {
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