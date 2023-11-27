<template>
  <div>
    <h1>Create Network</h1>

    <!-- Notification container -->
    <div v-if="showNotification" class="notification" :class="notificationType">
      <p>{{ notificationMessage }}</p>
    </div>

    <div class="form-container">
      <div class="form-row">
        <div class="form-column">
          <select v-model="selectedName" @change="populateFields(selectedName)">
            <option value="">Select Network Name</option>
            <option v-for="network in networks" :value="network.name">{{ network.name }}</option>
          </select>
        </div>
        <div class="form-column">
          <input type="text" v-model="selectedVlan" readonly disabled placeholder="vlan" />
        </div>
        <div class="form-column">
          <input type="text" v-model="selectedPrefixLen" readonly disabled placeholder="prefix_len" />
        </div>
        <div class="form-column">
          <input type="text" v-model="selectedNetworkAddress" readonly disabled placeholder="network address" />
        </div>
        <div class="form-column">
          <input type="text" v-model="selectedGateway" readonly disabled placeholder="gateway" />
        </div>
      </div>
      <button @click="createNetwork" class="custom-button" :disabled="loading" :class="{ 'disable-hover': loading }" >Create Network</button>

      <!-- Loading indicator -->
      <div v-if="loading" class="loading-indicator">Loading...</div>

    </div>
  </div>
</template>

<script>
import axios from 'axios';
import https from 'https';
import { LOCAL_URL, NETWORK_URL, NETWORKS, NETWORK_ATTACHMENTS, HARVESTER_URL, TOKEN } from '../config/api.ts';

// Import the notification library
import VueNotification from 'vue-notification';

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
      showNotification: false,
      notificationType: '', // 'success' or 'error'
      notificationMessage: '',
      loading: false
    };
  },
  methods: {
    async createNetwork() {

    //loading
    this.loading = true;  
    
    const HEADER = {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
      },
    }
      //NETWORK
      // Capture the user inputs and construct the data object
      // const data = {
      //   name: this.selectedName,
      //   vlan: this.selectedVlan,
      //   network_address: this.selectedNetworkAddress,
      // };

      // // Make an Axios POST request to create the network
      // INSTANCE.post('/network/vnets/', data) // Update the endpoint to '/network/vnets/'
      //   .then(response => {
      //     // Handle the response here
      //     console.log('Network created:', response.data);

      //     // Display a success notification
      //     console.log("notif show")
      //     this.showNotificationMessage('success', 'Network created successfully!');
      //   })
      //   .catch(error => {
      //     // Handle any errors here
      //     console.error('Error creating network:', error);

      //     // Display an error notification
      //     this.showNotificationMessage('error', 'Failed to create the network. Please try again.');
      //   });
      

      const harvester_data = {
        apiVersion: "k8s.cni.cncf.io/v1",
        kind: "NetworkAttachmentDefinition",
        metadata: {
          namespace: "default",
          name: this.selectedName,
        },
        spec: {
          config: `{"cniVersion":"0.3.1","name":"${this.selectedName}","type":"bridge","bridge":"data-network-br","promiscMode":true,"vlan":${this.selectedVlan},"ipam":{}}`,
        },
      };
      
      console.log(harvester_data)
      
      HARVESTER.post(NETWORK_ATTACHMENTS, harvester_data, HEADER)
        .then(response => {
          // Handle the response here
          console.log('Network created:', response.data);

          // Display a success notification
          console.log("notif show")
          this.loading = false;
          this.showNotificationMessage('success', 'Network created successfully!');
        })
        .catch(error => {
          // Handle any errors here
          console.error('Error creating network:', error);
          // this.loading = false;
          // Display an error notification
          this.showNotificationMessage('error', 'Failed to create the network. Please try again.');
        });

        //
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
        this.selectedVlan = '';
        this.selectedPrefixLen = '';
        this.selectedNetworkAddress = '';
        this.selectedGateway = '';
      }
    },
    showNotificationMessage(type, message) {
      // Display a notification message
      this.showNotification = true;
      this.notificationType = type;
      this.notificationMessage = message;

      // Hide the notification after a delay (e.g., 5 seconds)
      setTimeout(() => {
        this.hideNotification();
      }, 5000);
    },

    hideNotification() {
      // Hide the notification
      this.showNotification = false;
      this.notificationType = '';
      this.notificationMessage = '';
    },
  },
  mounted() {
    // Fetch the VLAN list and network list when the component is mounted
    this.fetchNetworks();
  },
};
</script>
  
  <style scoped>
 .form-container {
  text-align: center;
    }

 .form-row {
   display: grid;
   grid-template-columns: repeat(5, 1fr); /* Creates four equal columns */
   grid-gap: 10px; /* Adjust the gap between columns as needed */
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
  </style>
  