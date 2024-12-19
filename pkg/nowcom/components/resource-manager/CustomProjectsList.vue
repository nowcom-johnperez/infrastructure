<template>
  <div>
    <ResourceTable
      ref="table"
      class="table project-namespaces-table"
      v-bind="$attrs"
      :schema="schema"
      :headers="headers"
      :rows="projects"
      :groupable="false"
      :sort-generation-fn="sortGenerationFn"
      :loading="loading"
      group-tooltip="resourceTable.groupBy.project"
      key-field="_key"
      v-on="$listeners"
    >
      <template #cell:project="{row}">
        <a v-if="row.spec.displayName" href="#" @click.prevent="openSideBar(row)">{{ row.spec.displayName }}</a>
        <span
          v-else
          class="text-muted"
        >&ndash;</span>
      </template>
    </ResourceTable>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ResourceTable, { defaultTableSortGenerationFn } from '@shell/components/ResourceTable';
import { STATE, AGE } from '@shell/config/table-headers';
import { MANAGEMENT, NAMESPACE, VIRTUAL_TYPES } from '@shell/config/types';
import { EventBus } from '../../config/event-bus';
import ResourceFetch from '@shell/mixins/resource-fetch';
import SortableTable from '@shell/components/SortableTable'
import { PROJECT_NAMESPACE_HEADERS } from '../../config/table';
import ConsumptionGauge from '@shell/components/ConsumptionGauge.vue'
import ProjectNamespaceView from './ProjectNamespaceView.vue';
export default {
  name: 'CustomProjectsList',
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

  components: {
    ConsumptionGauge,
    SortableTable,
    ResourceTable
  },

  data() {
    return {
      schema: null,
      projectSchema: null,
      defaultCreateProjectLocation: {
        name:   'c-cluster-product-resource-create',
        params: {
          product:  this.$store.getters['currentProduct'].name,
          resource: MANAGEMENT.PROJECT
        },
      },
      PROJECT_NAMESPACE_HEADERS,
      projects: []
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
    headers() {
      const project = {
        name:  'project',
        label: this.t('tableHeaders.project'),
        value: 'project.nameDisplay',
        sort:  ['projectNameSort', 'nameSort'],
      };

      return [
        STATE,
        project,
        AGE
      ].filter((h) => h);
    },
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
    const projects = await this.$store.dispatch('management/findAll', { type: MANAGEMENT.PROJECT, opt: { force: true } });
    const excludePrefixes = ['system', 'default'];
    this.projects = projects.filter(n => !excludePrefixes.some(prefix => n.spec?.displayName.toLocaleLowerCase().includes(prefix)) && n.spec.clusterName.includes(this.currentCluster.id))
    console.log(`projects`, this.projects)
    // this.harvesterNS = await harvesterService.getNamespaces()
    // this.nsResourceQuotas = await harvesterService.getNamespaceQuota()
  },

  methods: {
    openSideBar(item) {
      EventBus.$emit('component-view', {
        item,
        component: ProjectNamespaceView
      })
    },
    sortGenerationFn() {
      // The sort generation function creates a unique value and is used to create a key including sort details.
      // The unique key determines if the list is redrawn or a cached version is shown.
      // Because we ensure the 'not in a project' group is there via a row, and timing issues, the unqiue key doesn't change
      // after a namespace is removed... so the list won't update... so we need to inject a string to ensure the key is fresh
      const base = defaultTableSortGenerationFn(this.schema, this.$store);

      return base + (this.showMockNotInProjectGroup ? '-mock' : '');
    },
  }
}
</script>