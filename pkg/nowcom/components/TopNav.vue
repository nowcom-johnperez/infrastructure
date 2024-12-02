<template>
  <nav class="navbar">
    <ul class="nav-list">
      <li><router-link :to="homeLocation">Home</router-link></li>
      <li v-if="isTridentAppInstalled" class="dropdown">
        <a href="#">Trident</a>
        <ul class="dropdown-menu">
          <li><router-link :to="tridentLocation.app">App Launcher</router-link></li>
          <li><router-link :to="tridentLocation.wiki">Wiki</router-link></li>
          <li><router-link :to="tridentLocation.harvester">Resource Management</router-link></li>
        </ul>
      </li>
      <li class="dropdown">
        <a href="#">Infrastructure</a>
        <ul class="dropdown-menu">
          <!-- <li><router-link :to="infraLocation.k8">Kubernetes</router-link></li> -->
          <li><router-link :to="infraLocation.network">Network</router-link></li>
          <li><router-link :to="infraLocation.firewall">Firewall</router-link></li>
          <li><router-link :to="infraLocation.dhcp">DHCP</router-link></li>
          <!-- <li><router-link :to="infraLocation.dns">DNS</router-link></li> -->
          <li><router-link :to="infraLocation.roadmap">Road Map</router-link></li>
        </ul>
      </li>
      
    </ul>
  </nav>
</template>

<script>
import { CATALOG } from '@shell/config/types';
import { getConfig } from '../config/api';
import { PRODUCT_NAME, HOME, LIST_NETWORK, LIST_K8, LIST_FIREWALL, LIST_DNS, LIST_DHCP, ROAD_MAP, TRIDENT, BLANK_CLUSTER } from '../config/constants';
const { CLUSTER, ENVIRONMENT_CLUSTER } = getConfig()
export default {
  name: 'TopNav',
  data() {
    return {
      isTridentAppInstalled: false
    }
  },
  async fetch() {
    let installedApps;

    // needed to check if operator is installed
    if (this.$store.getters['management/canList'](CATALOG.APP)) {
      installedApps = await this.$store.dispatch('management/findAll', { type: CATALOG.APP });
    }

    // we need to check for the length of the response
    // due to some issue with a standard-user, which can list apps
    // but the list comes up empty []
    const isTridentAppInstalled = installedApps?.length && installedApps?.find(item => item.spec?.chart?.metadata?.name === 'trident');

    // check if operator is installed
    if (isTridentAppInstalled) {
      this.isTridentAppInstalled = true;
    }
  },
  computed: {
    homeLocation() {
      return {
        name: `${PRODUCT_NAME}-c-cluster-${HOME}`,
        params: {
          cluster: ENVIRONMENT_CLUSTER
        }
      }
    },
    tridentLocation() {
      return {
        app: {
          name: `${TRIDENT.PRODUCT_NAME}-c-cluster-${TRIDENT.LOCAL_TESTING}`,
          params: {
            cluster: BLANK_CLUSTER
          }
        },
        wiki: {
          name: `${TRIDENT.PRODUCT_NAME}-c-cluster-${TRIDENT.WIKI}`,
          params: {
            cluster: BLANK_CLUSTER
          }
        },
        harvester: {
          name: `${TRIDENT.PRODUCT_NAME}-c-cluster-${TRIDENT.RESOURCE_MANAGEMENT}`,
          params: {
            cluster: CLUSTER
          }
        }
      }
    },
    infraLocation() {
      return {
        k8: {
          name: `${PRODUCT_NAME}-c-cluster-${LIST_K8}`,
          params: {
            cluster: BLANK_CLUSTER
          }
        },
        network: {
          name: `${PRODUCT_NAME}-c-cluster-${LIST_NETWORK}`,
          params: {
            cluster: BLANK_CLUSTER
          }
        },
        firewall: {
          name: `${PRODUCT_NAME}-c-cluster-${LIST_FIREWALL}`,
          params: {
            cluster: BLANK_CLUSTER
          }
        },
        dns: {
          name: `${PRODUCT_NAME}-c-cluster-${LIST_DNS}`,
          params: {
            cluster: BLANK_CLUSTER
          }
        },
        dhcp: {
          name: `${PRODUCT_NAME}-c-cluster-${LIST_DHCP}`,
          params: {
            cluster: BLANK_CLUSTER
          }
        },
        roadmap: {
          name: `${PRODUCT_NAME}-c-cluster-${ROAD_MAP}`,
          params: {
            cluster: BLANK_CLUSTER
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  width: 100%;
  background-color: #1b1c21;
  padding: 10px 0;
  z-index: 15;
  border: 1px solid #3D98D3;
}

.nav-list {
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list > li {
  position: relative;
  margin: 0 15px;
}

.nav-list a {
  color: white;
  text-decoration: none;
  padding: 10px 15px;
  display: block;
}

.nav-list a:hover {
  background-color: #555;
  border-radius: 5px;
}

.nav-list a.router-link-active {
  background-color: #555;
  border-radius: 5px;
}

.dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-menu {
  display: none;
  position: absolute;
  background-color: #333;
  list-style: none;
  padding: 10px 0;
  margin: 0;
  border-radius: 5px;
  top: 100%;
  left: 0;
  z-index: 1000;
  min-width: 150px;
}

.dropdown-menu li {
  margin: 0;
}

.dropdown-menu a {
  padding: 10px 15px;
}

.dropdown-menu a:hover {
  background-color: #555;
  border-radius: 0;
}
</style>
