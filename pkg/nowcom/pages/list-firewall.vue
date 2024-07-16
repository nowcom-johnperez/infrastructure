<!-- eslint-disable no-console -->
<template>
  <div class="base">
    <h1 class="text-label">Firewall</h1>
    <div class="mt-10 mb-10" v-if="response.show">
      <Alert :variant="response.variant" @close="response.show = false">{{ response.msg }}</Alert>
    </div>
    <GroupButtons :list="firewallButtons" @action="actionHandler"/>

    <div class="form-row mt-10">
      <div class="form-column">
        <SortableTable 
          :headers="networkHeader" 
          :rows="combinedExpressAndVnets" 
          :paging="true" 
          :rowActionsWidth="10" 
          :rows-per-page="5" 
          keyField="name"
          :loading="loading"
          :tableActions="false"
          :rowActions="false"
          >
          <template #cell:name="{row}">
            <a href="#" @click.prevent="openSidebar(row)">{{ row.name }}</a>
          </template>
          <template #row-actions="row">
            <!-- currently disabled -->
            <span></span>
          </template>
        </SortableTable>
      </div>
    </div>

    <SideBar type="main" :sidebar-visible="sidebarVisible" @close="closeSidebar">
      <InboundOutboundListing v-if="selectedNetwork" :vnet="selectedNetwork" :vnets="allVnets" />
    </SideBar>
  </div>
</template>

<script>
import { SORTABLE_SUB_NETWORK_HEADERS, SORTABLE_NETWORK_HEADERS, SORTABLE_SUB_NETWORK_EXPRESS_HEADERS } from '../config/table'
import { VNET_BUTTONS } from '../config/buttons'
import { mapGetters } from 'vuex'
import SortableTable from '@shell/components/ResourceTable.vue'
import SideBar from '../components/Sidebar'
import cButton from '../components/common/Button'
import GroupButtons from '../components/common/GroupButtons'
import Alert from '../components/common/Alert'
import InboundOutboundListing from '../components/firewall/InboundOutboundListing'

import { PRODUCT_STORE, PRODUCT_NAME, CREATE_NETWORK, BLANK_CLUSTER } from '../config/constants'
import { expressService } from '../services/api/express'

export default {
  name: 'ListFirewall',
  components: {
    SortableTable,
    cButton,
    GroupButtons,
    Alert,
    SideBar,
    InboundOutboundListing
  },
  data() {
    return {
      filters: { name: { value: '', keys: ['longName'] } },
      loading: false,
      networkHeader: [],
      express: {
        mainRow: [{ name: 'express', translatedAddress: '209.76.247.250/32', subnetLength: 0, vrf: 'express', subnets: [] }],
        networks: [],
      },
      response: {
        variant: 'error',
        show: false,
        msg: '',
      },
      sidebarVisible: false,
      selectedNetwork: null
    };
  },
  computed: {
    ...mapGetters(PRODUCT_STORE, {
      networks: 'items',
    }),
    activatedExpressSubnets() {
      return this.express.networks.filter((item) => item.activated)
    },
    inactiveExpressSubnets() {
      return this.express.networks.filter((item) => !item.activated)
    },
    transformedNetworks() {
      return this.networks.map((network) => {
        return {
          ...network,
          subnets: network.subnets.map((subnet) => subnet.name)
        }
      })
    },
    combinedExpressAndVnets () {
      return [...this.express.mainRow, ...this.transformedNetworks]
    },
    allVnets() {
      return this.combinedExpressAndVnets.map((network) => network.name)
    }
  },
  methods: {
    actionHandler (action) {
      if (action === 'create') {
        this.$router.push(`/${ PRODUCT_NAME }/c/${ BLANK_CLUSTER }/${ CREATE_NETWORK }`);
      } else if (action === 'refresh') {
        this.$store.dispatch(`${PRODUCT_STORE}/reset`);
        this.fetchNetworks();
      }
    },
    openSidebar(row) {
      this.selectedNetwork = row
      this.sidebarVisible = true
    },
    closeSidebar () {
      this.sidebarVisible = false
    },
    async fetchExpressNetworks() {
      try {
        const res = await expressService.getAllNetworks()
        this.express.networks = res.filter((item) => {
          return item.spec.vrf === 'express'
        }).map((item) => {
          return {
            address: item.spec.address,
            formattedAddress: `${item.spec.address}/${item.spec.prefixLength}`,
            displayName: item.metadata.labels?.displayName || '',
            name: item.spec.name,
            longName: item.spec.name,
            prefix_len: item.spec.prefixLength,
            dhcpEnabled: item.spec.dhcpEnabled,
            translatedAddress: '',
            activated: item.spec.activated
          }
        })
        this.express.mainRow[0].subnetLength = this.activatedExpressSubnets.length
        this.express.mainRow[0].subnets = this.express.networks.map((d) => d.name)
      } catch (error) {
        this.$store.dispatch('growl/error', {
          title: 'Error',
          message: 'Fetching Express Network Data: Oops! Something went wrong!',
        })
      }
    },
    async fetchNetworks() {
      try {
        await this.$store.dispatch(`${PRODUCT_STORE}/findAll`)
        await this.fetchExpressNetworks()
      } catch (error) {
        this.$store.dispatch('growl/error', {
          title: 'Error',
          message: 'Fetching Virtual Network Data: Oops! Something went wrong!',
        })
      }
    },
     // async getSubnetByName (networkName) {
    //   if (!this.selectedNetwork?.vrf) {
    //     this.subnetsListing = [];
    //     this.subnetsListing = await this.$store.dispatch(`${PRODUCT_STORE}/getSubnets`, networkName);
    //     const index = this.networks.findIndex((vnet) => vnet.name === networkName);
    //     if (index >= 0) {
    //       this.networks[index].subnetLength = this.subnetsListing.length;
    //       this.networks[index].subnets = this.subnetsListing;
    //     }
    //   } else {
    //     await this.fetchNetworks();
    //     this.setSelectedExpressSub()
    //   }
    // },
  },
  created() {
    this.networkHeader = SORTABLE_NETWORK_HEADERS;
    this.subnetworkHeader = SORTABLE_SUB_NETWORK_HEADERS;
    this.firewallButtons = VNET_BUTTONS;
    this.express.subHeader = SORTABLE_SUB_NETWORK_EXPRESS_HEADERS;
  },
  mounted() {
    this.fetchNetworks();
  },
};
</script>
