<template>
  <div>
    
  </div>
</template>

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
  name: 'CustomNamespaceList',
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
    // this.projects = await this.$store.dispatch('management/findAll', { type: MANAGEMENT.PROJECT, opt: { force: true } });
    // this.harvesterNS = await harvesterService.getNamespaces()
    // this.nsResourceQuotas = await harvesterService.getNamespaceQuota()
  }
}
</script>