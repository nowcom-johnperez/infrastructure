<!-- eslint-disable no-console -->
<template>
  <div class="base">
    <h1>Virtual Network</h1>
    <div class="mt-10 mb-10" v-if="apiResponse">
      <Alert :variant="apiResponse" @close="apiResponse = null">{{ apiResponseMessage }}</Alert>
    </div>
    <GroupButtons :list="vnetButtons" @action="actionHandler"/>
    <div class="form-row mt-10">
      <div class="form-column">
        <UniversalTable v-if="networkHeader" :headers="networkHeader" :items="networks" :filters="filters" @item-click="openSidebar" @action-click="openModal" />
        </br> </br>
      </div>
    </div>

    <SideBar type="main" :sidebar-visible="sidebarVisible" @close="closeSidebar">
      <h2>{{ selectedNetwork ? selectedNetwork.name : 'No Network Selected' }}</h2>
        <div class="form-row">
          <div class="form-column" align="left">
            <cButton class="btn btn-light" @click="addSubnetSidebar">
              <i class="fa fa-plus fa-lg mr-5"></i> Add Subnet
            </cButton> 
          </div>
        </div>
        <div class="mt-10 mb-10" v-if="subnetResponse">
          <Alert :variant="subnetResponse" @close="subnetResponse = null">{{ subnetResponseMessage }}</Alert>
        </div>
        <UniversalTable v-if="selectedNetwork" :headers="subnetworkHeader" :items="selectedNetwork.subnets" @action-click="openModalAction" />
    </SideBar>

    <SideBar type="sub" :sidebar-visible="addSubnetSidebarVisible" @close="closeSubnetSidebar">
      <AddSubnet v-if="selectedNetwork" :is-open="addSubnetSidebarVisible" :current-network="selectedNetwork" @success="subnetAddedHandler" />
    </SideBar>

    <!-- Modal -->
    <Modal v-if="isModalOpen">
      <template v-slot:content>
        <h2>Delete?</h2>
        <p>Are you sure that you want to delete VLAN "{{ selectedVnetName }}"?</p>
      </template>

      <template v-slot:footer>
        <cButton class="btn btn-danger" @click="deleteNetwork" :disabled="loading" label="Yes" />
        <cButton class="btn btn-light" @click="closeModal" :disabled="loading" label="No" />
      </template>
    </Modal>

    <Modal v-if="isModalSubnetOpen">
      <template v-slot:content>
        <h2>Are you sure that you want to delete:</h2>
        <p>Subnet "{{ subnet_name }}" under VNET "{{ vnet_name }}"?</p>
      </template>

      <template v-slot:footer>
        <cButton class="btn btn-danger" @click="deleteSubnet" :disabled="loading" label="Yes" />
        <cButton class="btn btn-light" @click="closeModalSubnet" :disabled="loading" label="No" />
      </template>
    </Modal>
  </div>
</template>

<script>
import { NETWORK_HEADERS, SUB_NETWORK_HEADERS } from '../config/table'
import { VNET_BUTTONS } from '../config/buttons'
import { vNetService } from '../services/api/vnet';

import UniversalTable from '../components/UniversalTable'
import cButton from '../components/common/Button'
import SideBar from '../components/Sidebar'
import GroupButtons from '../components/common/GroupButtons'
import Modal from '../components/common/Modal'
import Alert from '../components/common/Alert'
import AddSubnet from '../components/forms/AddSubnet'

const PRODUCT_NAME = 'Network';
const LIST_NETWORK = 'create-network';
const BLANK_CLUSTER = '_';

