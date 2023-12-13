<template>
  <div class="base">
    <h1>Network</h1>
    <!-- Notification container -->
    <div class="message-row">
        <div class="message-column"></div>
        <div class="message-column">
              <!-- Display API response data -->
              <div v-if="apiResponse">
                    <h2 align="center">{{ apiResponseMessage }}</h2>
                    <pre align="center" v-if="!apiError">Deleted VNET: {{ apiResponse.vnet_name }}</pre>
                    <pre align="center" v-if="apiError">{{ apiError.error }} : {{ selectedName  }}</pre>
              </div>
              <div v-else-if="deleteSubnetResponse">
                    <h2 align="center">{{ apiResponseMessage }}</h2>
                    <pre align="center" v-if="!apiError">Deleted SUBNET: {{ subnet_id }}</pre>
                    <pre align="center" v-if="apiError">{{ apiError.error }} : {{ selectedName  }}</pre>
              </div>
        </div>
    </div>    
    <div class="message-row">
        <div class="message-column">
          <button @click="routeCreateNetwork" class="custom-button" style="width: 70px; margin-right: 10px;">Create</button>  
          <button @click="refreshList" class="custom-button" style="width: 70px; margin-right: 10px;">Refresh</button>  
        </div>
    </div>
      <br>
      <div class="form-row">
        <div class="form-column">
        <table v-if="networks && networks.length">
          <thead>
            <tr>
              <th>VNET</th>
              <th>Subnet</th>
              <!-- <th>Network</th> -->
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in networks" :key="item.vnet_name">
              <td><a @click.prevent="openSidebar(item)">{{ item.vnet_name }}</a></td>
              <td>
                  <ul>
                    <li v-for="subnet in item.subnets">
                      {{ subnet.subnet_name }}
                    </li>
                  </ul>
              </td>
              <!-- <td>
                  <ul>
                    <li v-for="subnet in item.subnets">
                      {{ subnet.network_prefix }}
                   
                    </li>
                  </ul>
                </td> -->
              <td width="50">
             <button @click="openModal(item.vnet_name)" class="delete-button">Delete</button></td>
            </tr>
          </tbody>
        </table>
        <!-- <p v-else>No items available</p> -->
        <table  v-else>
          <thead>
            <tr>
              <th>VNET</th>
              <th>Subnet</th>
              <!-- <th>Network</th> -->
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="3" style="text-align: center;">No items available</td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>

      <div class="sidebar" :class="{ 'sidebar-visible': sidebarVisible }">
        <div class="sidebar-content">
          <h2>{{ selectedNetwork ? selectedNetwork.vnet_name : 'No Network Selected' }}</h2>
            <div class="form-row">
                  <div class="form-column" align="left">
                      <button @click.prevent="addSubnetModal" class="custom-button"> + Add Subnet</button>
                   </div>
            </div>
          <table>
            <thead>
              <tr>
                <th>Subnet Name</th>
                <th>Network Prefix</th>
                <th>Action</th>
              </tr>
            </thead>
            <!-- Table Body -->
            <tbody>
              <tr v-for="subnet in selectedNetwork ? selectedNetwork.subnets : []" :key="subnet.subnet_id">
                <!-- Subnet Name -->
                <td>{{ subnet ? subnet.subnet_name : 'No Subnet Name' }}</td>
                <!-- Network Prefix -->
                <td>{{ subnet ? subnet.network_prefix : 'No Network Prefix' }}</td>
                <!-- Action -->
                <td>
                  <button @click="openModalSubnet(selectedNetwork.vnet_name,subnet.subnet_id)" class="list-delete-button">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
          <button @click="closeSidebar" class="close-button">×</button>
        </div>
      </div>

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
          <button @click="deleteNetwork" class="delete-button">Yes</button>
          
          <!-- No button on the right -->
          <button @click="closeModal" class="ok-button">No</button>
        </div>
        </div>
      </div>


       <!-- Modal -->
       <div v-if="isModalSubnetOpen" class="modal-overlay">
        <div class="modal">
          <!-- Modal content -->
          <div>
            <h2>Are you sure that you want to delete:</h2>
            <p>Subnet "{{ subnet_id }}" under VNET "{{ vnet_name }}"?</p>
          </div>

          <!-- Buttons container with flex layout -->
        <div class="button-container">
          <!-- Yes button on the left -->
          <button @click="deleteSubnet" class="delete-button">Yes</button>
          
          <!-- No button on the right -->
          <button @click="closeModalSubnet" class="ok-button">No</button>
        </div>
        </div>
      </div>

  </div>
