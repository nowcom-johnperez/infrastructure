<!-- eslint-disable no-console -->
<template>
  <div class="base">
    <h1 class="text-label">Virtual Network</h1>
    <div class="mt-10 mb-10" v-if="apiResponse">
      <Alert :variant="apiResponse" @close="apiResponse = null">{{ apiResponseMessage }}</Alert>
    </div>
    <GroupButtons :list="vnetButtons" @action="actionHandler"/>
    <div class="form-row mt-10">
      <div class="form-column">
        <SortableTable 
          :headers="networkHeader" 
          :rows="networks" 
          :paging="true" 
          :rowActionsWidth="10" 
          :rows-per-page="5" 
          keyField="name" 
          :loading="loading"
          :tableActions="true"
          :rowActions="true"
          >
          <template #header-left>
            <cButton class="cbtn btn-primary block" @click="initBulkDelete" :disabled="loading">
              <span class="fa fa-trash fa-lg mr-5"></span> Bulk Delete
            </cButton>
          </template>
          <template #cell:name="{row}">
            <a href="#" @click.prevent="openSidebar(row)">{{ row.name }}</a>
          </template>
          <template #row-actions="row">
            <cButton class="cbtn btn-primary" @click="openModal(row.row)" :disabled="loading">
              <span class="fa fa-trash fa-lg mr-5"></span> Delete
            </cButton>
          </template>
        </SortableTable>
      </div>
    </div>

    <div class="form-row mt-10">
      <div class="form-column">
        <SortableTable 
          :headers="networkHeader" 
          :rows="express.mainRow" 
          keyField="name" 
          :loading="loading"
          >
          <template #header-left>
            <div class="row table-heading">
              <h2 class="mb-0">
                Express Network
              </h2>
            </div>
          </template>
          <template #cell:name="{row}">
            <a href="#" @click.prevent="openSidebar(row)">{{ row.name }}</a>
          </template>
          <template #row-actions="row">
            <span></span>
          </template>
        </SortableTable>
      </div>
    </div>

    <SideBar type="main" :sidebar-visible="sidebarVisible" @close="closeSidebar">
      <h2 class="text-label">{{ selectedNetwork ? selectedNetwork.name : 'No Network Selected' }}</h2>
        <div class="form-row">
          <div class="form-column" align="left">
            <cButton class="cbtn btn-light" @click="addSubnetSidebar">
              <i class="fa fa-plus fa-lg mr-5"></i> Add Subnet
            </cButton> 
          </div>
        </div>
        <div class="mt-10 mb-10" v-if="subnetResponse">
          <Alert :variant="subnetResponse" @close="subnetResponse = null">{{ subnetResponseMessage }}</Alert>
        </div>
        <SortableTable v-if="selectedNetwork" :headers="selectedNetwork?.vrf === 'express' ? express.subHeader : subnetworkHeader" :rows="selectedNetwork.vrf && selectedNetwork.vrf === 'express' ? activatedExpressSubnets : selectedNetwork.subnets" :paging="true" :rowActionsWidth="10" :rows-per-page="5" keyField="name" :loading="loading">
          <template #cell:longName="{row}">
            <span>{{ row.displayName || row.longName }}</span>
          </template>
          <template #cell:dhcpEnabled="{row}">
            <BadgeState
              :color="row.dhcpEnabled ? 'bg-success' : 'bg-info'"
              :label="row.dhcpEnabled ? 'ENABLED' : 'DISABLED'"
            />
          </template>
          <template #row-actions="row">
            <cButton class="cbtn btn-primary" @click="openModalAction(row.row)" :disabled="loading">
              <span class="fa fa-trash fa-lg mr-5"></span> Delete
            </cButton>
          </template>  
        </SortableTable>
    </SideBar>

    <SideBar type="sub" :sidebar-visible="addSubnetSidebarVisible" @close="closeSubnetSidebar">
      <AddSubnet v-if="selectedNetwork" :is-open="addSubnetSidebarVisible" :current-network="selectedNetwork" :current-sub="express.nextAvailableSub" @success="subnetAddedHandler" />
    </SideBar>

    <!-- Modal -->
    <Modal v-if="isModalOpen">
      <template v-slot:content>
        <h2>Delete?</h2>
        <p>Are you sure that you want to delete VLAN "{{ selectedVnetName }}"?</p>
      </template>

      <template v-slot:footer>
        <cButton class="cbtn btn-danger" @click="deleteNetwork" :disabled="loading" label="Yes" />
        <cButton class="cbtn btn-light" @click="closeModal" :disabled="loading" label="No" />
      </template>
    </Modal>

    <Modal v-if="bulk.show">
      <template v-slot:content>
        <h2>Delete?</h2>
        <p>Are you sure that you want to delete the following VLAN:</p>
        <ul>
          <li v-for="vlan in bulk.items" :key="vlan">{{ vlan }}</li>
        </ul>
      </template>

      <template v-slot:footer>
        <cButton class="cbtn btn-danger" @click="processBulkDelete" :disabled="loading" label="Yes" />
        <cButton class="cbtn btn-light" @click="closeBulkDelete" :disabled="loading" label="No" />
      </template>
    </Modal>

    <Modal v-if="isModalSubnetOpen">
      <template v-slot:content>
        <h2>Are you sure that you want to delete:</h2>
        <p v-if="!selectedNetwork?.vrf">Subnet "{{ subnet_name }}" under VNET "{{ vnet_name }}"?</p>
        <p v-else>Express Subnet "{{ express.selectedSub?.displayName || express.selectedSub?.name }}"?</p>
      </template>

      <template v-slot:footer>
        <cButton class="cbtn btn-danger" @click="deleteSubnet" :disabled="loading" label="Yes" />
        <cButton class="cbtn btn-light" @click="closeModalSubnet" :disabled="loading" label="No" />
      </template>
    </Modal>
  </div>
