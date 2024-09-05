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
        <div v-if="loading">
          Loading data... Please wait...
        </div>
        <SortableTable 
          v-if="!loading"
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
          <template #cell:inbound="{row}">
            <span>{{ row.inbound }} | {{ row.outbound }}</span>
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
import { SORTABLE_FIREWALL_NETWORK_HEADERS } from '../config/table'
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
import { firewallService } from '../services/api/firewall'

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
      firewallRules: [],
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
      selectedNetwork: null,
      transformedNetworks: []
    };
  },
  computed: {
    ...mapGetters(PRODUCT_STORE, {
      networks: 'items',
    }),
    activatedExpressSubnets() {
      return this.express.networks.filter((item) => item.activated)
    },
    combinedExpressAndVnets () {
      // return [...this.express.mainRow, ...this.transformedNetworks]
      return [...this.transformedNetworks]
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
      this.selectedNetwork = null
      this.fetchNetworks()
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
            name: item.metadata.name,
            longName: item.metadata.name,
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
          message: 'Fetching Express Network Data: Something went wrong!',
        })
      }
    },
    async fetchSubnetTranslations() {
      return await expressService.getAllNetworks()
    },
    async fetchNetworks() {
      try {
        this.loading = true
        await this.$store.dispatch(`${PRODUCT_STORE}/findAll`)
        // await this.fetchExpressNetworks()
        const subnets = await this.fetchSubnetTranslations()
        this.transformedNetworks = this.networks.map((network) => {
          return {
            ...network,
            subnets: network.subnets.map((subnet) => subnet.longName),
            inbound: 0,
            outbound: 0,
            subnetTranslatedAddress: subnets.filter((subnet) => subnet.spec.vrf === network.name && subnet.spec.addressTranslation).map((subnet) => { return { longName: subnet.metadata.name, formattedAddress: subnet.spec.addressTranslation?.inside, translatedAddress: subnet.spec.addressTranslation?.outside}})
          }
        })

        await this.fetchSecurityRules()
      } catch (error) {
        this.$store.dispatch('growl/error', {
          title: 'Error',
          message: 'Fetching Virtual Network Data: Something went wrong!',
        })
      } finally {
        this.loading = false
      }
    },
    async fetchSecurityRules() {
      try {
        const res = await firewallService.getFirewallRules()
        this.firewallRules = res.data.items

        this.transformedNetworks.forEach((network, index) => {
          const inbound = this.firewallRules.filter((rule) => rule.spec.vnet === network.name && rule.spec.direction === 'inbound').length
          const outbound = this.firewallRules.filter((rule) => rule.spec.vnet === network.name && rule.spec.direction === 'outbound').length
          this.transformedNetworks[index].inbound = inbound
          this.transformedNetworks[index].outbound = outbound
        })
      } catch (error) {
        this.$store.dispatch('growl/error', {
          title: 'Error',
          message: 'Fetching Security Rules: Something went wrong!',
        })
      }
    }
  },
  created() {
    this.networkHeader = SORTABLE_FIREWALL_NETWORK_HEADERS;
    this.firewallButtons = VNET_BUTTONS;
  },
  mounted() {
    this.fetchNetworks();
  },
};
</script>
