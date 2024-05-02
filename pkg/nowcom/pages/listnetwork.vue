<!-- eslint-disable no-console -->
<template>
  <div class="base">
    <h1>Virtual Network</h1>
    <!-- Notification container -->
    <div class="message-row">
      <div class="message-column"></div>
      <div class="message-column">
        <!-- Display API response data -->
        <div v-if="apiResponse">
          <h2 align="center">
            {{ apiResponseMessage }}
          </h2>
          <pre v-if="!apiError" align="center">Deleted VNET: {{ apiResponse.spec.name }}</pre>
          <pre v-if="apiError" align="center">{{ apiError.error }} : {{ selectedName }}</pre>
        </div>
      </div>
    </div>
    <GroupButtons :list="vnetButtons" @action="actionHandler"/>
    <div class="form-row">
      <div class="form-column">
        <UniversalTable v-if="networkHeader" :headers="networkHeader" :items="networks" :filters="filters" @item-click="openSidebar" @action-click="openModal" />
        </br> </br>
      </div>
    </div>

    <SideBar type="main" :sidebar-visible="sidebarVisible">
      <h2>{{ selectedNetwork ? selectedNetwork.name : 'No Network Selected' }}</h2>
        <div class="form-row">
          <div class="form-column" align="left">
            <cButton label="+ Add Subnet" @click="addSubnetSidebar" />
          </div>
        </div>
        <UniversalTable v-if="selectedNetwork" :headers="subnetworkHeader" :items="selectedNetwork.subnets" @action-click="openModalSubnet" />
        </br>
        <div v-if="subnetResponse">
          <h2 align="center">
            {{ subnetResponseMessage }}
          </h2>
          <pre v-if="!apiError" align="center">SUBNET: {{ subnet_name }}</pre>
          <pre v-if="apiError" align="center">{{ apiError.error }} : {{ selectedName }}</pre>
        </div>
        <cButton label="×" class="close-button" @click="closeSidebar" />
    </SideBar>

    <SideBar type="sub" :sidebar-visible="addSubnetSidebarVisible">
      <h2>Add Subnet</h2>
      <!-- ... your content for adding subnet -->
      <div class="add-form-row">
        <input v-model="selectedSubnetName" type="text" placeholder="Subnet Name" title="Subnet Name" />
      </div>
      <div class="add-form-row">
        <input
          v-model="selectedVnetSubnets"
          type="text"
          placeholder="Enter subnet (e.g., 10.0.0.0)"
          pattern="\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}"
          title="Please enter a valid IP address"
        />
      </div>
      <div class="add-form-row">
        <cButton label="+ Add Subnet" class="row-button" :disabled="isAddSubnetDisabled" @click="addSubnet"/>
      </div>
      <cButton label="×" class="close-button" @click="closeSubnetSidebar" />
    </SideBar>

    <!-- Modal -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal">
        <!-- Modal content -->
        <div>
          <h2>Delete?</h2>
          <p>Are you sure that you want to delete VLAN "{{ selectedVnetName }}"?</p>
        </div>

        <!-- Buttons container with flex layout -->
        <div class="button-container">
          <!-- Yes button on the left -->
          <button class="delete-button" @click="deleteNetwork">
            Yes
          </button>

          <!-- No button on the right -->
          <button class="ok-button" @click="closeModal">
            No
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalSubnetOpen" class="modal-overlay">
      <div class="modal">
        <!-- Modal content -->
        <div>
          <h2>Are you sure that you want to delete:</h2>
          <p>Subnet "{{ subnet_name }}" under VNET "{{ vnet_name }}"?</p>
        </div>

        <!-- Buttons container with flex layout -->
        <div class="button-container">
          <!-- Yes button on the left -->
          <button class="delete-button" @click="deleteSubnet">
            Yes
          </button>

          <!-- No button on the right -->
          <button class="ok-button" @click="closeModalSubnet">
            No
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NETWORK_HEADERS, SUB_NETWORK_HEADERS } from '../config/table'
import { VNET_BUTTONS } from '../config/buttons'
import { vNetService } from '../services/api/vnet';

const PRODUCT_NAME = 'Network';
const LIST_NETWORK = 'create-network';
const BLANK_CLUSTER = '_';
import UniversalTable from '../components/UniversalTable'
import cButton from '../components/common/Button'
import SideBar from '../components/Sidebar'
import GroupButtons from '../components/common/GroupButtons'

