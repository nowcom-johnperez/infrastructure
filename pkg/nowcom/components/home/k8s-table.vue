<script>
import { mapPref, AFTER_LOGIN_ROUTE, READ_WHATS_NEW, HIDE_HOME_PAGE_CARDS } from '@shell/store/prefs';
import IndentedPanel from '@shell/components/IndentedPanel';
import SortableTable from '@shell/components/SortableTable';
import { BadgeState } from '@components/BadgeState';
import { mapGetters, mapState } from 'vuex';
import { MANAGEMENT, CAPI } from '@shell/config/types';
import { NAME as MANAGER } from '@shell/config/product/manager';
import { STATE } from '@shell/config/table-headers';
import { createMemoryFormat, formatSi, parseSi, createMemoryValues } from '@shell/utils/units';
import { getVersionInfo } from '@shell/utils/version';
import PageHeaderActions from '@shell/mixins/page-actions';
import { getVendor } from '@shell/config/private-label';
import { mapFeature, MULTI_CLUSTER } from '@shell/store/features';
import { BLANK_CLUSTER } from '@shell/store/store-types.js';
import { filterOnlyKubernetesClusters, filterHiddenLocalCluster } from '@shell/utils/cluster';

import ListNamespace from '@shell/pages/c/_cluster/_product/namespaces.vue'

import { RESET_CARDS_ACTION, SET_LOGIN_ACTION } from '@shell/config/page-actions';

export default {
  name:       'K8sTable',
  components: {
    IndentedPanel,
    SortableTable,
    BadgeState,
    ListNamespace
  },

  mixins: [PageHeaderActions],

  fetch() {
    if ( this.$store.getters['management/schemaFor'](CAPI.RANCHER_CLUSTER) ) {
      this.$store.dispatch('management/findAll', { type: CAPI.RANCHER_CLUSTER });
    }

    if ( this.$store.getters['management/schemaFor'](MANAGEMENT.CLUSTER) ) {
      this.$store.dispatch('management/findAll', { type: MANAGEMENT.CLUSTER });
    }

    if ( this.$store.getters['management/canList'](CAPI.MACHINE) ) {
      this.$store.dispatch('management/findAll', { type: CAPI.MACHINE });
    }

    if ( this.$store.getters['management/canList'](MANAGEMENT.NODE) ) {
      this.$store.dispatch('management/findAll', { type: MANAGEMENT.NODE });
    }

    // We need to fetch node pools and node templates in order to correctly show the provider for RKE1 clusters
    if ( this.$store.getters['management/canList'](MANAGEMENT.NODE_POOL) ) {
      this.$store.dispatch('management/findAll', { type: MANAGEMENT.NODE_POOL });
    }

    if ( this.$store.getters['management/canList'](MANAGEMENT.NODE_TEMPLATE) ) {
      this.$store.dispatch('management/findAll', { type: MANAGEMENT.NODE_TEMPLATE });
    }
  },

  data() {
    const fullVersion = getVersionInfo(this.$store).fullVersion;

    return {
      HIDE_HOME_PAGE_CARDS, fullVersion, vendor: getVendor(),
    };
  },

  computed: {
    ...mapState(['managementReady']),
    ...mapGetters(['currentCluster', 'defaultClusterId', 'releaseNotesUrl']),
    mcm: mapFeature(MULTI_CLUSTER),

    provClusters() {
      return this.$store.getters['management/all'](CAPI.RANCHER_CLUSTER);
    },

    // User can go to Cluster Management if they can see the cluster schema
    canManageClusters() {
      const schema = this.$store.getters['management/schemaFor'](CAPI.RANCHER_CLUSTER);

      return !!schema;
    },

    canCreateCluster() {
      const schema = this.$store.getters['management/schemaFor'](CAPI.RANCHER_CLUSTER);

      return !!schema?.collectionMethods.find((x) => x.toLowerCase() === 'post');
    },

    manageLocation() {
      return {
        name:   'c-cluster-product-resource',
        params: {
          product:  MANAGER,
          cluster:  BLANK_CLUSTER,
          resource: CAPI.RANCHER_CLUSTER
        },
      };
    },

    createLocation() {
      return {
        name:   'c-cluster-product-resource-create',
        params: {
          product:  MANAGER,
          cluster:  BLANK_CLUSTER,
          resource: CAPI.RANCHER_CLUSTER
        },
      };
    },

    clusterHeaders() {
      return [
        STATE,
        {
          name:          'name',
          labelKey:      'tableHeaders.name',
          value:         'nameDisplay',
          sort:          ['nameSort'],
          canBeVariable: true,
          getValue:      (row) => row.mgmt?.nameDisplay
        },
        {
          label:     this.t('landing.clusters.provider'),
          value:     'mgmt.status.provider',
          name:      'Provider',
          sort:      ['mgmt.status.provider'],
          formatter: 'ClusterProvider'
        },
        {
          label: this.t('landing.clusters.kubernetesVersion'),
          value: 'kubernetesVersion',
          name:  'Kubernetes Version'
        },
        {
          label: this.t('tableHeaders.cpu'),
          value: '',
          name:  'cpu',
          sort:  ['status.allocatable.cpu', 'status.available.cpu']

        },
        {
          label: this.t('tableHeaders.memory'),
          value: '',
          name:  'memory',
          sort:  ['status.allocatable.memory', 'status.available.memory']

        },
        {
          label:        this.t('tableHeaders.pods'),
          name:         'pods',
          value:        '',
          sort:         ['status.allocatable.pods', 'status.requested.pods'],
          formatter:    'PodsUsage',
          delayLoading: true
        },
        // {
        //   name:  'explorer',
        //   label:  this.t('landing.clusters.explorer')
        // }
      ];
    },

    kubeClusters() {
      return filterHiddenLocalCluster(filterOnlyKubernetesClusters(this.provClusters || [], this.$store), this.$store);
    }
  },

  async created() {
    // Update last visited on load
    await this.$store.dispatch('prefs/setLastVisited', { name: 'home' });
  },

  // Forget the types when we leave the page
  beforeDestroy() {
    this.$store.dispatch('management/forgetType', CAPI.MACHINE);
    this.$store.dispatch('management/forgetType', MANAGEMENT.NODE);
    this.$store.dispatch('management/forgetType', MANAGEMENT.NODE_POOL);
    this.$store.dispatch('management/forgetType', MANAGEMENT.NODE_TEMPLATE);
  },

  methods: {
    cpuUsed(cluster) {
      return parseSi(cluster.status.requested?.cpu);
    },

    cpuAllocatable(cluster) {
      return parseSi(cluster.status?.allocatable?.cpu);
    },
    memoryAllocatable(cluster) {
      const parsedAllocatable = (parseSi(cluster.status.allocatable?.memory) || 0).toString();
      const format = createMemoryFormat(parsedAllocatable);

      return formatSi(parsedAllocatable, format);
    },

    memoryReserved(cluster) {
      const memValues = createMemoryValues(cluster?.status?.allocatable?.memory, cluster?.status?.requested?.memory);

      return `${ memValues.useful }/${ memValues.total } ${ memValues.units }`;
    },

    showUserPrefs() {
      this.$router.push({ name: 'prefs' });
    },

    async resetCards() {
      await this.$store.dispatch('prefs/set', { key: HIDE_HOME_PAGE_CARDS, value: {} });
      await this.$store.dispatch('prefs/set', { key: READ_WHATS_NEW, value: '' });
    },

    async closeSetLoginBanner(retry = 0) {
      let value = this.$store.getters['prefs/get'](HIDE_HOME_PAGE_CARDS);

      if (value === true || value === false || value.length > 0) {
        value = {};
      }
      value.setLoginPage = true;

      const res = await this.$store.dispatch('prefs/set', { key: HIDE_HOME_PAGE_CARDS, value });

      if (retry === 0 && res?.type === 'error' && res?.status === 500) {
        await this.closeSetLoginBanner(retry + 1);
      }
    }
  }
};

