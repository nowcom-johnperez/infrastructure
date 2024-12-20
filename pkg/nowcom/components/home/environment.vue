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
              <ModalDelete v-if="deleteModalState" header-label="Delete Environment" :modal-state="deleteModalState" :environment="selectedEnv" @onClose="closeDeleteModal" @deleteSuccess="fetchEnvironment" />
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
import { CAPI, MANAGEMENT } from '@shell/config/types';
import { BLANK_CLUSTER } from '@shell/store/store-types.js';
import { PRODUCT_NAME, ENVIRONMENT, ENVIRONMENT_SIZES } from '../../config/constants';
import { mapState } from 'vuex';
import { EventBus } from '../../config/event-bus';
import ModalStatus from '../environment/Modal-Status.vue';
import ModalDelete from '../environment/Modal-Delete.vue';
import ListingActions from '../common/ListingActions.vue';
import EnvironmentGridView from '../environment/EnvironmentGridView.vue';
import EnvironmentListView from '../environment/EnvironmentListView.vue';
import { environmentService } from '../../services/api';
import { getConfig } from '../../config/api';
const { BREACHER_API } = getConfig()
export default {
  name:       'Environments',
  components: {
    IndentedPanel,
    BadgeState,
    ModalStatus,
    ModalDelete,
    ListingActions,
    EnvironmentGridView,
    EnvironmentListView
  },

  data() {
    return {
      intervalDns: null,
      intervalId: null,
      statusModalState: false,
      selectedEnv: null,
      searchQuery: '',
      viewState: 'grid',
      environmentList: [],
      clustersByUser: [],
      isAdmin: false,
      currentPage: 1,
      dnsUpdateQueue: [],
      deleteModalState: false
    };
  },

  computed: {
    ...mapState(['managementReady']),

    user() {
      return this.$store.getters['auth/v3User'];
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
        return this.environmentList.filter((app) => {
          return (
            app.spec.environmentName.toLowerCase().includes(searchTerm) ||
            app.spec.clusterSize.toLowerCase().includes(searchTerm) ||
            app.spec.networkType.toLowerCase().includes(searchTerm) ||
            app.dns.includes(searchTerm)
          );
        });
      }
    }
  },

  async fetch() {
    await this.init();
  },

  methods: {
    updateSeachQuery(query) {
      this.currentPage = 1;
      this.searchQuery = query;
    },

    async fetchGlobalRoleBindings() {
      const globalRoleSchema = await this.$store.getters['management/schemaFor'](MANAGEMENT.GLOBAL_ROLE_BINDING);
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
          });
      }
    },

    initIntervalFetch() {
      if (!this.intervalId) {
        this.intervalId = setInterval(this.fetchEnvironment, 10000); // 10s interval
      }
    },

    initDnsFetch() {
      if (!this.intervalDns && this.environmentList.length > 0) {
        this.intervalDns = setInterval(async () => {
          await this.fetchDnsForEnvironments(this.environmentList)
        }, 12000) // 12s interval
      }
    },

    stopInterval() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }

      if (this.intervalDns) {
        clearInterval(this.intervalDns);
        this.intervalDns = null;
      }
    },

    async fetchEnvironment() {
      const envResponse = await environmentService.getAll();

      const filteredEnvironments = envResponse.filter((e) => {
        const owners = this.parseAnnotation(this.annotationGetter(e, 'owners'));
        const members = this.parseAnnotation(this.annotationGetter(e, 'members'));

        const clusterId = e.status?.clusterRef?.clusterID;
        const allIds = [...owners, ...members];

        return allIds.some((id) => {
          return (
            id === this.user.id ||
            id === this.user.principalIds[0] ||
            this.clustersByUser.includes(clusterId) ||
            this.isAdmin
          );
        });
      });

      this.updateEnvironmentList(filteredEnvironments);

      this.initDnsFetch()
    },

    updateEnvironmentList(environments) {
      this.environmentList = environments.map((e) => {
        const clusterId = e.status?.clusterRef?.clusterID;
        const sizeInfo = ENVIRONMENT_SIZES.find((s) => s.size.toLowerCase() === e.spec.clusterSize);

        // Find the existing environment entry to preserve the `dns` value
        const existingEnvironment = this.environmentList.find(env => env.metadata?.uid === e.metadata?.uid);

        return {
          ...e,
          clusterId,
          dns: existingEnvironment?.dns || [], // Preserve DNS details if they exist
          sizeInfo,
          statuses: {
            network: this.getStatus(e.status?.conditions, 'NetworkReady'),
            networkPolicy: this.getStatus(e.status?.conditions, 'NetworkPolicyReady'),
            clusterCreation: this.getStatus(e.status?.conditions, 'ClusterReady'),
          },
        };
      });
    },

    async fetchDnsForEnvironments(environments) {
      const dnsUpdates = await Promise.all(environments.map(async (e) => {
        const clusterId = e.status?.clusterRef?.clusterID;

        // Fetch DNS data if clusterId is valid
        if (clusterId && clusterId !== 'Pending') {
          try {
            const service = await this.fetchService(clusterId);
            const rawDns = service?.metadata?.annotations['kube-vip.io/loadbalancerIPs'];
            const dns = Array.isArray(rawDns) ? rawDns : rawDns ? [rawDns] : [];

            return { clusterId, dns };
          } catch (error) {
            console.error(`Error fetching DNS for cluster ${clusterId}:`, error);
          }
        }
        return { clusterId, dns: [] };
      }));

      // Update the environment list once with DNS details
      const updatedList = this.environmentList.map((env) => {
        const update = dnsUpdates.find((d) => d.clusterId === env.clusterId);
        return { ...env, dns: update ? update.dns : [] };
      });

      this.environmentList = updatedList; // Single reactive update
    },

    async fetchService(clusterId) {
      if (clusterId === 'Pending' || !clusterId) return null;
      try {
        const services = await environmentService.getClusterServices(clusterId)

        return services.find((service) => service.metadata.name === 'bind-svc');
      } catch (error) {
        console.error(`Error fetching services for cluster ${clusterId}:`, error);
        return null;
      }
    },

    getStatus(conditions, type) {
      if (!type || !conditions) return 'inactive';
      const condition = conditions.find((c) => c.type === type);
      if (condition.status === "True") return 'active';
      else if (condition.status === "Unknown") return 'warning';
      return 'inactive';
    },

    annotationGetter(environment, annotation) {
      return environment?.metadata?.annotations[`${BREACHER_API}/${annotation}`] || null;
    },

    parseAnnotation(annotationData) {
      try {
        const parsed = JSON.parse(annotationData);

        if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
          return parsed;
        } else {
          throw new Error('Parsed data is not a valid array of strings');
        }
      } catch (error) {
        if (typeof annotationData === 'string') {
          return [annotationData];
        }

        return [];
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
    closeDeleteModal() {
      this.deleteModalState = false
      this.selectedEnv = null
    },
    openDeleteModal(env) {
      this.selectedEnv = env
      this.deleteModalState = true
    },
    async fetchClusters() {
      const clusters = await this.$store.dispatch('management/findAll', { type: CAPI.RANCHER_CLUSTER })
      this.clustersByUser = clusters.map((cluster) => cluster.status?.clusterName)
    },
    async init() {
      await this.fetchGlobalRoleBindings()
      await this.fetchClusters()
      await this.fetchEnvironment()
    }
  },

  async mounted() {
    EventBus.$on('load-environment', (isStop) => {
      if (isStop) {
        this.stopInterval();
      } else {
        this.initIntervalFetch();
      }
    });
    EventBus.$on('env-modal-status', this.openModalStatus);
    EventBus.$on('env-modal-delete', this.openDeleteModal);
    this.initIntervalFetch();
  },

  beforeDestroy() {
    EventBus.$off('env-modal-status');
    EventBus.$off('env-modal-delete');
    EventBus.$off('load-environment');
    this.stopInterval();
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