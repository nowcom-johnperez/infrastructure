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
              <ListingActions :is-grid-view="true" :search-query="searchQuery" @update:search-query="(query) => searchQuery = query" @set-view="(view) => viewState = view"  :can-create="canCreateCluster" :create-location="createEnvironmentLocation">
                <template #header>
                  <div class="row table-heading">
                    <h2 class="mb-0">
                      Environments
                    </h2>
                    <BadgeState
                      v-if="filteredEnvironment"
                      :label="filteredEnvironment.length.toString()"
                      color="role-tertiary ml-20 mr-20"
                    />
                  </div>
                </template>
              </ListingActions>
              
              <EnvironmentListView v-if="viewState === 'list'" :list="filteredEnvironment" />
              <EnvironmentGridView v-if="viewState === 'grid'" :list="filteredEnvironment" :loading="$fetchState.pending" />
              <ModalStatus v-if="statusModalState" header-label="Status" :saving-modal-state="statusModalState" :status="selectedEnv?.state" @onClose="closeModalState" />
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
import { CAPI } from '@shell/config/types';
import { BLANK_CLUSTER } from '@shell/store/store-types.js';
import { PRODUCT_NAME, ENVIRONMENT } from '../../config/constants';
import { mapState } from 'vuex';
import { EventBus } from '../../config/event-bus';
import ModalStatus from '../environment/Modal-Status.vue';
import ListingActions from '../common/ListingActions.vue';
import EnvironmentGridView from '../environment/EnvironmentGridView.vue';
import EnvironmentListView from '../environment/EnvironmentListView.vue';
import { environmentService } from '../../services/api';
export default {
  name:       'Environments',
  components: {
    IndentedPanel,
    BadgeState,
    ModalStatus,
    ListingActions,
    EnvironmentGridView,
    EnvironmentListView
  },

  data() {
    return {
      statusModalState: false,
      selectedEnv: null,
      searchQuery: '',
      viewState: 'grid',
      environmentList: []
    }
  },

  computed: {
    ...mapState(['managementReady']),
    canCreateCluster() {
      const schema = this.$store.getters['management/schemaFor'](CAPI.RANCHER_CLUSTER);

      return !!schema?.collectionMethods.find((x) => x.toLowerCase() === 'post');
    },

    createEnvironmentLocation() {
      return {
        name:   `${PRODUCT_NAME}-c-cluster-${ENVIRONMENT}-create`,
        params: {
          product:  PRODUCT_NAME,
          cluster:  BLANK_CLUSTER,
        },
      };
    },

    filteredEnvironment() {
      if (this.searchQuery.trim() === '') {
        return this.environmentList;
      } else {
        const searchTerm = this.searchQuery.trim().toLowerCase();
        return this.environmentList.filter(app => {
          return (app.name.toLowerCase().includes(searchTerm) ||
            app.status.toLowerCase().includes(searchTerm) ||
            app.size.toLowerCase().includes(searchTerm) ||
            app.firewallPolicy.toLowerCase().includes(searchTerm))
        });
      }
    }
  },

  async fetch() {
    const envResponse = await environmentService.getAll()
    const clusters = ['c-m-2n5nv4ns', 'c-m-7zjjktjj', 'c-m-7qlxzcn4']
    this.environmentList = envResponse.map((e) => {
      const randomNumber = Math.floor(Math.random() * 3);
      return {
        ...e.spec,
        status: 'Done',
        state: {
          networks: true,
          firewall: true,
          git: true,
          keyvaults: true,
          cluster: true,
          services: true,
          certDNS: true
        },
        clusterId: clusters[randomNumber]
      }
    })
  },

  methods: {
    closeModalState() {
      this.statusModalState = false
      this.selectedEnv = null
    },
    openModalStatus(env) {
      this.selectedEnv = env
      this.statusModalState = true
    }
  },
  mounted() {
    EventBus.$on('env-modal-status', this.openModalStatus)
  },
  beforeDestroy() {
    EventBus.$off('env-modal-status')
  }
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