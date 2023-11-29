<template>
  <div>
    <h1>VM Network</h1>
    <!-- Notification container -->
    <div class="message-row">
        <div class="message-column"></div>
        <div class="message-column">
              <!-- Display API response data -->
              <div v-if="apiResponse">
                    <h2 align="center">{{ apiResponseMessage }}</h2>
                    <pre align="center" v-if="!apiError">Deleted VLAN: {{ apiResponse.metadata.name }}</pre>
                    <pre align="center" v-if="apiError">{{ apiError.error }} : {{ selectedName  }}</pre>
              </div>
        </div>
    </div>    

    <button @click="routeCreateNetwork" class="custom-button" style="width: 70px;">Create</button>
      <br>
      <div class="form-row">
        <div class="form-column">
        <table v-if="harvesterNetworks && harvesterNetworks.length">
          <thead>
            <tr>
              <th>Name</th>
              <th>State</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in harvesterNetworks" :key="item.metadata.name">
              <td>{{ item.metadata.name }}</td>
              <td>{{ item.metadata.state?.name }}</td>
              <td width="50"><!-- Pass the item.metadata.name to openModal method -->
             <button @click="openModal(item.metadata.name)" class="delete-button">Delete</button></td>
            </tr>
          </tbody>
        </table>
        <p v-else>No items available</p>
        </div>
      </div>

       <!-- Modal -->
      <div v-if="isModalOpen" class="modal-overlay">
        <div class="modal">
          <!-- Modal content -->
          <div>
            <h2>Delete?</h2>
            <p>Are you sure that you want to delete VLAN "{{ selectedVlanName }}"?</p>
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

  </div>
</template>

<script>
import axios from 'axios';
import https from 'https';
import { LOCAL_URL, ENDPOINT_NETWORKS,  NETWORK_URL, NETWORKS, NETWORK_ATTACHMENTS, HARVESTER_URL, TOKEN } from '../config/api.ts';

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

const PRODUCT_NAME = 'NOWCOM';
const LIST_NETWORK = 'create-network';
const BLANK_CLUSTER = '_';

export default {
  name: 'ListNetwork',
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
      isModalOpen: false,
      apiResponse: null
    };
  },
  methods: {
    // Method to route to the Create Network page
    routeCreateNetwork() {
      this.$router.push(`/${ PRODUCT_NAME }/c/${BLANK_CLUSTER}/${ LIST_NETWORK }`); // Assuming '/create-network' is the route for the Create Network page
    },
    openModal(vlanName) {
      // Set the selected VLAN name
      this.selectedVlanName = vlanName;
      // Open the modal
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
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
    deleteNetwork() {
    console.log(`Delete Network Endpoint, ${this.selectedVlanName}`)
    // Make an Axios DELETE request to delete the network with the selected VLAN name
    INSTANCE.delete(`${ENDPOINT_NETWORKS}/${this.selectedVlanName}`)
      .then(response => {
        // Handle the response here
        console.log('Network deleted:', response.data);
        this.loading = false;

        this.apiResponse = response.data;
        // Set the API response data in the component
        this.apiResponseMessage = "VLAN Successfully Deleted";
        this.apiError = null; // Reset error state
        this.fetchHarvesterNetworks();
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
}


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
  }

  .message-column {
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

  .delete-button {
    background-color: #ff001e;
    color: #fff;
    border: none;
    padding: 10px 20px; /* Adjust padding */
    border-radius: 5px;
    cursor: pointer;
    margin-right: 10px; /* Add margin for spacing */
  }

  .ok-button {
    background-color: #007bff;
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
  </style>
  