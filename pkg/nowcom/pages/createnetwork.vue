<template>
    <div>
      <h1>VM Network</h1>
  
      <div class="form-container">
        <div class="form-row">
            <div class="form-column">
            <!-- Updated select input with "Create New VNET" option -->
            <select v-model="selectedName" @change="handleSelectChange">
                <option value="">Select Network Name</option>
                <option v-for="network in networks" :value="network.name">{{ network.name }}</option>
                <option value="__createNew__">Create New VNET</option>
            </select>

                <!-- New input field that appears when "Create New VNET" is selected -->
                <!-- Modal for creating a new network -->
                <div v-if="creatingNewNetwork" class="modal-overlay">
                <div class="modal">
                    <!-- Modal content -->
                    <div>
                    <h2>Create New Network</h2>
                    <input v-model="newNetworkName" @input="handleNewNetworkInput" placeholder="Enter new network name" />
                    </div>
                    <!-- Buttons container with flex layout -->
                    <div class="button-container">
                    <!-- Save button -->
                    <button @click="saveNewNetwork" class="custom-button">Save</button>
                    <!-- Cancel button -->
                    <button @click="cancelNewNetwork" class="custom-button">Cancel</button>
                    </div>
                </div>
                </div>
            </div>
        </div>

        <div class="form-row">
          <div class="form-column">
            <input type="text" v-model="selectedVlan" readonly disabled placeholder="vlan" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-column">
            <input type="text" v-model="selectedPrefixLen" readonly disabled placeholder="prefix_len" />
          </div>
        </div>
        </div>
        <div class="form-row">
            <div class="form-column">
            <button @click="createNetwork" class="custom-button" :disabled="loading" :class="{ 'disable-hover': loading }" >Create Network</button>
            </div>
        </div>    
        <!-- Loading indicator -->
  
        <div v-if="loading" class="loading-indicator">Loading...</div>  
        </br></br></br>
        <div class="form-row">
            <div class="form-column">
            <!-- Display API response data -->
                <div v-if="apiResponse">
                    <h2 align="center">{{ apiResponseMessage }}</h2>
                    <pre align="center" v-if="!apiError">Created VLAN: {{ apiResponse.metadata.name }}</pre>
                    <pre align="center" v-if="apiError">{{ apiError.error }} : {{ selectedName  }}</pre>
                </div>
            </div>
        </div>    
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import https from 'https';
  import { LOCAL_URL, ENDPOINT_NETWORKS, LIST_NETWORKS,  NETWORK_URL, NETWORKS, NETWORK_ATTACHMENTS, HARVESTER_URL, TOKEN } from '../config/api.ts';
  
  
  const INSTANCE = axios.create({
    baseURL: LOCAL_URL,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Bypass certificate validation
  });
  
  const HARVESTER = axios.create({
    baseURL: HARVESTER_URL,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Bypass certificate validation
  });
  
  export default {
    name: 'CreateNetwork',
    data() {
      return {
        selectedName: '', // Dropdown for network name
        selectedVlan: '', // VLAN (disabled and readonly)
        selectedPrefixLen: '', // Prefix Length (disabled and readonly)
        selectedNetworkAddress: '', // Network Address (disabled and readonly)
        selectedGateway: '', // Gateway (disabled and readonly)
        networks: [], // This will be populated with data from the API
        harvesterNetworks: [],
        showNotification: false,
        notificationType: '', // 'success' or 'error'
        notificationMessage: '',
        loading: false,
        apiResponse: null, // New data property to store the API response
        apiResponseMessage: null, // New data property to store the API response
        apiError: null, 
        newNetworkName: '', // New data property for the new network name
        creatingNewNetwork: false, // New data property to track if creating a new network
      };
    },
    methods: {
        handleSelectChange() {
            const network = this.networks.find(net => net.name === this.selectedName);
            if (this.selectedName === '__createNew__') {
                this.creatingNewNetwork = true; // Show the new network input field
                this.newNetworkName = ''; // Clear any previous input
            } else {
                 // If a regular network is selected, you can call populateFields as usual
                this.populateFields(this.selectedName);
                this.creatingNewNetwork = false; // Hide the new network input field
            }
        }, 
        handleNewNetworkInput() {
            // Handle input in the new network name field
            // You can add additional validation or processing logic here
        },
        saveNewNetwork() {
            // Handle the logic to save the new network
            // You can add your API call or any other logic here
            console.log('Saving new network:', this.newNetworkName);
            
            // Update the selectedName to the new network
            this.selectedName = this.newNetworkName;

            // Fetch and populate other fields based on the new network
            this.populateFields(this.selectedName);


            // Close the modal after saving
            this.cancelNewNetwork();
        },

        cancelNewNetwork() {
            // Reset the newNetworkName and close the modal
            this.newNetworkName = '';
            this.creatingNewNetwork = false;
        },
      async createNetwork() {
  
      //loading
      this.loading = true;  
      
      const HEADER = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`,
        },
      }

  
       const harvester_data = {
          name: this.selectedName,
          vlanId: this.selectedVlan
        }  
        
        console.log(harvester_data)
        INSTANCE.post(ENDPOINT_NETWORKS, harvester_data)
          .then(response => {
            // Handle the response here
            console.log('Network created:', response.data);
            this.loading = false;
            // Set the API response data in the component
            this.apiResponse = JSON.parse(response.data.content);
            this.apiResponseMessage = response.data.message;

            console.log("response from create networks",this.apiResponse)
            this.apiError = null; // Reset error state
            this.fetchHarvesterNetworks();
          })
          .catch(error => {
            // Handle any errors here
            console.error('Error creating network:', error);
            this.loading = false;
            this.apiResponseMessage = "Error";
           // Set the API error in the component
            this.apiError = error.response ? error.response.data : error.message;
            this.apiResponse = 1; // Reset response state
          });
        
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
            console.log(this.networks);
          })
          .catch(error => {
            console.error('Error fetching Network List:', error);
          });
      },
      getGatewayForSubnet(subnet) {
        // Find the network with the selected subnet and return its gateway
        const network = this.networks.find(net => net.network_address === subnet);
        return network ? network.gateway : '';
      },
      populateFields(selectedName) {
        // Find the selected network by name and populate other fields
        const network = this.networks.find(net => net.name === selectedName);
        if (network) {
          this.selectedVlan = network.vlan;
          this.selectedPrefixLen = network.prefix_len;
          this.selectedNetworkAddress = network.network_address;
          this.selectedGateway = network.gateway;
        } else {
          // Reset other fields if the network is not found
          this.selectedVlan = selectedName;
          this.selectedPrefixLen = '';
          this.selectedNetworkAddress = '';
          this.selectedGateway = '';
        }
      },
    },
    mounted() {
      // Fetch the VLAN list and network list when the component is mounted
      this.fetchNetworks();
      this.fetchHarvesterNetworks();
    },
  };
  </script>
    
    <style scoped>
   .form-container {
    text-align: center;
      }
  
    .form-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 10px;
        padding: 10px 0; /* Add top and bottom padding */
    }
  
   .form-column {
     flex: 1;
   }
    
    .input-container {
      margin: 10px 0; /* Add padding at the top and bottom for input/select */
    }
    
    .custom-button {
      background-color: #007bff;
      color: #fff;
      border: none;
      padding: 5px 10px;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 10px;
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
      margin-top: 10px;
    }
  
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
  
    th {
      background-color: #007bff;
    }

    /* Modal styles */
    .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    }

    .modal {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    max-width: 400px;
    width: 100%;
    text-align: center;
    }
    </style>
    