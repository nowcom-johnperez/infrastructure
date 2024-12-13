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
              <ListingActions :is-grid-view="true" :search-query="searchQuery" @update:search-query="updateSeachQuery" @set-view="(view) => viewState = view"  :can-create="canCreateCluster" :create-location="createEnvironmentLocation">
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
              <EnvironmentGridView v-if="viewState === 'grid'" :list="filteredEnvironment" :loading="$fetchState.pending" @onUpdatePage="(page) => currentPage = page" :current-page="currentPage" />
              <ModalStatus v-if="statusModalState" header-label="Status" :saving-modal-state="statusModalState" :environment-id="selectedEnv.spec?.environmentName" @onClose="closeModalState" />
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
import { CAPI, MANAGEMENT, HCI, NORMAN } from '@shell/config/types';
import { BLANK_CLUSTER } from '@shell/store/store-types.js';
import { PRODUCT_NAME, ENVIRONMENT, ENVIRONMENT_SIZES } from '../../config/constants';
import { mapState } from 'vuex';
import { EventBus } from '../../config/event-bus';
import ModalStatus from '../environment/Modal-Status.vue';
import ListingActions from '../common/ListingActions.vue';
import EnvironmentGridView from '../environment/EnvironmentGridView.vue';
import EnvironmentListView from '../environment/EnvironmentListView.vue';
import { environmentService, azureService } from '../../services/api';
import { PRODUCT_STORE } from '../../config/constants';
import { getConfig } from '../../config/api';
const { BREACHER_API } = getConfig()
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
      intervalId: null,
      statusModalState: false,
      selectedEnv: null,
      searchQuery: '',
      viewState: 'grid',
      environmentList: [],
      groupsByUser: [],
      clustersByUser: [],
      isAdmin: false,
      currentPage: 1
    }
  },

  computed: {
    ...mapState(['managementReady']),

    user() {
      return this.$store.getters['auth/v3User']
    },

    azureToken() {
      return this.$store.getters[`${PRODUCT_STORE}/getAzureToken`]
    },

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
          return (app.spec.environmentName.toLowerCase().includes(searchTerm) ||
            app.spec.clusterSize.toLowerCase().includes(searchTerm) ||
            app.spec.networkType.toLowerCase().includes(searchTerm) ||
            app.dns.includes(searchTerm) ||
            app.metadata?.annotations?.[`${BREACHER_API}/org`].toLowerCase().includes(searchTerm) ||
            app.metadata?.annotations?.[`${BREACHER_API}/team`].toLowerCase().includes(searchTerm))
        });
      }
    }
  },

  methods: {
    updateSeachQuery(query) {
      this.currentPage = 1
      this.searchQuery = query
    },
    async fetchGlobalRoleBindings() {
      const globalRoleSchema = await this.$store.getters['management/schemaFor'](MANAGEMENT.GLOBAL_ROLE_BINDING)
      if (globalRoleSchema) {
        const roles = await this.$store.dispatch('management/findAll', { type: MANAGEMENT.GLOBAL_ROLE });
        const globalRoleBindings = await this.$store.dispatch('management/findAll', { type: MANAGEMENT.GLOBAL_ROLE_BINDING });
        globalRoleBindings
          .filter((binding) => binding.userName === this.user.id)
          .forEach((binding) => {
            const globalRole = roles.find((r) => r.id === binding.globalRoleName);

            if (globalRole.id === 'admin') {
              this.isAdmin = true;
            }
          })
      }
      
    },
    initIntervalFetch() {
      if (!this.intervalId) {
        this.intervalId = setInterval(this.fetchEnvironment, 10000); // 10s interval
      }
    },
    stopInterval() {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
    },
    async fetchEnvironment() {
      const envResponse = await environmentService.getAll()
      // const envResponse = await this.$store.dispatch('cluster/findAll', { type: STACK })
      console.log(`isAdmin`, this.isAdmin)
      this.environmentList = envResponse.filter((e) => {
        const owners = e.metadata?.annotations[`${BREACHER_API}/owners`] ? JSON.parse(e.metadata?.annotations[`${BREACHER_API}/owners`]) : []
        const members = e.metadata?.annotations[`${BREACHER_API}/members`] ? JSON.parse(e.metadata?.annotations[`${BREACHER_API}/members`]) : []
        // const groupIds = this.groupsByUser.map((group) => `azuread_group://${group.id}`)
        const clusterId = e.status?.clusterRef?.clusterID
        const allIds = [...owners, ...members];
        return allIds.some(id => {
          console.log(`cluster checker`, clusterId, this.clustersByUser.includes(clusterId))
          return (
            id === this.user.id || 
            id === this.user.principalIds[0] || 
            // groupIds.includes(id) || 
            this.clustersByUser.includes(clusterId) ||
            this.isAdmin
          )
        }
        );
      }).map((e) => {
        const clusterId = e.status?.clusterRef?.clusterID
        const sizeInfo = ENVIRONMENT_SIZES.find((s) => s.size.toLowerCase() === e.spec.clusterSize)
        const ingress = this.fetchIngress(clusterId)
        return {
          ...e,
          clusterId,
          dns: ingress?.dns || '',
          sizeInfo,
          statuses: {
            network: this.getStatus(e.status?.conditions, 'NetworkReady'),
            networkPolicy: this.getStatus(e.status?.conditions, 'NetworkPolicyReady'),
            clusterCreation: this.getStatus(e.status?.conditions, 'ClusterReady'),
          }
        }
      })
    },
    async fetchIngress(clusterId) {
      try {
        const ingresses = (
          await this.$store.dispatch('cluster/request', {
            url: `/k8s/clusters/${clusterId}/v1/networking.k8s.io.ingresses`,
          })
        ).data;
        return ingresses.map(ingress => ({
          ...ingress,
          dns: ingress.status?.loadBalancer?.ingress?.map(node => node.ip) || [],
        }))[0] || null;
      } catch (error) {
        console.error(`Error fetching ingresses for cluster ${clusterId}:`, error);
      }
    },
    getStatus(conditions, type) {
      if (!type || !conditions) return 'inactive'
      const condition = conditions.find((c) => c.type === type)
      if (condition.status === "True") return 'active'
      else if (condition.status === "Unknown") return 'warning'
      return 'inactive'
    },
    getRandomStatus() {
      const statuses = [
        { value: 'active', weight: 0.6 },  // 60% chance
        { value: 'warning', weight: 0.3 }, // 30% chance
        { value: 'inactive', weight: 0.1 } // 10% chance
      ];

      const totalWeight = statuses.reduce((sum, status) => sum + status.weight, 0);
      const random = Math.random() * totalWeight;

      let cumulativeWeight = 0;
      for (const status of statuses) {
        cumulativeWeight += status.weight;
        if (random < cumulativeWeight) {
          return status.value;
        }
      }
    },
    closeModalState() {
      this.statusModalState = false
      this.selectedEnv = null
    },
    openModalStatus(env) {
      this.selectedEnv = env
      this.statusModalState = true
    },
    async fetchAssociatedGroups () {
      // dont fetch associated groups if the user is a local account
      const principalId = this.user.principalIds[0] // assuming the first id is azure id
      if (!principalId.includes('azuread_user://')) {
        console.log(`principal id doesn't include azureread_user`)
        return
      }
      if (!this.azureToken) await this.$store.dispatch(`${PRODUCT_STORE}/setAzureToken`)

      try {
        const userId = principalId.replace("azuread_user://", "")
        const groups = await azureService.fetchUserMemberOf(userId, this.azureToken)
        this.groupsByUser = groups?.value?.map((group) => {
          return {
            id: group.id,
            name: group.displayName
          }
        })
      } catch (err) {
        await this.$store.dispatch(`${PRODUCT_STORE}/setAzureToken`)
        this.fetchAssociatedGroups()
      }
    },
    async fetchClusters() {
      const clusters = await this.$store.dispatch(`management/findAll`, { type: CAPI.RANCHER_CLUSTER })
      this.clustersByUser = clusters.map((cluster) => cluster.status?.clusterName)
    },
    async init() {
      await this.fetchGlobalRoleBindings()
      // await this.fetchAssociatedGroups()
      await this.fetchClusters()
      await this.fetchEnvironment()
    }
  },
  async mounted() {
    this.init()
    EventBus.$on('load-environment', (isStop) => {
      if (isStop) {
        this.stopInterval()
      } else {
        this.initIntervalFetch()
      }
    })
    EventBus.$on('env-modal-status', this.openModalStatus)
    this.initIntervalFetch()
  },
  beforeDestroy() {
    EventBus.$off('env-modal-status')
    EventBus.$off('load-environment')
    this.stopInterval()
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