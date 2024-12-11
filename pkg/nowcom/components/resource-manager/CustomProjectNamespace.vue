<script>
import { PRODUCT_NAME, RESOURCE_MANAGEMENT } from '../../config/constants';
import { mapGetters } from 'vuex';
import ResourceTable from '@shell/components/ResourceTable';
import { STATE, AGE, NAME, CPU, RAM } from '@shell/config/table-headers';
import { uniq } from '@shell/utils/array';
import { MANAGEMENT, NAMESPACE, VIRTUAL_TYPES } from '@shell/config/types';
import { PROJECT_ID } from '@shell/config/query-params';
import { PanelLocation, ExtensionPoint } from '@shell/core/types';
import { mapPref, GROUP_RESOURCES, ALL_NAMESPACES } from '@shell/store/prefs';
import CollapsibleCard from '@shell/components/CollapsibleCard.vue'
import { NAMESPACE_FILTER_ALL_ORPHANS } from '@shell/utils/namespace-filter';
import {
  colorForState, mapStateToEnum, stateDisplay, stateSort
} from '@shell/plugins/dashboard-store/resource-class';
import {
  parseSi, createMemoryValues
} from '@shell/utils/units';
import ResourceFetch from '@shell/mixins/resource-fetch';
import SortableTable from '@shell/components/SortableTable'
import { PROJECT_NAMESPACE_HEADERS } from '../../config/table';
import { harvesterService } from '../../services/api';
import ConsumptionGauge from '@shell/components/ConsumptionGauge.vue'
export default {
  name:       'CustomListProjectNamespace',
  components: {
    ResourceTable, CollapsibleCard, SortableTable, ConsumptionGauge
  },
  mixins: [ResourceFetch],

  props: {
    createProjectLocationOverride: {
      type:    Object,
      default: () => null
    },

    createNamespaceLocationOverride: {
      type:    Object,
      default: () => null
    }
  },

  async fetch() {
    const inStore = this.$store.getters['currentStore'](NAMESPACE);

    this.schema = this.$store.getters[`${ inStore }/schemaFor`](NAMESPACE);
    this.projectSchema = this.$store.getters[`management/schemaFor`](MANAGEMENT.PROJECT);

    if ( !this.schema ) {
      // clusterReady:   When switching routes, it will cause clusterReady to change, causing itself to repeat rendering。
      // this.$store.dispatch('loadingError', `Type ${ NAMESPACE } not found`);

      return;
    }

    await this.$fetchType(NAMESPACE);
    this.projects = await this.$store.dispatch('management/findAll', { type: MANAGEMENT.PROJECT, opt: { force: true } });
    this.harvesterNS = await harvesterService.getNamespaces()
    this.nsResourceQuotas = await harvesterService.getNamespaceQuota()
  },

  data() {
    return {
      loadResources:                [NAMESPACE],
      loadIndeterminate:            true,
      schema:                       null,
      projects:                     [],
      projectSchema:                null,
      extensionType:                ExtensionPoint.PANEL,
      extensionLocation:            PanelLocation.RESOURCE_LIST,
      MANAGEMENT,
      VIRTUAL_TYPES,
      defaultCreateProjectLocation: {
        name:   'c-cluster-product-resource-create',
        params: {
          product:  this.$store.getters['currentProduct'].name,
          resource: MANAGEMENT.PROJECT
        },
      },
      PROJECT_NAMESPACE_HEADERS,
      projectsList: [],
      harvesterNS: [],
      nsResourceQuotas: []
    };
  },

  watch: {
    harvesterNS () {
      this.initProjectList()
    }
  },

  computed: {
    ...mapGetters(['currentCluster', 'currentProduct']),
    namespaces() {
      const inStore = this.$store.getters['currentStore'](NAMESPACE);

      return this.$store.getters[`${ inStore }/all`](NAMESPACE);
    },
    loading() {
      return !this.currentCluster || this.namespaces.length ? false : this.$fetchState.pending;
    },
    showIncrementalLoadingIndicator() {
      return this.perfConfig?.incrementalLoading?.enabled;
    },
    isNamespaceCreatable() {
      return (this.schema?.collectionMethods || []).includes('POST');
    },
    headers() {
      const additional = [
        {
          name: 'cpu',
          label: 'CPU',
          sort: ['cpu'],
          search: ['cpu'],
        },
        {
          name: 'memory',
          label: 'Memory',
          sort: ['memory'],
          search: ['memory'],
        },
      ]
      return [
        STATE,
        NAME,
        ...additional,
        // CPU,
        // RAM,
        AGE
      ].filter((h) => h);
    },
    projectIdsWithNamespaces() {
      const ids = this.rows
        .map((row) => row.projectId)
        .filter((id) => id);

      return uniq(ids);
    },
    clusterProjects() {
      const clusterId = this.currentCluster.id;

      // Get the list of projects from the store so that the list
      // is updated if a new project is created or removed.
      const projectsInAllClusters = this.$store.getters['management/all'](MANAGEMENT.PROJECT);

      if (this.currentProduct?.customNamespaceFilter && this.currentProduct?.inStore && this.$store.getters[`${ this.currentProduct.inStore }/filterProject`]) {
        return this.$store.getters[`${ this.currentProduct.inStore }/filterProject`];
      }
  
      const clustersInProjects = projectsInAllClusters.filter((project) => {
        return project.spec.clusterName === clusterId
      });

      return clustersInProjects;
    },
    projectsWithoutNamespaces() {
      return this.activeProjects.filter((project) => {
        return !this.projectIdsWithNamespaces.find((item) => project?.id?.endsWith(`/${ item }`));
      });
    },
    // We're using this because we need to show projects as groups even if the project doesn't have any namespaces.
    rowsWithFakeNamespaces() {
      const fakeRows = this.projectsWithoutNamespaces.map((project) => {
        return {
          groupByLabel:     `${ ('resourceTable.groupLabel.notInAProject') }-${ project.id }`,
          isFake:           true,
          mainRowKey:       project.id,
          nameDisplay:      project.spec?.displayName, // Enable filtering by the project name
          project,
          availableActions: []
        };
      });

      if (this.showMockNotInProjectGroup) {
        fakeRows.push( {
          groupByLabel: this.t('resourceTable.groupLabel.notInAProject'), // Same as the groupByLabel for the namespace model
          mainRowKey:   'fake-empty',
        });
      }

      return [...this.rows, ...fakeRows];
    },
    createProjectLocation() {
      return this.createProjectLocationOverride || this.defaultCreateProjectLocation;
    },
    groupPreference: mapPref(GROUP_RESOURCES),
    activeNamespaceFilters() {
      return this.$store.getters['activeNamespaceFilters'];
    },
    activeProjectFilters() {
      const activeProjects = {};

      for (const filter of this.activeNamespaceFilters) {
        const [type, id] = filter.split('://', 2);

        if (type === 'project') {
          activeProjects[id] = true;
        }
      }

      return activeProjects;
    },
    activeProjects() {
      const namespaceFilters = this.$store.getters['activeNamespaceFilters'];

      if (namespaceFilters.includes(NAMESPACE_FILTER_ALL_ORPHANS) && Object.keys(this.activeProjectFilters).length === 0) {
        // If the user wants to only see namespaces that are not
        // in a project, don't show any projects.
        return [];
      }

      // If the user is not filtering by any projects or namespaces, return
      // all projects in the cluster.
      if (!this.userIsFilteringForSpecificNamespaceOrProject()) {
        return this.clusterProjects;
      }

      // Filter out projects that are not selected in the top nav.
      return this.clusterProjects.filter((projectData) => {
        const projectId = projectData.id.split('/')[1];

        return !!this.activeProjectFilters[projectId];
      });
    },
    activeNamespaces() {
      // Apply namespace filters from the top nav.
      const activeNamespaces = this.$store.getters['namespaces']();

      return this.namespaces.filter((namespaceData) => {
        return !!activeNamespaces[namespaceData.metadata.name];
      }).map((ns) => {
        return {
          ...ns,
          namespaceDisplay: ns.id,
        }
      });
    },
    filteredRows() {
      return this.groupPreference === 'none' ? this.rows : this.rowsWithFakeNamespaces;
    },
    rows() {
      if (this.$store.getters['prefs/get'](ALL_NAMESPACES)) {
        // If all namespaces options are turned on in the user preferences,
        // return all namespaces including system namespaces and RBAC
        // management namespaces.
        return this.activeNamespaces;
      }

      return this.activeNamespaces.filter((namespace) => {
        const isSettingSystemNamespace = this.$store.getters['systemNamespaces'].includes(namespace.metadata.name);
        const systemNS = namespace.isSystem || namespace.isFleetManaged || isSettingSystemNamespace;

        return this.currentProduct?.hideSystemResources ? !systemNS : true;
      });
    },

    canSeeProjectlessNamespaces() {
      return this.currentCluster.canUpdate;
    },

    showMockNotInProjectGroup() {
      if (!this.canSeeProjectlessNamespaces) {
        return false;
      }

      const someNamespacesAreNotInProject = !this.rows.some((row) => !row.project);

      // Hide the "Not in a Project" group if the user is filtering
      // for specific namespaces or projects.
      const usingSpecificFilter = this.userIsFilteringForSpecificNamespaceOrProject();

      return !usingSpecificFilter && someNamespacesAreNotInProject;
    },

    notInProjectKey() {
      return this.$store.getters['i18n/t']('resourceTable.groupLabel.notInAProject');
    },
    showCreateNsButton() {
      return this.groupPreference !== 'namespace';
    }
  },
  methods: {
    /**
     * Get PSA HTML to be displayed in the tooltips
     */
    getPsaTooltip(row) {
      const dictionary = row.psaTooltipsDescription;
      const list = Object.values(dictionary)
        .sort()
        .map((text) => `<li>${ text }</li>`).join('');
      const title = `<p>${ this.t('podSecurityAdmission.name') }: </p>`;

      return `${ title }<ul class="psa-tooltip">${ list }</ul>`;
    },

    userIsFilteringForSpecificNamespaceOrProject() {
      const activeFilters = this.$store.getters['namespaceFilters'];

      for (let i = 0; i < activeFilters.length; i++) {
        const filter = activeFilters[i];
        const filterType = filter.split('://')[0];

        if (filterType === 'ns' || filterType === 'project') {
          return true;
        }
      }

      return false;
    },
    
    createNamespaceLocation(project) {
      const location = {
        name:   `${PRODUCT_NAME}-c-cluster-${RESOURCE_MANAGEMENT}-create`,
        params: {
          product:  this.$store.getters['currentProduct'].name,
          resource: NAMESPACE
        },
      };

      location.query = { [PROJECT_ID]: project?.metadata.name };

      return location;
    },

    initProjectList() {
      this.projectsList = this.clusterProjects.map((project) => {
        const nsCounter = this.getNamespaceByProjectId(project).length
        return {
          isCollapsed: nsCounter > 0 ? false : true,
          mainRowKey:  project.id,
          nameDisplay: project.spec?.displayName,
          ...project,
        }
      })
    },

    getNamespaceByProjectId (project) {
      return this.harvesterNS.filter((ns) => {
        return ns.metadata?.labels['field.cattle.io/projectId'] === project?.metadata?.name
      }).map((namespace) => {
        const resourceQuota = namespace.metadata?.annotations['field.cattle.io/resourceQuota'] ? JSON.parse(namespace.metadata?.annotations['field.cattle.io/resourceQuota']) : {}
        const state = namespace.metadata?.fields[1]
        const color = colorForState(state).replace('text-', 'bg-');
        const display = stateDisplay(state);
        const quota = this.nsResourceQuotas.find((res) => res.metadata?.namespace === namespace.id) || {}

        const cpuReserved = parseSi(quota?.status?.hard['limits.cpu'] || 0)
        const cpuUsed = parseSi(quota?.status?.used['limits.cpu'] || 0)

        const memoryReserved = parseSi(quota?.status?.hard['limits.memory'] || 0)
        const memoryUsed = parseSi(quota?.status?.used['limits.memory'] || 0)

        const memory = createMemoryValues(memoryReserved, memoryUsed)
        const cpu = createMemoryValues(cpuReserved, cpuUsed)

        return {
          ...namespace,
          state:                  mapStateToEnum(state),
          stateBackground:        color,
          stateDisplay:           display,
          stateSort:              stateSort(color, display),
          creationTimestamp:      namespace.metadata?.creationTimestamp,
          memory,
          cpu,
          resourceQuota,
        }
      })
    },

    getProjectTitle (project) {
      return `Project: ${project.nameDisplay}`
    }
  }
};
</script>

