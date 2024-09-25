<template>
  <div
    v-if="managementReady"
    class="home-page"
  >
    <IndentedPanel class="mt-20 mb-20">

      <div class="row home-panels">
        <div class="col main-panel">
          <div class="row panel">
            <div
              class="col span-12"
            >
              <ListingActions :is-grid-view="true" :search-query="searchQuery" @update:search-query="(query) => searchQuery = query" @set-view="(view) => viewState = view" :can-create="canCreateCluster" :create-location="createSharedServiceLocation">
                <template #header>
                  <div class="row table-heading">
                    <h2 class="mb-0">
                      Shared Services
                    </h2>
                    <BadgeState
                      v-if="filteredServices"
                      :label="filteredServices.length.toString()"
                      color="role-tertiary ml-20 mr-20"
                    />
                  </div>
                </template>
              </ListingActions>
              
              <SharedServicesListing v-if="viewState === 'list'" :list="filteredServices" />
              <SharedServicesGrid v-if="viewState === 'grid'" :list="filteredServices" />
            </div>
          </div>
        </div>

      </div>
    </IndentedPanel>
  </div>
</template>

<script>
import IndentedPanel from '@shell/components/IndentedPanel';
import { BadgeState } from '@components/BadgeState';
import { mapState } from 'vuex';
import { CAPI } from '@shell/config/types';
import { BLANK_CLUSTER } from '@shell/store/store-types.js';
import { PRODUCT_NAME, SHARED_SERVICES, SHARED_SERVICES_DATA } from '../../config/constants';
import ListingActions from '../common/ListingActions.vue';
import SharedServicesGrid from '../shared-services/SharedServicesGrid.vue';
import SharedServicesListing from '../shared-services/SharedServicesListing.vue';

export default {
  name: 'SharedServices',
  components: {
    IndentedPanel,
    BadgeState,
    ListingActions,
    SharedServicesGrid,
    SharedServicesListing
  },

  data() {
    const servicesList = SHARED_SERVICES_DATA;
    return {
      selectedService: null,
      searchQuery: '',
      viewState: 'grid',
      servicesList
    }
  },
  computed: {
    ...mapState(['managementReady']),
    canCreateCluster() {
      const schema = this.$store.getters['management/schemaFor'](CAPI.RANCHER_CLUSTER);

      return !!schema?.collectionMethods.find((x) => x.toLowerCase() === 'post');
    },

    createSharedServiceLocation() {
      return {
        name:   `${PRODUCT_NAME}-c-cluster-${SHARED_SERVICES}-create`,
        params: {
          product:  PRODUCT_NAME,
          cluster:  BLANK_CLUSTER,
        },
      };
    },

    filteredServices() {
      if (this.searchQuery.trim() === '') {
        return this.servicesList;
      } else {
        const searchTerm = this.searchQuery.trim().toLowerCase();
        return this.servicesList.filter(app => {
          return (app.name.toLowerCase().includes(searchTerm) ||
            app.service.toLowerCase().includes(searchTerm) ||
            app.environment.toLowerCase().includes(searchTerm) ||
            app.status.toLowerCase().includes(searchTerm) ||
            app.description.toLowerCase().includes(searchTerm))
        });
      }
    }
  },
  methods: {
  },
};

</script>

<style lang='scss' scoped>
  .home-panels {
    display: flex;
    align-items: stretch;
    .col {
      margin: 0
    }
    .main-panel {
      flex: auto;
    }

    .side-panel {
      margin-left: 1.75%;
    }
  }

  .set-login-page, .whats-new {
    > ::v-deep .banner__content {
      display: flex;

      > div {
        flex: 1;
      }
      > a {
        align-self: flex-end;
      }
    }
  }

  .banner.set-login-page {
    border: 1px solid var(--border);
  }
  .table-heading {
    align-items: center;
    display: flex;
    height: 39px;

    & > a {
      margin-left: 10px;
    }
  }
  .panel:not(:first-child) {
    margin-top: 20px;
  }
  .getting-started {
    align-items: flex-end;
    display: flex;

    > span {
      flex: 1;
      margin-right: 20px;
    }
  }
  .getting-started-btn {
    display: contents;
    white-space: nowrap;
  }

  .list-cluster-name {
    align-items: center;
    display: flex;

    .conditions-alert-icon {
      color: var(--error);
      margin-left: 4px;
    }
  }

  // Hide the side-panel showing links when the screen is small
  @media screen and (max-width: 996px) {
    .side-panel {
      display: none;
    }
  }
</style>
<style lang="scss">
.home-page {
  .search {
    align-items: center;
    display: flex;

    > INPUT {
      background-color: transparent;
      height: 30px;
      padding: 8px;
    }
  }

  h2 {
    font-size: 16px;
  }
}
</style>