<template>
  <div>
    <h2 class="text-label">{{ vnet.name }}</h2>
    <GroupButtons class="w-100" :list="firewallButtons" @action="actionHandler"/>
    <div class="mt-10">
      <Tabs :list="['Inbound Security Rules', 'Outbound Security Rules']" :current="currentTabIndex" @set-active="setTab"/>

      <div class="tab-content-container mt-10">
        <div class="tab-content" :class="{ 'show': currentTabIndex === 0 }">
          <InboundTable :vnet-id="vnet.name" />
          
        </div>

        <div class="tab-content" :class="{ 'show': currentTabIndex === 1 }">
          <OutboundTable :vnet-id="vnet.name" />
        </div>
      </div>
    </div>

    <SideBar type="sub" :sidebar-visible="sidebar.show" @close="closeForm">
      <RulesForm v-if="sidebar.show" :rule-type="currentTabIndex === 0 ? 'inbound' : 'outbound'" :vnet-id="vnet.name" @onClose="closeForm"/>
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
export default {
  name: 'FirewallListing',
  props: {
    vnet: {
      type: Object,
      required: true
    }
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
      }
    }
  },
  methods: {
    setTab (tabIndex) {
      this.currentTabIndex = tabIndex
    },
    actionHandler (action) {
      if (action === 'create') {
        this.sidebar.show = true
        // this.$router.push(`/${ PRODUCT_NAME }/c/${ BLANK_CLUSTER }/${ CREATE_NETWORK }`);
      } else if (action === 'refresh') {
        // this.$store.dispatch(`${PRODUCT_STORE}/reset`);
        // this.fetchNetworks();
      }
    },
    closeForm () {
      this.sidebar.show = false
    }
  },
  mounted() {
    this.firewallButtons = FIREWALL_BUTTONS
  }
}
</script>