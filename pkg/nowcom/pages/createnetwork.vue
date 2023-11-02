<template>
  <div>
    <h1>Create Network</h1>
    <div class="form-container">
      <div class="form-row">
        <div class="form-column">
          <input type="text" v-model="networkName" placeholder="Enter network name" />
        </div>
        <div class="form-column">
          <select v-model="selectedVlan">
            <option value="">Select VLAN</option>
            <option v-for="vlan in vlanList" :value="vlan.id">{{ vlan.name }}</option>
          </select>
        </div>
        <div class="form-column">
          <select v-model="selectedSubnet">
            <option value="">Select Subnet</option>
            <option v-for="network in networks" :value="network.subnet">{{ network.subnet }}</option>
          </select>
        </div>
        <div class="form-column">
          <!-- Display the Gateway within an input field as read-only -->
          <input type="text" :value="getGatewayForSubnet(selectedSubnet)" readonly disabled placeholder="Gateway"/>
        </div>
      </div>
      <button @click="createNetwork" class="custom-button">Create Network</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import https from 'https';
import { BASE_URL, VLAN_LIST_URL, NETWORK_URL, NETWORKS } from '../config/api.ts';

const INSTANCE = axios.create({
  baseURL: NETWORK_URL,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Bypass certificate validation
});

export default {
  name: 'CreateNetwork',
  data() {
    return {
      networkName: '',
      selectedVlan: '',
      selectedSubnet: '',
      vlanList: [], // This will be populated with data from the API
      networks: [],
    };
  },
  methods: {
    createNetwork() {
      // Make an Axios POST request to send the network name, selected VLAN, and selected Subnet to the server
      const data = {
        name: this.networkName,
        vlan_id: this.selectedVlan,
        subnet: this.selectedSubnet,
        gateway: this.getGatewayForSubnet(this.selectedSubnet), // Include the Gateway in the POST request
      };

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
    fetchVlanList() {
      // Fetch the VLAN list from your API
      axios.get(BASE_URL + VLAN_LIST_URL)
        .then(response => {
          this.vlanList = response.data;
        })
        .catch(error => {
          console.error('Error fetching VLAN list:', error);
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
      const network = this.networks.find(net => net.subnet === subnet);
      return network ? network.gateway : '';
    },
  },
  mounted() {
    // Fetch the VLAN list when the component is mounted
    this.fetchVlanList();
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
   grid-template-columns: repeat(4, 1fr); /* Creates four equal columns */
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
  