<template>
  <div>
    landing
    <pre>
      {{clusters}}
    </pre>
  </div>
</template>

<script>
import {
  parseSi, formatSi, exponentNeeded, UNITS, createMemoryValues
} from '@shell/utils/units';
import { MANAGEMENT } from '@shell/config/types';
import { environmentService } from '../services/api';

const PARSE_RULES = {
  memory: {
    format: {
      addSuffix:        true,
      firstSuffix:      'B',
      increment:        1024,
      maxExponent:      99,
      maxPrecision:     2,
      minExponent:      0,
      startingExponent: 0,
      suffix:           'iB',
    }
  }
};

export default {
  name: 'Landing',
  data() {
    return {
      clusters: []
    }
  },

  fetch() {
    this.fetchClusters()
  },

  methods: {

    async fetchClusters() {
      const clusters = await this.$store.dispatch('management/findAll', { type: MANAGEMENT.CLUSTER });
      const bindings = await environmentService.getClustersRoleBindings()
      this.clusters = await Promise.all(
        clusters.map(async (cluster) => {
          return this.processCluster(cluster, bindings.data);
        })
      );
    },

    async processCluster(cluster, bindings) {
      const formattedMemory = this.createMemoryUnits(cluster.status?.capacity?.memory);

      // const roles = await environmentService.getClusterRoleBinding(cluster.id);
      
      const roles = bindings.filter((b) => b.clusterId === cluster.id)
      const users = await this.processRoles(roles);

      console.log(`roles: ${cluster.id}`, roles, users);

      return {
        id: cluster.id,
        creatorId: cluster.metadata?.annotations['field.cattle.io/creatorId'],
        ownerNamespace: cluster.metadata?.annotations['objectset.rio.cattle.io/owner-namespace'],
        displayName: cluster.spec?.displayName,
        fleetWorkspaceName: cluster.spec?.fleetWorkspaceName,
        capacity: {
          cpu: cluster.status?.capacity?.cpu,
          memory: formatSi(parseSi(cluster.status?.capacity?.memory), formattedMemory),
        },
        users: users.map((user) => {
          return {
            name: user?.name || '',
            id: user?.id || '',
            azureUserId: user?.userPrincipalId || '',
            groupUserId: user?.groupPrincipalId || '',
            roleTemplateId: user?.roleTemplateId || ''
          }
        })
      };
    },

    async processRoles(roles) {
      return Promise.all(
        roles.map(async (role) => {
          try {
            let result = {};
            if (role.userPrincipalId) {
              const user = await environmentService.getUser(role.userPrincipalId)
              
              result = { ...user }
            } 
            if (role.groupPrincipalId) {
              const group = await environmentService.getUser(role.groupPrincipalId)

              result = { ...group }
            }
            // Return empty object if neither is present
            return {
              ...result,
              roleTemplateId: role.roleTemplateId,
              groupPrincipalId: role.groupPrincipalId || '',
              userPrincipalId: role.userPrincipalId || ''
            };
          } catch (error) {
            console.error(`Error processing role: ${role}`, error);
            return {
              roleTemplateId: role.roleTemplateId,
              groupPrincipalId: role.groupPrincipalId,
              userPrincipalId: role.userPrincipalId
            };
          }
        })
      );
    },

    createMemoryUnits(n) {
      const exponent = exponentNeeded(n, PARSE_RULES.memory.format.increment);

      return `${ UNITS[exponent] }${ PARSE_RULES.memory.format.suffix }`;
    },
  }
}
</script>