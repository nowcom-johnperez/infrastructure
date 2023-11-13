<template>
  <div>
    <h1>Create Network</h1>
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
      <button @click="createNetwork" class="custom-button">Create Network</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import https from 'https';
import { LOCAL_URL, NETWORK_URL, NETWORKS } from '../config/api.ts';

const INSTANCE = axios.create({
  baseURL: LOCAL_URL,
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
    };
  },
  methods: {
    createNetwork() {
      // Capture the user inputs and construct the data object
      const data = {
        name: this.selectedName,
        vlan: this.selectedVlan,
        prefix_len: this.selectedPrefixLen,
        network_address: this.selectedNetworkAddress,
        gateway: this.selectedGateway,
      };

      // Make an Axios POST request to create the network
      axios.post('your_api_endpoint', data)
        .then(response => {
          // Handle the response here
          console.log('Network created:', response.data);
        })
        .catch(error => {
          // Handle any errors here
          console.error('Error creating network:', error);
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
        this.selectedVlan = '';
        this.selectedPrefixLen = '';
        this.selectedNetworkAddress = '';
        this.selectedGateway = '';
      }
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
  </style>
  