<template>
  <div class="project-namespaces">
    <div class="row">
      <h2 class="mb-0 mt-20">Projects</h2>
      <router-link
        v-if="createProjectLocationOverride"
        :to="createProjectLocationOverride"
        class="btn role-primary mr-10 btn-sm"
        data-testid="create_project"
        style="margin-left: auto"
      >
        Create Project
      </router-link>
    </div>
    <CollapsibleCard v-for="nsProject in projectsList" :key="nsProject.id" :title="getProjectTitle(nsProject)" class="mb-20 mt-20" :isCollapsed="nsProject.isCollapsed" @toggleCollapse="(c) => $set(nsProject, 'isCollapsed', c)">
      <template #content>
        <SortableTable
          :headers="headers" 
          :rows="getNamespaceByProjectId(nsProject)" 
          :paging="true" 
          :rowActionsWidth="10" 
          :rows-per-page="10" 
          keyField="name"
        >
          <template #cell:name="{row}">
            <a href="#" @click.prevent="openSidebar(row)">{{ row.metadata.name }}</a>
          </template>

          <template #cell:memory="{ row }">
            <ConsumptionGauge
              :capacity="row.memory.total"
              :used="row.memory.useful"
              :units="row.memory.units"
            />
          </template>

          <template #cell:cpu="{ row }">
            <ConsumptionGauge
              :capacity="row.cpu.total"
              :used="row.cpu.useful"
            />
          </template>

          <template #header-right>
            <router-link
              :to="createNamespaceLocation(nsProject)"
              class="btn role-primary btn-sm mr-10"
              data-testid="create_project_namespaces"
            >
              {{ t('projectNamespaces.createNamespace') }}
            </router-link>
          </template>
        </SortableTable>
      </template>
    </CollapsibleCard>
  </div>
