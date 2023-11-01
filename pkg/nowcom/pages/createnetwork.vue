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
            <!-- Add another input or element here -->
          </div>
          <div class="form-column">
            <!-- Add another input or element here -->
          </div>
        </div>
        <button @click="createNetwork" class="custom-button">Create Network</button>
      </div>
    </div>
  </template>
  <script>
  import axios from 'axios';
  import { BASE_URL, VLAN_LIST_URL } from '../api.ts';
  
  export default {
    name: 'CreateNetwork',
    data() {
      return {
        networkName: '',
        selectedVlan: '',
        vlanList: [], // This will be populated with data from the API
      };
    },
    methods: {
      createNetwork() {
        // Make an Axios POST request to send the network name and selected VLAN to the server
        const data = {
          name: this.networkName,
          vlanId: this.selectedVlan,
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
    },
    mounted() {
      // Fetch the VLAN list when the component is mounted
      this.fetchVlanList();
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
  