<template>
  <div class="details-table">
    <div class="row-detail">
      <div class="row-label">Cluster Name</div>
      <div class="row-val">
        <a
          :href="`/c/${cluster.id}/explorer#cluster-events`"
          @click.prevent="exploreCluster"
          target="_blank"
          rel="noopener noreferrer nofollow"
          class="btn role-secondary btn-sm ml-10"
        >
          {{ cluster?.spec?.displayName || '-' }}
        </a>
      </div>
    </div>
    <div v-if="ingress" class="row-detail">
      <div class="row-label">FQDN</div>
      <div class="row-val">
        <a :href="getIngressPath" target="_blank" class="btn btn-sm role-secondary ml-10 clikable" type="button">
          <!-- <CopyToClipboardText :text="getIngressPath" /> -->
          {{ getIngressPath }}
        </a>
      </div>
    </div>
    <div class="row-detail">
      <div class="row-label">Node IP</div>
      <div class="row-val">
        <template v-if="ingress">
          <button class="btn btn-sm role-secondary ml-10 clikable mr-3" type="button" v-for="ip in ingress.nodeIP.slice(0, 3)" :key="`${ip}-node-${ingress.metadata.namespace}`">
            <CopyToClipboardText :text="ip" />
          </button>
        </template>
        <span v-else>Not available</span>
      </div>
    </div>
    <div class="row-detail">
      <div class="row-label">Load Balancer IP</div>
      <div class="row-val">
        <template v-if="loadBalancerIP.length > 0" >
          <button class="btn btn-sm role-secondary ml-10 clikable" type="button" v-for="ip in loadBalancerIP" :key="`${ip}-lb-${ingress.metadata.namespace}`">
            <CopyToClipboardText :text="ip" />
          </button>
        </template>
        <span v-else>Not available</span>
      </div>
    </div>
    <div class="row-detail">
      <div class="row-label">Github Repository Path</div>
      <div class="row-val">
        <span v-if="githubLinks.length === 0" class="ml-10">non assigned</span>
        <a
          v-for="link in githubLinks"
          :key="link"
          :href="link"
          target="_blank"
          rel="noopener noreferrer nofollow"
          class="btn role-secondary btn-sm ml-10"
        >
          {{ link }}
        </a>
      </div>
    </div>
    <!-- <div class="row-detail">
      <div class="row-label">Application</div>
      <div v-if="ingress" class="row-val">
        <a
          :href="getIngressPath"
          target="_blank"
          rel="noopener noreferrer nofollow"
          class="btn role-primary btn-sm ml-10"
        >
          Launch
        </a>
      </div>
    </div> -->
  </div>
</template>

<script>
import { MANAGEMENT, FLEET } from '@shell/config/types';
import { ingressFullPath } from '@shell/models/networking.k8s.io.ingress';
import CopyToClipboardText from '@shell/components/CopyToClipboardText.vue'
export default {
  name: 'EnvironmentAppLauncher',
  components: {
    CopyToClipboardText
  },
  props: {
    currentObj: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      clusters: [],
      cluster: {},
      ingress: null,
      services: null,
      loadBalancerIP: [],
      githubList: [],
    }
  },
  async fetch() {
    this.clusters = await this.getClusters();
    this.getGitHubRepos()
    this.cluster = this.clusters.find((cluster) => cluster.id === this.currentObj.clusterId)
    if (this.cluster) {
      await Promise.all([
        this.fetchIngress(),
        this.fetchService(),
      ]);
    }
  },
  computed: {
    getIngressPath() {
      if (!this.ingress.spec?.rules) return ''
      return ingressFullPath(this.ingress, this.ingress?.spec?.rules?.[0]) || '';
    },
    githubLinks() {
      return this.githubList.filter((gh) => {
        return gh.clusterName === this.cluster.spec.displayName
      }).map((gh) => gh.spec.repo)
    }
  },
  methods: {
    exploreCluster() {
      this.$router.push(`/c/${this.cluster.id}/explorer#cluster-events`)
    },
    async getGitHubRepos() {
      const hasFleetAccess = await this.$store.getters['management/schemaFor'](FLEET.GIT_REPO)
      if (!hasFleetAccess) return
      const allGithubRepos = await this.$store.dispatch(`management/findAll`, { type: FLEET.GIT_REPO } )
      this.githubList = allGithubRepos.map((g) => {
        return {
          ...g,
          clusterName: g.spec.targets?.map((target) => target.clusterName)[0]
        }
      })
    },
    async getClusters() {
      return await this.$store.dispatch(`management/findAll`, {
        type: MANAGEMENT.CLUSTER,
      });
    },
    async fetchIngress() {
      try {
        const ingresses = (
          await this.$store.dispatch('cluster/request', {
            url: `/k8s/clusters/${this.cluster.id}/v1/networking.k8s.io.ingresses`,
          })
        ).data;
        this.ingress = ingresses.map(ingress => ({
          ...ingress,
          clusterId: this.cluster.id,
          clusterName: this.cluster.spec.displayName,
          nodeIP: ingress.status?.loadBalancer?.ingress?.map(node => node.ip) || [],
        }))[0] || null;
      } catch (error) {
        console.error(`Error fetching ingresses for cluster ${this.cluster.id}:`, error);
      }
    },
    async fetchService() {
      try {
        const services = (
          await this.$store.dispatch('cluster/request', {
            url: `/k8s/clusters/${this.cluster.id}/v1/services`,
          })
        ).data;

        this.services = services
          .filter(service => 
            service.spec?.type === 'LoadBalancer' &&
            service.metadata?.annotations?.['kube-vip.io/loadbalancerIPs']
          )
          .map(service => ({
            ...service,
            clusterId: this.cluster.id,
            clusterName: this.cluster.spec.displayName,
          })) || null;

        this.loadBalancerIP = this.services.map((service) => {
          return service.metadata?.annotations?.['kube-vip.io/loadbalancerIPs']
        })
      } catch (error) {
        console.error(`Error fetching services for cluster ${this.cluster.id}:`, error);
      }
    },
  }
}
</script>