</template>
<style lang="scss" scoped>
.project-namespaces {
  & ::v-deep {
    .project-namespaces-table table {
      table-layout: fixed;
    }

    .project-name {
      line-height: 30px;
    }

    .project-bar {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .group-tab {
        max-width: calc(100% - 230px);
      }

      .project-name {
        display: flex;
        flex-direction: row;
        align-items: center;

        span:first-child {
          padding-right: 8px;
        }

        span:last-child {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }

      &.has-description {
        .right {
          margin-top: 5px;
        }
        .group-tab {
          &, &::after {
              height: 50px;
          }

          &::after {
              right: -20px;
          }

          .description {
              margin-top: -20px;
          }
        }
      }
    }

    .namespace-name {
      display: flex;
      align-items: center;

      .icon-istio {
        color: var(--primary);
      }
    }

    .collapsible-card-header {
      padding: 10px !important;

      h2 span {
        font-size: 18px;
      }
    }
  }
}
</style>
<style lang="scss">
  .psa-tooltip {
    // These could pop up a lot as the mouse moves around, keep them as small and unintrusive as possible
    // (easier to test with v-clean-tooltip="{ content: getPSA(row), autoHide: false, show: true }")
    margin: 3px 0;
    padding: 0 8px 0 22px;
  }
</style>