</template>

<script>
import axios from 'axios';
import https from 'https';
import { LOCAL_URL, ENDPOINT_NETWORKS,  NETWORK_URL, NETWORKS, NETWORK_ATTACHMENTS, HARVESTER_URL } from '../config/api.ts';


const INSTANCE = axios.create({
  //baseURL: LOCAL_URL,
  baseURL: NETWORK_URL,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Bypass certificate validation
});

const HARVESTER = axios.create({
  baseURL: HARVESTER_URL,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Bypass certificate validation
});

const PRODUCT_NAME = 'Network';
const LIST_NETWORK = 'create-network';
const BLANK_CLUSTER = '_';

export default {
  name: 'ListNetwork',
  // layout: 'home',
  data() {
    return {
      selectedName: '', // Dropdown for network name
      selectedVlan: '', // VLAN (disabled and readonly)
      selectedPrefixLen: '', // Prefix Length (disabled and readonly)
      selectedNetworkAddress: '', // Network Address (disabled and readonly)
      selectedGateway: '', // Gateway (disabled and readonly)
      selectedVnetName: '',
      networks: [], // This will be populated with data from the API
      harvesterNetworks: [],
      showNotification: false,
      notificationType: '', // 'success' or 'error'
      notificationMessage: '',
      loading: false,
      isModalOpen: false,
      apiResponse: null,
      deleteSubnetResponse: null,
      isModalSubnetOpen: false,
      vrf_name: '',
      subnet_name: '',
      subnet_id: '',
      selectedNetwork: null,
      sidebarVisible: false,
    };
  },
  methods: {
    addSubnetModal() {
    
    },
    async openSidebar(item) {
      // Update the item with the fetched data
      this.selectedNetwork = item;
      this.sidebarVisible = true;
    },
    closeSidebar() {
      this.selectedNetwork = null;
      this.sidebarVisible = false;
    },
    // Method to route to the Create Network page
    routeCreateNetwork() {
      this.$router.push(`/${ PRODUCT_NAME }/c/${BLANK_CLUSTER}/${ LIST_NETWORK }`); // Assuming '/create-network' is the route for the Create Network page
    },
    openModal(vlanName) {
      // Set the selected VLAN name
      this.selectedVnetName = vlanName;
      // Open the modal
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },

    openModalSubnet(vrf_name,subnet_id) {
      // Set the selected VLAN name
      console.log(vrf_name, subnet_id)
      this.vnet_name = vrf_name;
      this.subnet_id = subnet_id;

      // Open the modal
      this.isModalSubnetOpen = true;
    },

    closeModalSubnet() {
      this.isModalSubnetOpen = false;
    },

    fetchHarvesterNetworks() {
      // Fetch the network list from your API
      INSTANCE.get(ENDPOINT_NETWORKS)
        .then(response => {
          this.harvesterNetworks = response.data.data || []; // Ensure items is an array;
          console.log(this.harvesterNetworks);
        })
        .catch(error => {
          console.error('Error fetching Network List:', error);
        });
    },
    fetchNetworks() {
      // Fetch the network list from your API
      INSTANCE.get(NETWORKS)
        .then(response => {
          this.networks = response.data;
          console.log("from API",this.networks);
        })
        .catch(error => {
          console.error('Error fetching Network List:', error);
        });
    },
    deleteNetwork() {
      console.log(`Delete Network Endpoint, ${this.selectedVnetName}`)
      // Make an Axios DELETE request to delete the network with the selected VLAN name
      INSTANCE.delete(`${ENDPOINT_NETWORKS}/vnet/${this.selectedVnetName}`)
        .then(response => {
          // Handle the response here
          console.log('Network deleted:', response.data);
          this.loading = false;

          this.apiResponse = response.data;
          // Set the API response data in the component
          this.apiResponseMessage = "VNET Successfully Deleted";
          this.apiError = null; // Reset error state
          //this.fetchHarvesterNetworks();
          this.fetchNetworks();
          
          // Close the modal after deletion
          this.closeModal();
        })
        .catch(error => {
          // Handle any errors here
          console.error('Error deleting network:', error);
          this.loading = false;
          this.apiResponseMessage = "Error";
          // Set the API error in the component
          this.apiError = error.response ? error.response.data : error.message;
          this.apiResponse = 1; // Reset response state
        });
    },

    deleteSubnet() {
      console.log(`Delete Subnet Endpoint, ${this.vnet_name}, ${this.subnet_id}`)
      // Make an Axios DELETE request to delete the network with the selected VLAN name
      INSTANCE.delete(`${ENDPOINT_NETWORKS}/vnet/${this.vnet_name}/subnet/${this.subnet_id}`)
        .then(async response => {
          // Handle the response here
          console.log('Network deleted:', response.data);
          this.loading = false;

          this.deleteSubnetResponse = response.data;
          // Set the API response data in the component
          this.apiResponseMessage = "Subnet Successfully Deleted";
          this.apiError = null; // Reset error state
          //this.fetchHarvesterNetworks();
          await this.fetchNetworks();

          const foundItem = this.networks.find(dataItem => dataItem.vnet_name === this.vnet_name);

          console.log(foundItem)
          if (foundItem) {
              // Remove the subnet object with the specified subnet_id
              foundItem.subnets = foundItem.subnets.filter(subnet => subnet.subnet_id !== this.subnet_id);

              // Update the selectedNetwork with the modified found item
              this.selectedNetwork = foundItem;
              console.log('Selected Network:', this.selectedNetwork);
          } else {
              // Handle the case where the item is not found in the updated data
              console.error('Item not found in the updated data.');
          }
        
          // Close the modal after deletion
          this.closeModalSubnet();
        })
        .catch(error => {
          // Handle any errors here
          console.error('Error deleting network:', error);
          this.loading = false;
          this.apiResponseMessage = "Error";
          // Set the API error in the component
          this.apiError = error.response ? error.response.data : error.message;
          this.deleteSubnetResponse = 1; // Reset response state
        });
    },
    refreshList(){
      this.fetchNetworks();
    }


  },
  mounted() {
    // Fetch the VLAN list and network list when the component is mounted
    this.fetchNetworks();
    //this.fetchHarvesterNetworks();
  },
};
</script>
  
  <style scoped>
  .base{
      margin-left: 10px;
  }

 .form-container {
  text-align: center;
    }

  .form-row {
      display: grid;
      grid-gap: 10px;
      padding: 10px 0; /* Add top and bottom padding */
  }

 .form-column {
   flex: 1;
 }

 .message-row {
      display: grid;
      grid-template-columns: repeat(3a, 1fr);
      grid-gap: 10px;
      padding: 10px 0; /* Add top and bottom padding */
      margin-left: 10px;
  }

  .message-column {
   flex: 1;
 }
  
  .input-container {
    margin: 10px 0; /* Add padding at the top and bottom for input/select */
  }
  
  .custom-button {
    background-color: #3b7498;
    color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
    justify-content: center;
    align-items: center; /* Add this line for vertical alignment if needed */
  }

  .delete-button {
    background-color: #ff001e;
    color: #fff;
    border: none;
    padding: 10px 20px; /* Adjust padding */
    border-radius: 5px;
    cursor: pointer;
    margin-right: 10px; /* Add margin for spacing */
  }

  .list-delete-button {
    background-color: #266d0a;
    color: #fff;
    border: none;
    padding: 0 2px; /* Adjust top and bottom padding */
    border-radius: 2px;
    cursor: pointer;
    font-size: 10px;
  }

  /* Add margin to the top and bottom of the list */
  li {
    margin: 5px 0; /* Adjust top and bottom margin */
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
    background-color: #007bff; /* Change this to the non-hover background color */
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

  .success {
    background-color: #4caf50; /* Green */
  }

  .error {
    background-color: #f44336; /* Red */
  }

  /* Your CSS styles go here */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 25px;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #3b7498;
  }

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
    background: #281784;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  .button-container {
    display: flex;
    justify-content: space-between;
    margin-top: 20px; /* Add margin for spacing */
  }
  .sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 0;
    height: 100%;
    background-color: #736f6f; /* Set a default background color */
    overflow-x: hidden;
    transition: 0.5s; /* Adjust the duration of the animation */
  }

  .sidebar-content {
    padding: 20px;
    margin-top: 60px;
  }

  .sidebar-visible {
    width: 65%; /* Adjust the width of the sidebar */
  }

  .close-button {
    position: absolute;
    top: 60px;
    right: 10px;
    border: none;
    font-size: 12px;
    cursor: pointer;
    color: #f90c0c; /* Set a default color */
  }

  .dark-theme .sidebar {
    background-color: #333; /* Dark theme background color */
    color: #fff; /* Dark theme text color */
  }
  </style>
  