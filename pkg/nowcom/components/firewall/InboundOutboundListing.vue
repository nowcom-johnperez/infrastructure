<template>
  <div>
    <h2 class="text-label">{{ vnet.name }}</h2>
    <GroupButtons class="w-100" :list="firewallButtons" @action="actionHandler"/>
    <div class="mt-10">
      <Tabs :list="['Inbound Security Rules', 'Outbound Security Rules', 'Translations']" :current="currentTabIndex" @set-active="setTab"/>

      <div class="tab-content-container mt-40">
        <div class="tab-content" :class="{ 'show': currentTabIndex === 0 }">
          <RulesTable v-if="!loading" :vnet-id="vnet.name" :items="getInboundRules" @onCreateClick="actionHandler" @onDeleteClick="handleDeleteClick" @onRowClick="handleRowClick"/>
          
        </div>

        <div class="tab-content" :class="{ 'show': currentTabIndex === 1 }">
          <RulesTable v-if="!loading" :vnet-id="vnet.name" :items="getOutboundRules" @onCreateClick="actionHandler" @onDeleteClick="handleDeleteClick" @onRowClick="handleRowClick"/>
        </div>

        <div class="tab-content" :class="{ 'show': currentTabIndex === 2 }">
          <RulesSubnetTable v-if="!loading" :items="vnet.subnetTranslatedAddress"/>
        </div>
      </div>
    </div>

    <SideBar type="sub" :sidebar-visible="sidebar.show" @close="closeForm">
      <RulesForm v-if="sidebar.show" :rule-type="currentTabIndex === 0 ? 'inbound' : 'outbound'" :vnet-id="vnet.name" @onClose="closeForm" :vnets="vnets" :subnets="vnet.subnets" :row-data="selectedRow"/>
    </SideBar>

    <Modal v-if="deleteModal.show">
      <template v-slot:content>
        <h2>Delete?</h2>
        <p>Are you sure that you want to delete {{ selectedRow.direction }} rule "{{ selectedRow.name }}"?</p>
      </template>

      <template v-slot:footer>
        <cButton class="cbtn btn-danger" @click="deleteRule" :disabled="deleteModal.loading" label="Yes" />
        <cButton class="cbtn btn-light" @click="closeModal" :disabled="deleteModal.loading" label="No" />
      </template>
    </Modal>
  </div>
</template>

<script>
import SideBar from '../Sidebar'
import Modal from '../common/Modal'
import RulesTable from './RulesTable'
import RulesSubnetTable from './RulesSubnetTable'
import RulesForm from './RulesForm'
import cButton from '../common/Button'
import GroupButtons from '../common/GroupButtons'
import Tabs from '../common/Tabs'
import { FIREWALL_BUTTONS } from '../../config/buttons'
import { firewallService } from '../../services/api/firewall'
import { PRODUCT_STORE } from '../../config/constants'
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
    RulesTable,
    RulesSubnetTable,
    RulesForm,
    Modal
  },
  data() {
    return {
      loading: false,
      firewallButtons: [],
      headers: [],
      currentTabIndex: 0,
      sidebar: {
        show: false,
      },
      firewallRules: [],
      subnets: [],
      selectedRow: {},
      deleteModal: {
        show: false,
        loading: false,
      }
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
    async deleteRule () {
      try {
        this.deleteModal.loading = true

        await firewallService.deleteFirewall(this.selectedRow.metadata.name)
        this.$store.dispatch('growl/success', {
          title: 'Deleted',
          message: `Successfully deleted ${this.selectedRow.direction} rule: ${this.selectedRow.name}`,
        }, { root: true })
        this.closeModal()
        await this.fetchData()
      } catch (error) {
        this.$store.dispatch('growl/error', {
          title: 'Error',
          message: 'Error Deleting Firewall Rule',
        }, { root: true })
      } finally {
        this.deleteModal.loading = false
      }
    },
    closeModal() {
      this.selectedRow = {}
      this.deleteModal.show = false
    },
    handleDeleteClick (row) {
      this.selectedRow = row
      this.deleteModal.show = true
    },
    handleRowClick (row) {
      this.selectedRow = row
      this.sidebar.show = true
    },
    rulesMapper(data) {
      return {
        ...data.spec,
        metadata: {
          ...data.metadata
        },
        name: data.metadata.name
      }
    },
    setTab (tabIndex) {
      this.currentTabIndex = tabIndex
    },
    actionHandler (action) {
      if (action === 'create') {
        this.selectedRow = {}
        this.sidebar.show = true
      } else if (action === 'refresh') {
        this.fetchData()
      }
    },
    async closeForm () {
      await this.fetchData()
      this.sidebar.show = false
    },
    async fetchData () {
      this.loading = true
      const res = await firewallService.getFirewallRules()
      this.firewallRules = res.data.items
      this.loading = false
    },
  },
  async mounted() {
    this.firewallButtons = FIREWALL_BUTTONS
    await this.fetchData();
  }
}
</script>