<template>
    <div>
      <h1>VNET Network</h1>
      <p>This is page is for the creation of VNET</p>
    </br>
  
      <div class="form-container">
        <div class="form-row">
            <div class="form-column">
            <h5 align="left">VNET Name</h5>
            <!-- Updated select input with "Create New VNET" option -->
            <select v-model="selectedVnetName" @change="handleSelectChange">
                <option value="">Select Network Name</option>
                <option v-for="network in networks" :value="network.vnet_name">{{ network.vnet_name }}</option>
                <option value="Create VNET">Create New VNET</option>
            </select>
            
                <!-- New input field that appears when "Create New VNET" is selected -->
                <!-- Modal for creating a new network -->
                <div v-if="creatingNewNetwork" class="modal-overlay">
                <div class="modal">
                    <!-- Modal content -->
                    <div>
                    <h2>Create New Network</h2>
                    <input v-model="newNetworkName" @input="handleNewNetworkInput" value="Vrf-" placeholder="Enter new network name" />
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
            <!-- <h5 align="left">VNET Name</h5> -->
            <input type="text" v-model="selectedVnetName" readonly disabled placeholder="vnet" />
          </div>
        </div>
      </br>
        <!-- Dynamic rows for subnets -->
      <h5 align="left">Subnet</h5>  
      <div v-for="(subnet, index) in selectedVnetSubnets" :key="index" class="form-row">
        <input
            type="text"
            v-model="selectedSubnetName[index]"
            @input="handleSubnetInput(index)"
            placeholder="Subnet Name"
            title="Please enter a valid IP address"
          />
        <div class="form-column">
          <input
            type="text"
            v-model="selectedVnetSubnets[index]"
            @input="handleSubnetInput(index)"
            placeholder="Enter subnet (e.g., 10.0.0.0)"
            pattern="\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}"
            title="Please enter a valid IP address"
          />
        </div>
        <div class="form-column" align="left">
            <button @click="removeSubnet(index)" class="row-button">Remove</button>
          </div>
      </div>
      <div class="form-row">
        <div class="form-column" align="left">
          <button @click="addSubnet" class="row-button"> + Add Subnet</button>
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
                    <pre align="center" v-if="!apiError">Created VLAN: {{ apiResponse.vnet_name }}</pre>
                    <pre align="center" v-if="apiError">{{ apiError.error }} : {{ selectedVnetName  }}</pre>
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
    //baseURL: LOCAL_URL,
    baseURL: NETWORK_URL,
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
        selectedVnetName: '', // Dropdown for network name
        selectedVnetSubnets: ['10.55.0.0/24'], // Network Address (disabled and readonly)
        selectedSubnetName: ['subnet'],
        selectedVnetGateway: '', // Gateway (disabled and readonly)
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
            const network = this.networks.find(net => net.vnet_name === this.selectedVnetName);
            if (this.selectedVnetName === 'Create VNET') {
                this.creatingNewNetwork = true; // Show the new network input field
                this.newNetworkName = ''; // Clear any previous input
            } else {
                 // If a regular network is selected, you can call populateFields as usual
                this.populateFields(this.selectedVnetName);
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
            this.selectedVnetName = this.newNetworkName;

            // Fetch and populate other fields based on the new network
            this.populateFields(this.selectedVnetName);


            // Close the modal after saving
            this.cancelNewNetwork();
        },

        cancelNewNetwork() {
            // Reset the newNetworkName and close the modal
            this.newNetworkName = '';
            this.creatingNewNetwork = false;
        },
        handleSubnetInput() {
            // Handle input in the subnet field
            // You can add additional validation or processing logic here
        },
        handleSubnetInput(index) {
          // Handle input in the specified subnet field
          // You can access the subnet value using this.selectedVnetSubnets[index]
        },

        addSubnet() {
          // Add a new empty subnet field
          this.$set(this.selectedVnetSubnets, this.selectedVnetSubnets.length, '10.55.0.0/24');
          this.$set(this.selectedSubnetName, this.selectedSubnetName.length, 'subnet');
        },

        removeSubnet(index) {
          // Remove the subnet at the specified index
          this.selectedVnetSubnets.splice(index, 1);
          this.selectedSubnetName.splice(index, 1);
        },

        combineArraysIntoObjects(subnets, subnetNames) {
          // Check if both arrays have the same length
          if (subnets.length !== subnetNames.length) {
            console.error('Arrays must have the same length');
            return [];
          }

          // Use map to combine the arrays into an array of objects
          const combinedArray = subnets.map((subnet, index) => {
            return {
              vnet_subnet: subnet,
              subnet_name: subnetNames[index],
            };
          });

          return combinedArray;
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

            const combinedObjects = this.combineArraysIntoObjects(this.selectedVnetSubnets, this.selectedSubnetName);
            const vnet_data = {
                vnet_name: this.selectedVnetName.toLowerCase(),
                //vnet_vlan: this.selectedVnetVlan,
                vnet_subnet: combinedObjects
            }
            // const vnet_data_string = JSON.stringify(vnet_data);
            console.log("send to API",vnet_data)

            INSTANCE.post(NETWORKS, vnet_data)
            .then(response => {
                // Handle the response here
                console.log('Network created:', response.data);
                this.loading = false;
                // Set the API response data in the component
                this.apiResponse = response.data;
                this.apiResponseMessage = response.data.message;

                console.log("response from create networks",this.apiResponse)
                this.apiError = null; // Reset error state
                this.fetchNetworks();
            })
            .catch(error => {
                // Handle any errors here
                console.error('Error creating network:', error);
                this.loading = false;
                this.apiResponseMessage = "Error";
            // Set the API error in the component
                this.apiError = "Error creating VRF";
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
            console.log('from API', this.networks);
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
      populateFields(selectedVnetName) {
        this.apiResponse = '';
        // Find the selected network by name and populate other fields
        const network = this.networks.find(net => net.vnet_name === selectedVnetName);
        if (network) {
          this.selectedVnetName = network.vnet_name;
          //this.selectedVnetVlan = network.vnet_vlan;
          this.selectedVnetSubnets = [network.vnet_subnet];
          this.selectedVnetGateway = network.vnet_gateway;
        } else {
          // Reset other fields if the network is not found
          this.selectedVnetName = selectedVnetName;
          //this.selectedVnetVlan = 'Vlan';
          this.selectedVnetSubnets = ['10.55.0.0/24'];
          this.selectedVnetGateway = '';
        }
      },
    },
    mounted() {
      // Fetch the VLAN list and network list when the component is mounted
      this.fetchNetworks();
      //this.fetchHarvesterNetworks();
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

    .row-button {
      background-color: #4caf50;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      text-align: left;	
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
    