</template>

<script>
import { SORTABLE_SUB_NETWORK_HEADERS, SORTABLE_NETWORK_HEADERS, SORTABLE_SUB_NETWORK_EXPRESS_HEADERS } from '../config/table'
import { VNET_BUTTONS } from '../config/buttons'
import { mapGetters } from 'vuex'
import SortableTable from '@shell/components/ResourceTable.vue'

import cButton from '../components/common/Button'
import SideBar from '../components/Sidebar'
import GroupButtons from '../components/common/GroupButtons'
import Modal from '../components/common/Modal'
import Alert from '../components/common/Alert'
import AddSubnet from '../components/forms/AddSubnet'
import { BadgeState } from '@components/BadgeState';

import { PRODUCT_NAME, CREATE_NETWORK, BLANK_CLUSTER } from '../config/constants'
import { expressService } from '../services/api/express'

export default {
  name: 'ListNetwork',
  components: {
    SortableTable,
    cButton,
    SideBar,
    GroupButtons,
    Modal,
    Alert,
    AddSubnet,
    BadgeState
  },
  // layout: 'home',
  data() {
    return {
      selectedName:            '', // Dropdown for network name
      selectedVnetName:        '',
      selectedSubnetName:      '',
      selectedVnetSubnets:     '10.55.0.0',
      loading:                 false,
      isModalOpen:             false,
      apiResponse:             null,
      subnetResponse:          null,
      isModalSubnetOpen:       false,
      vnet_name:               '',
      subnet_name:             '',
      subnet_address:          '',
      subnet_prefix_len:       '',
      subnet_id:               '',
      selectedNetwork:         null,
      sidebarVisible:          false,
      addSubnetSidebarVisible: false,
      apiError:                null,
      apiResponseMessage:      '',
      filters:                 { name: { value: '', keys: ['longName'] } },
      currentPage:             1,
      totalPages:              0,
      networkHeader: [],
      subnetworkHeader: [],
      vnetButtons: [],
      bulk: {
        items: [],
        show: false,
      },
      express: {
        mainRow: [{ name: 'express', translatedAddress: '209.76.247.254/32', subnetLength: 0, vrf: 'express' }],
        networks: [],
        subHeader: null,
        nextAvailableSub: {},
        selectedSub: {}
      }
    };
  },
  computed: {
    ...mapGetters(PRODUCT_NAME, {
      networks: 'items',
    }),
    activatedExpressSubnets() {
      return this.express.networks.filter((item) => item.activated)
    },
    inactiveExpressSubnets() {
      return this.express.networks.filter((item) => !item.activated)
    }
  },
  methods: {
    async processBulkDelete () {
      if (this.bulk.show) {
        this.loading = true;
        for(const vnetName of this.bulk.items) {
          await this.$store.dispatch(`${PRODUCT_NAME}/deleteNetwork`, vnetName);
        }
        this.loading = false;
        this.bulk.show = false;
      }
      await this.fetchNetworks();
    },
    closeBulkDelete () {
      this.bulk.show = false
    },
    initBulkDelete() {
      const selectedRows = document.querySelectorAll('.row-selected');
      if (selectedRows.length === 0) return
      this.bulk.items = Array.from(selectedRows).map(row => {
        return row.getAttribute('data-node-id');
      });

      this.bulk.show = true
    },
    actionHandler (action) {
      if (action === 'create') {
        this.$router.push(`/${ PRODUCT_NAME }/c/${ BLANK_CLUSTER }/${ CREATE_NETWORK }`);
      } else if (action === 'refresh') {
        this.fetchNetworks();
      }
    },
    async getSubnetByName (networkName) {
      if (!this.selectedNetwork?.vrf) {
        this.selectedNetwork = null;
        await this.fetchNetworks();
        this.selectedNetwork = this.networks.find((network) => network.name === networkName);
      } else {
        await this.fetchNetworks();
        this.setSelectedExpressSub()
      }
    },
    async subnetAddedHandler() {
      this.subnetResponse = 'success';
      this.subnetResponseMessage = 'Successfully added subnet!';
      this.addSubnetSidebarVisible = false;
      await this.getSubnetByName(this.selectedNetwork.name);
    },
    addSubnetSidebar() {
      this.selectedSubnetName = null;
      this.addSubnetSidebarVisible = true;
    },
    closeSubnetSidebar() {
      this.addSubnetSidebarVisible = false;
    },
    async openSidebar(item) {
      // Update the item with the fetched data
      this.subnetResponse = null;
      this.selectedNetwork = item;
      this.sidebarVisible = true;

      this.setSelectedExpressSub()
    },
    setSelectedExpressSub() {
      if (this.selectedNetwork?.vrf === 'express') {
        this.express.nextAvailableSub = this.inactiveExpressSubnets.length > 0 ? this.inactiveExpressSubnets[0] : {}
      }
    },
    closeSidebar() {
      this.selectedNetwork = null;
      this.sidebarVisible = false;
    },
    openModal(vnetRow) {
      const { name } = vnetRow;
      // Set the selected VLAN name
      this.selectedVnetName = name;
      this.subnetResponse = null;
      // Open the modal
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },

    openModalAction(subnetRow) {
      const { name, address, prefix_len } = subnetRow;
      // Set the selected VLAN name
      console.log(name, address, prefix_len);
      this.vnet_name = this.selectedNetwork.name;
      this.subnet_name = name;
      this.subnet_address = address;
      this.subnet_prefix_len = prefix_len;

      if (this.selectedNetwork?.vrf === 'express') {
        this.express.selectedSub = this.activatedExpressSubnets.find((item) => item.name === name)
      }

      // Open the modal
      this.isModalSubnetOpen = true;
    },

    closeModalSubnet() {
      this.isModalSubnetOpen = false;
    },

    async fetchNetworks() {
      console.log('fetching networks');
      // Fetch the network list from your API
      try {
        await this.$store.dispatch(`${PRODUCT_NAME}/findAll`)
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
      } catch (error) {
        console.error('Error fetching Network List:', error);
      }
    },
    async deleteNetwork() {
      try {
        console.log(`Delete Network Endpoint, ${ this.selectedVnetName }`);
        this.loading = true;
        // Close the modal before deletion
        this.closeModal();
        await this.$store.dispatch(`${PRODUCT_NAME}/deleteNetwork`, this.selectedVnetName);
        this.loading = false;

        // defines what kind of component should the notification show
        this.apiResponse = 'error';
        // Set the API response data in the component
        this.apiResponseMessage = `You have successfully deleted VNET: ${this.selectedVnetName}`;
        this.apiError = null; // Reset error state

        await this.fetchNetworks();
      } catch (error) {
        // Handle any errors here
        console.error('Error deleting network:', error);
        this.loading = false;
        this.isModalOpen = true;
        this.apiResponseMessage = 'Error';
        // Set the API error in the component
        this.apiError = error.response ? error.response.data : error.message;
        this.apiResponse = 1; // Reset response state
      }
    },

    async deleteSubnet() {
      try {
        this.closeModalSubnet();
        this.loading = true;
        if (!this.selectedNetwork?.vrf) {
          this.selectedNetwork.subnets = this.selectedNetwork.subnets.filter(subnet => subnet.name !== this.subnet_name);
          const vnet_data = {
            apiVersion: 'packetlifter.dev/v1',
            kind:       'Vnet',
            // vnet_vlan: this.selectedVnetVlan,
            metadata:   {
              name:      this.vnet_name.toLowerCase(),
              namespace: 'default'
            },
            spec: {
              name:    this.vnet_name.toLowerCase(),
              subnets: this.selectedNetwork.subnets,
            }
          };

          
          await this.$store.dispatch(`${PRODUCT_NAME}/deleteSubnet`, {
            vnetName: this.vnet_name,
            vnetData: vnet_data
          })
          this.subnetResponse = 'error';
          this.subnetResponseMessage = `Successfully deleted subnet: ${this.subnet_name}`;
        } else {
          const name = this.express.selectedSub?.name
          const express_data = {
              apiVersion: 'packetlifter.dev/v1',
              kind:       'Subnet',
              metadata:   {
                name
              },
              spec: {
                name,
                activated: false,
              }
          };
          await expressService.patchExpressSubnet(name, express_data);
          this.subnetResponse = 'error';
          this.subnetResponseMessage = `Successfully deleted express subnet: ${this.express.selectedSub?.displayName || this.express.selectedSub?.name}`;
        }
        this.loading = false

        await this.getSubnetByName(this.vnet_name);
      } catch (error) {
        // Handle any errors here
        console.error('Error deleting network:', error);
        this.loading = false;
        this.isModalSubnetOpen = true;
        // Set the API error in the component
        this.subnetResponseMessage = error.response ? error.response.data : error.message;
        this.subnetResponse = 'error';
      }
    },
  },
  created() {
    this.networkHeader = SORTABLE_NETWORK_HEADERS;
    this.subnetworkHeader = SORTABLE_SUB_NETWORK_HEADERS;
    this.vnetButtons = VNET_BUTTONS;
    this.express.subHeader = SORTABLE_SUB_NETWORK_EXPRESS_HEADERS;
  },
  mounted() {
    // Fetch the VLAN list and network list when the component is mounted
    this.fetchNetworks();
    // this.fetchHarvesterNetworks();
  },
};
</script>

<style scoped>
/* notif */
/* Your existing style code */
.notification {
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 10px;
  border-radius: 5px;
  color: #fff;
  font-weight: bold;
}
</style>