export default {
  name: 'ListNetwork',
  components: {
    UniversalTable,
    cButton,
    SideBar,
    GroupButtons,
    Modal,
    Alert,
    AddSubnet
  },
  // layout: 'home',
  data() {
    return {
      selectedName:            '', // Dropdown for network name
      selectedVnetName:        '',
      selectedSubnetName:      '',
      selectedVnetSubnets:     '10.55.0.0',
      networks:                [], // This will be populated with data from the API
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
      network:                 [],
      filters:                 { name: { value: '', keys: ['name'] } },
      currentPage:             1,
      totalPages:              0,
      networkHeader: [],
      subnetworkHeader: [],
      vnetButtons: [],
    };
  },
  methods: {
    actionHandler (action) {
      if (action === 'create') {
        this.routeCreateNetwork();
      } else if (action === 'refresh') {
        this.fetchNetworks();
      }
    },
    async getSubnetByName (networkName) {
      const subnetRes = await vNetService.getSubnetByName(networkName);

      this.selectedNetwork.subnets = subnetRes.data.spec.subnets.map(subnet => ({
        address:    subnet.address,
        name:       subnet.name,
        prefix_len: subnet.prefixLength
      }));

      this.fetchNetworks();
    },
    async subnetAddedHandler() {
      await this.getSubnetByName(this.selectedNetwork.name);
      this.subnetResponse = 'success';
      this.subnetResponseMessage = 'Successfully added subnet!';
      this.addSubnetSidebarVisible = false;
    },
    addSubnetSidebar() {
      this.selectedSubnetName = null;
      this.addSubnetSidebarVisible = true;
    },
    closeSubnetSidebar() {
      this.addSubnetSidebarVisible = false;
    },
    openSidebar(item) {
      // Update the item with the fetched data
      this.subnetResponse = null;
      this.selectedNetwork = item;
      this.sidebarVisible = true;
    },
    closeSidebar() {
      this.selectedNetwork = null;
      this.sidebarVisible = false;
    },
    // Method to route to the Create Network page
    routeCreateNetwork() {
      this.$router.push(`/${ PRODUCT_NAME }/c/${ BLANK_CLUSTER }/${ LIST_NETWORK }`); // Assuming '/create-network' is the route for the Create Network page
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
        const response = await vNetService.getNetworks();

        // Parse the "name" and "subnets" under the "spec" section
        const parsedData = response.data.items.map(item => {
          const subnets = item.spec.subnets.map(subnet => ({
            address:    subnet.address,
            name:       subnet.name,
            prefix_len: subnet.prefixLength
          }));

          return {
            name:    item.spec.name,
            subnets,
            subnetLength: subnets.length,
            cluster: 'local'
          }
        });

        this.networks = parsedData;
      } catch (error) {
        console.error('Error fetching Network List:', error);
      }
    },
    async deleteNetwork() {
      try {
        console.log(`Delete Network Endpoint, ${ this.selectedVnetName }`);
        this.loading = true;
        const response = await vNetService.deleteNetwork(this.selectedVnetName);
        this.loading = false;

        this.apiResponse = 'error';
        // Set the API response data in the component
        this.apiResponseMessage = `You have successfully deleted VNET: ${this.selectedVnetName}`;
        this.apiError = null; // Reset error state

        await this.fetchNetworks();
        // Close the modal after deletion
        this.closeModal();
      } catch (error) {
        // Handle any errors here
        console.error('Error deleting network:', error);
        this.loading = false;
        this.apiResponseMessage = 'Error';
        // Set the API error in the component
        this.apiError = error.response ? error.response.data : error.message;
        this.apiResponse = 1; // Reset response state
      }
    },

    async deleteSubnet() {
      try {
        console.log(
          `Delete Subnet Endpoint, ${ this.vnet_name }, ${ this.subnet_name }, ${ this.subnet_id }`
        );
        this.selectedNetwork.subnets = this.selectedNetwork.subnets.filter(subnet => subnet.name !== this.subnet_name);
        console.log('new subnet', this.selectedNetwork.subnet);

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

        this.loading = true;
        const response = await vNetService.patchSubnet(this.vnet_name, vnet_data);
        console.log('Network deleted:', response.data);
        this.loading = false;

        this.subnetResponse = 'error';
        this.subnetResponseMessage = `Successfully deleted subnet: ${this.subnet_name}`;

        await this.getSubnetByName(this.vnet_name);

        // Update the selectedNetwork with the selected vnet_name
        this.selectedNetwork.vnet_name = this.vnet_name;
        console.log('Selected Network:', this.selectedNetwork);
        // Close the modal after deletion
        this.closeModalSubnet();
      } catch (error) {
        // Handle any errors here
        console.error('Error deleting network:', error);
        this.loading = false;
        // Set the API error in the component
        this.subnetResponseMessage = error.response ? error.response.data : error.message;
        this.subnetResponse = 'error';
      }
      
    },
  },
  created() {
    this.networkHeader = NETWORK_HEADERS;
    this.subnetworkHeader = SUB_NETWORK_HEADERS;
    this.vnetButtons = VNET_BUTTONS;
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