export default {
  name: 'ListNetwork',
  components: {
    UniversalTable,
    cButton,
    SideBar,
    GroupButtons
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
  computed: {
    isAddSubnetDisabled() {
      // Check conditions to disable the button
      return !this.selectedSubnetName || !this.selectedVnetSubnets;
    },
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
      this.selectedNetwork.subnets = subnetRes.data.spec.subnets;
    },
    async addSubnet() {
      try {
        this.apiError = null; // Reset error state
        // v0.2
        const subnet_data = {
          name:       this.selectedSubnetName.toLowerCase(),
          address:    this.selectedVnetSubnets,
          prefix_len: 24
        };

        this.selectedNetwork.subnets.push(subnet_data);

        const vnet_data = {
          apiVersion: 'packetlifter.dev/v1',
          kind:       'Vnet',
          // vnet_vlan: this.selectedVnetVlan,
          metadata:   {
            name:      this.selectedNetwork.name.toLowerCase(),
            namespace: 'default'
          },
          spec: {
            name:    this.selectedNetwork.name.toLowerCase(),
            subnets: this.selectedNetwork.subnets,
          }
        };

        console.log('send to API', subnet_data);
        console.log('log', this.selectedNetwork);

        this.loading = true

        const response = await vNetService.patchSubnet(this.selectedNetwork.name, vnet_data);
        console.log('Subnet Network created:', response.data);
        
        await this.getSubnetByName(this.selectedNetwork.name);
        this.subnetResponseMessage = 'Subnet Added Successfully';

        this.addSubnetSidebarVisible = false;
      } catch(error) {
        // Handle any errors here
        // console.error("Error creating network:", error);
        console.log(error.response);
        this.loading = false;
        alert(error.response.data.detail);
        this.subnetResponseMessage = 'Error';
        // Set the API error in the component
        this.apiError = 'Error creating Subnet';
      }
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
      this.subnetResponse = false;
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
      this.subnetResponse = false;
      // Open the modal
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },

    openModalSubnet(subnetRow) {
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
            prefix_len: subnet.prefix_len
          }));

          return {
            name:    item.spec.name,
            subnets,
            subnetLength: subnets.length
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
        // Handle the response here
        console.log('VNET deleted:', response.data);
        this.loading = false;

        this.apiResponse = response.data;
        // Set the API response data in the component
        this.apiResponseMessage = 'VNET Successfully Deleted';
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
        // var vnet_subnet = `${this.vnet_name}-${this.subnet_name}-${this.subnet_address}-${this.subnet_prefix_len}`
        // Make an Axios DELETE request to delete the network with the selected VLAN name
        const response = await vNetService.patchSubnet(this.vnet_name, vnet_data);
        console.log('Network deleted:', response.data);
        this.loading = false;

        this.subnetResponse = response.data;
        // Set the API response data in the component
        this.subnetResponseMessage = 'Subnet Successfully Deleted';
        this.apiError = null; // Reset error state

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
        this.subnetResponseMessage = 'Error';
        // Set the API error in the component
        this.apiError = error.response ? error.response.data : error.message;
        this.subnetResponse = 1; // Reset response state
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
.base {
  margin-left: 10px;
}

.form-container {
  text-align: center;
}

.form-row {
  display: grid;
  grid-gap: 10px;
  padding: 10px 0;
  /* Add top and bottom padding */
}

.form-column {
  flex: 1;
}

.message-row {
  display: grid;
  grid-template-columns: repeat(3a, 1fr);
  grid-gap: 10px;
  padding: 10px 0;
  /* Add top and bottom padding */
  margin-left: 10px;
}

.message-column {
  flex: 1;
}

.input-container {
  margin: 10px 0;
  /* Add padding at the top and bottom for input/select */
}

.list-delete-button {
  background-color: #ff001e;
  color: #fff;
  border: none;
  padding: 0 2px;
  /* Adjust top and bottom padding */
  border-radius: 2px;
  cursor: pointer;
  font-size: 10px;
}

/* Add margin to the top and bottom of the list */
li {
  margin: 5px 0;
  /* Adjust top and bottom margin */
}

.ok-button {
  background-color: #3b7498;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.custom-button:hover {
  background-color: #0056b3;
}

.disable-hover:hover {
  background-color: #007bff;
  /* Change this to the non-hover background color */
  cursor: not-allowed;
}

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

/* Your CSS styles go here */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #4e94b0;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  /* Add margin for spacing */
}
</style>
