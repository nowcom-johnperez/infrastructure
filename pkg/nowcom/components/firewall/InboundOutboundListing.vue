<template>
  <div>
    <h2 class="text-label">{{ vnet.name }}</h2>
    <GroupButtons class="w-100" :list="firewallButtons" @action="actionHandler"/>
    <div class="mt-10">
      <Tabs :list="['Inbound Security Rules', 'Outbound Security Rules']" :current="currentTabIndex" @set-active="setTab"/>

      <div class="tab-content-container mt-10">
        <div class="tab-content" :class="{ 'show': currentTabIndex === 0 }">
          <InboundTable :vnet-id="vnet.name" :items="getInboundRules" />
          
        </div>

        <div class="tab-content" :class="{ 'show': currentTabIndex === 1 }">
          <OutboundTable :vnet-id="vnet.name" :items="getOutboundRules" />
        </div>
      </div>
    </div>

    <SideBar type="sub" :sidebar-visible="sidebar.show" @close="closeForm">
      <RulesForm v-if="sidebar.show" :rule-type="currentTabIndex === 0 ? 'inbound' : 'outbound'" :vnet-id="vnet.name" @onClose="closeForm" :vnets="vnets" :subnets="vnet.subnets"/>
    </SideBar>
  </div>
</template>

<script>
import SideBar from '../Sidebar'
import InboundTable from './InboundTable'
import OutboundTable from './OutboundTable'
import RulesForm from './RulesForm'
import cButton from '../common/Button'
import GroupButtons from '../common/GroupButtons'
import Tabs from '../common/Tabs'
import { FIREWALL_BUTTONS } from '../../config/buttons'
import { firewallService } from '../../services/api/firewall'
export default {
  name: 'FirewallListing',
  props: {
    vnet: {
      type: Object,
      required: true
    },
    vnets: {
      type: Array,
      required: true,
    },
  },
  components: {
    SideBar,
    cButton,
    GroupButtons,
    Tabs,
    InboundTable,
    OutboundTable,
    RulesForm
  },
  data() {
    return {
      firewallButtons: [],
      headers: [],
      currentTabIndex: 0,
      sidebar: {
        show: false,
      },
      firewallRules: []
    }
  },
  computed: {
    getInboundRules() {
      return this.firewallRules.filter((d) => d.spec.direction === 'inbound' && d.spec.vnet === this.vnet.name).map(this.rulesMapper)
    },
    getOutboundRules() {
      return this.firewallRules.filter((d) => d.spec.direction === 'outbound' && d.spec.vnet === this.vnet.name).map(this.rulesMapper)
    }
  },
  methods: {
    rulesMapper(data) {
      return data.spec
    },
    setTab (tabIndex) {
      this.currentTabIndex = tabIndex
    },
    actionHandler (action) {
      if (action === 'create') {
        this.sidebar.show = true
        // this.$router.push(`/${ PRODUCT_NAME }/c/${ BLANK_CLUSTER }/${ CREATE_NETWORK }`);
      } else if (action === 'refresh') {
        this.fetchData()
      }
    },
    async closeForm () {
      await this.fetchData()
      this.sidebar.show = false
    },
    async fetchData () {
      const res = await firewallService.getFirewallRules()
      this.firewallRules = res.data.items
    }
  },
  async mounted() {
    this.firewallButtons = FIREWALL_BUTTONS
    await this.fetchData();
  }
}
</script>