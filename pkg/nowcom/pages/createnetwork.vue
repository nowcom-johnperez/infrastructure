<template>
    <div class="base">
      <h1>Create VNET Network</h1>
      <!-- <p>This is page is for the creation of VNET</p> -->
      </br>
      <!-- Tab buttons -->
      <div class="tab-buttons">
         <button @click="changeTab('tab1')" :class="{ 'active': currentTab === 'tab1' }">Basics</button>
         <button @click="changeTab('tab2')" :class="{ 'active': currentTab === 'tab2' }">IP Addresses</button>
         <button @click="changeTab('tab3')" :class="{ 'active': currentTab === 'tab3' }">Tags</button>
         <button @click="changeTab('tab4')" :class="{ 'active': currentTab === 'tab4' }">Review + Create</button>
      </div>

    
      <div class="form-container">
        <div class="form-row-2">
            <div class="form-column">
               <!-- Tab content -->
               <div v-if="currentTab === 'tab1'">
                    <p>
                      Nowcom Virtual Network (VNet) is the fundamental building block for your private network in Nowcom Cloud. 
                      VNet enables many types of Nowcom resources, such as Nowcom Virtual Machines (VM), 
                      to securely communicate with each other, the internet, and on-premises networks. 
                      VNet is similar to a traditional network that you'd operate in your own data center, 
                      but brings with it additional benefits of Nowcom's infrastructure such as scale, availability, and isolation.
                    </p>
                  </br>  
                  <h5 align="left">VNET Name</h5>
                  <!-- Updated select input with "Create New VNET" option -->
                  <!-- <select v-model="selectedVnetName" @change="handleSelectChange">
                      <option value="">Select Network Name</option>
                      <option v-for="network in networks" :value="network.vnet_name">{{ network.vnet_name }}</option>
                      <option value="Create VNET">Create New VNET</option>
                  </select> -->
                  <!-- <h5 align="left">VNET Name</h5> -->
                  <input type="text" v-model="selectedVnetName" placeholder="vnet" required/>

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
            </div>
          <div class="form-container">
            <div class="form-row-2">
                <div v-if="currentTab === 'tab2'">
                      <!-- <h5 align="left">Subnet</h5>   -->
                      <p>Configure your virtual network address space with the IPv4 and IPv6 addresses and subnets you need. </br></br>
                          Define the address space of your virtual network with one or more IPv4 or IPv6 address ranges. 
                          Create subnets to segment the virtual network address space into smaller ranges for use by your applications. 
                          When you deploy resources into a subnet, Nowcom assigns the resource an IP address from the subnet.</p></br>
                          <div v-for="(subnet, index) in selectedVnetSubnets" :key="index" class="form-row-3">
                            <input
                                type="text"
                                v-model="selectedSubnetName[index]"
                                @input="handleSubnetInput(index)"
                                placeholder="Subnet Name"
                                title="Please enter a valid IP address"
                              />
                            <div >
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
                    </div>

                </div>
              </div>    
          <div class="form-container">
            <div class="form-row-2">
              <div class="form-column">
                  <div v-if="currentTab === 'tab3'">
                    <h2>Tags</h2>
                    <p>Tags</p>
                  </div>   
              </div>       
            </div>
           </div>

           <div class="form-container">
            <div class="form-row-2">
              <div class="form-column">
                <div v-if="currentTab === 'tab4'">
                  <h2>Basics</h2>
                  <p :style="{ color: selectedVnetName ? '' : 'red' }">Name : {{ selectedVnetName || 'empty' }}</p>

                  </br>
                  <h2>Subnet</h2>
                  <p v-for="(name, index) in selectedSubnetName" :key="index">
                    Subnet:  {{ name }} - {{ selectedVnetSubnets[index] || 'empty' }}
                  </p>
                </div>
              </div>       
            </div>
           </div>

        
      </br>
        <!-- Dynamic rows for subnets -->
      
        <div class="form-row">
            <div class="form-column">
              <button @click="previousTab" class="custom-button" :disabled="currentTab === 'tab1'">Previous</button>
              <button @click="nextTab" class="custom-button" :disabled="currentTab === 'tab4'">Next</button>
              <!-- Conditionally render the button based on the current tab -->
              <button v-if="currentTab === 'tab4'" @click="createNetwork" class="custom-button" :disabled="loading || !selectedVnetName">
                {{ currentTab === 'tab4' ? 'Create' : 'Review + Create' }}
              </button>
            </div>
        </div>    
        <!-- Loading indicator -->
  
        <div v-if="isLoading" class="spinner-modal">
        <div class="spinner-content">
            <!-- You can use an image or any other content for the spinner -->
            <img src="../assets/img/loading.png" alt="Loading Spinner" class="spinner-image" />
          </div>
       </div>
        </br></br></br>
        <div class="form-row">
            <div class="form-column">
            <!-- Display API response data -->
                <div v-if="apiResponse">
                    <h2 align="center">{{ apiResponseMessage }}</h2>
                    <pre align="center" v-if="!apiError">Created VNET: {{ apiResponse.vnet.vnet_name }}</pre>
                    <pre align="center" v-if="apiError">{{ apiError.error }} : {{ selectedVnetName  }}</pre>
                </div>
                <!-- <div v-else-if="apiResponseUpdate">
                  <h2 align="center">{{ apiResponseMessage }}</h2>
                </div> -->
            </div>
          </div>  
    </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import https from 'https';
  import { LOCAL_URL, ENDPOINT_NETWORKS, LIST_NETWORKS,  NETWORK_URL, NETWORKS, NETWORK_ATTACHMENTS, HARVESTER_URL } from '../config/api.ts';
  
  
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
  const LIST_NETWORK = 'VNET';
  const BLANK_CLUSTER = '_';
  
  export default {
    name: 'CreateNetwork',
    // layout: 'home',
    data() {
      return {
        selectedVnetName: '', // Dropdown for network name
        selectedVnetSubnets: ['10.55.0.0'], // Network Address (disabled and readonly)
        selectedSubnetName: ['default'],
        selectedVnetGateway: '', // Gateway (disabled and readonly)
        networks: [], // This will be populated with data from the API
        harvesterNetworks: [],
        showNotification: false,
        notificationType: '', // 'success' or 'error'
        notificationMessage: '',
        isLoading: false,
        apiResponse: null, // New data property to store the API response
        apiResponseMessage: null, // New data property to store the API response
        apiError: null, 
        newNetworkName: '', // New data property for the new network name
        creatingNewNetwork: false, // New data property to track if creating a new network
        apiResponseUpdate: '', //response for update
        currentTab: 'tab1', // Initial tab
      };
    },
    methods: {
      showSpinner() {
        this.isLoading = true;
        // Hide the spinner after 5 seconds
        setTimeout(() => {
          this.hideSpinner();
        }, 2000);
      },
      hideSpinner() {
        this.isLoading = false;
      },
      routeListNetwork() {
        this.$router.push(`/${ PRODUCT_NAME }/c/${BLANK_CLUSTER}/${ LIST_NETWORK }`); // Assuming '/create-network' is the route for the Create Network page
      },
        changeTab(tabName) {
            this.currentTab = tabName;
        },
        previousTab() {
          switch (this.currentTab) {
            case 'tab2':
              this.currentTab = 'tab1';
              break;
            case 'tab3':
              this.currentTab = 'tab2';
              break;
            case 'tab4':
              this.currentTab = 'tab3';
              break;  
            // Add more cases for additional tabs if needed
          }
        },
        nextTab() {
          switch (this.currentTab) {
            case 'tab1':
              this.currentTab = 'tab2';
              break;
            case 'tab2':
              this.currentTab = 'tab3';
              break;
            case 'tab3':
              this.currentTab = 'tab4';
              break;
            // Add more cases for additional tabs if needed
          }
        },
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
          this.$set(this.selectedVnetSubnets, this.selectedVnetSubnets.length, '10.55.0.0');
          this.$set(this.selectedSubnetName, this.selectedSubnetName.length, 'default');
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
              network: subnet,
              subnet_name: subnetNames[index],
            };
          });

          return combinedArray;
        },
      async createNetwork() {
  
      //loading
      this.isLoading = true;  
    

            const combinedObjects = this.combineArraysIntoObjects(this.selectedVnetSubnets, this.selectedSubnetName);
            const vnet_data = {
                vnet_name: this.selectedVnetName.toLowerCase(),
                //vnet_vlan: this.selectedVnetVlan,
                subnets: combinedObjects
            }
            // const vnet_data_string = JSON.stringify(vnet_data);
            console.log("send to API",vnet_data)

            INSTANCE.post(NETWORKS, vnet_data)
            .then(response => {
                // Handle the response here
                console.log('Network created:', response.data);
                this.isLoading = false;
                // Set the API response data in the component
                this.apiResponse = response.data;
                console.log("response from create networks",this.apiResponse)

                this.apiResponseMessage = "VNET Successfully Added"

                this.apiError = null; // Reset error state
                this.fetchNetworks();

                setTimeout(() => {
                  this.routeListNetwork();
                }, 2000);
            })
            .catch(error => {
                // Handle any errors here
                console.error('Error creating network:', error);
                this.isLoading = false;
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
          this.selectedVnetSubnets = ['10.55.0.0'];
          this.selectedVnetGateway = network.vnet_gateway;
        } else {
          // Reset other fields if the network is not found
          this.selectedVnetName = selectedVnetName;
          //this.selectedVnetVlan = 'Vlan';
          this.selectedVnetSubnets = ['10.55.0.0'];
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
    .base{
      margin-left: 10px;
    }
   .form-container {
      text-align: left;
    }
  
    .form-row-3 {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 10px;
        padding: 10px 0; /* Add top and bottom padding */
    }
    .form-row-2 {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
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
      background-color: #3b7498;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 10px;
      margin-left: 5px;
      width: 100px;
      /* display: grid; */
      justify-content: center;
      align-items: center; /* Add this line for vertical alignment if needed */
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
    .custom-button:disabled {
      background-color: #cccccc; /* Grey */
      color: #666666; /* Dark grey */
      cursor: not-allowed;
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
      z-index: 100; /* Add a higher z-index value */
    }

    .modal {
      background-color: #fff;
      padding: 20px;
      border-radius: 5px;
      max-width: 400px;
      width: 100%;
      text-align: center;
      z-index: 101; /* Make sure it has a higher z-index than the overlay */
    }
    /* Add your styling here */
    .tab-buttons {
        display: flex;
        /*margin: 0 16px; /* Add margin to the buttons */
      }
      
      .tab-buttons button {
        padding: 5px 16px; /* Adjust padding for smaller buttons */
        border: none;
        background-color: #3b7498;
        cursor: pointer;
        margin-right: 8px; /* Add margin between buttons */
        border-radius: 4px; /* Add rounded corners */
      }
      
      .tab-buttons button.active {
        background-color: #cdd7e2;
        color: #3b7498;
      }
      /* Style for tab content */
      h2 {
        color: #007bff;
      }


      /* Your other styles */
      .spinner-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5); /* Semi-transparent black background for the modal effect */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000; /* Make sure the spinner is on top of other elements */
      }

      .spinner-content {
        text-align: center;
      }

      .spinner-image {
        width: 100px; /* Adjust the size of your spinner image */
        height: 100px;
        animation: spin 2s linear infinite; /* Rotate the image indefinitely 
        /* You can add more styles to customize the appearance of your spinner image */
        border-radius: 50%; /* Make the image round */

      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
    