</script>
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
              v-if="mcm"
              class="col span-12"
            >
              <SortableTable
                :table-actions="false"
                :row-actions="false"
                key-field="id"
                :rows="kubeClusters"
                :headers="clusterHeaders"
                :loading="!kubeClusters"
                :paging="true" 
                :rows-per-page="10" 
              >
                <template #header-left>
                  <div class="row table-heading">
                    <h2 class="mb-0">
                      K8's Cluster
                    </h2>
                    <BadgeState
                      v-if="kubeClusters"
                      :label="kubeClusters.length.toString()"
                      color="role-tertiary ml-20 mr-20"
                    />
                  </div>
                </template>
                <template
                  v-if="canCreateCluster || canManageClusters"
                  #header-middle
                >
                  <div class="table-heading">
                    <n-link
                      v-if="canManageClusters"
                      :to="manageLocation"
                      class="btn btn-sm role-secondary"
                      data-testid="cluster-management-manage-button"
                    >
                      {{ t('cluster.manageAction') }}
                    </n-link>
                    <n-link
                      v-if="canCreateCluster"
                      :to="createLocation"
                      class="btn btn-sm role-primary"
                      data-testid="cluster-create-button"
                    >
                      {{ t('generic.create') }}
                    </n-link>
                  </div>
                </template>
                <template #col:name="{row}">
                  <td>
                    <div class="list-cluster-name">
                      <span v-if="row.mgmt">
                        <n-link
                          v-if="row.mgmt.isReady && !row.hasError"
                          :to="{ name: 'c-cluster-explorer', params: { cluster: row.mgmt.id }}"
                        >
                          {{ row.nameDisplay }}
                        </n-link>
                        <span v-else>{{ row.nameDisplay }}</span>
                      </span>
                      <i
                        v-if="row.unavailableMachines"
                        v-clean-tooltip="row.unavailableMachines"
                        class="conditions-alert-icon icon-alert icon"
                      />
                    </div>
                  </td>
                </template>
                <template #col:cpu="{row}">
                  <td v-if="row.mgmt && cpuAllocatable(row.mgmt)">
                    {{ `${cpuAllocatable(row.mgmt)} ${t('landing.clusters.cores', {count:cpuAllocatable(row.mgmt) })}` }}
                  </td>
                  <td v-else>
                    &mdash;
                  </td>
                </template>
                <template #col:memory="{row}">
                  <td v-if="row.mgmt && memoryAllocatable(row.mgmt) && !memoryAllocatable(row.mgmt).match(/^0 [a-zA-z]/)">
                    {{ memoryAllocatable(row.mgmt) }}
                  </td>
                  <td v-else>
                    &mdash;
                  </td>
                </template>
                <!-- <template #cell:explorer="{row}">
                  <n-link v-if="row && row.isReady" class="btn btn-sm role-primary" :to="{name: 'c-cluster', params: {cluster: row.id}}">
                    {{ t('landing.clusters.explore') }}
                  </n-link>
                  <button v-else :disabled="true" class="btn btn-sm role-primary">
                    {{ t('landing.clusters.explore') }}
                  </button>
                </template> -->
              </SortableTable>
            </div>
          </div>
        </div>
        <!-- <CommunityLinks class="col span-3 side-panel" /> -->

      </div>
    </IndentedPanel>
    <!-- <ListNamespace></ListNamespace> -->
  </div>
</template>
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