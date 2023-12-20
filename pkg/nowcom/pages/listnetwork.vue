<template>
  <div class="base">
    <h1>VNET</h1>
    <!-- Notification container -->
    <div class="message-row">
      <div class="message-column"></div>
      <div class="message-column">
        <!-- Display API response data -->
        <div v-if="apiResponse">
          <h2 align="center">{{ apiResponseMessage }}</h2>
          <pre align="center" v-if="!apiError">Deleted VNET: {{ apiResponse.vnet_name }}</pre>
          <pre align="center" v-if="apiError">{{ apiError.error }} : {{ selectedName }}</pre>
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
              <th>Cluster</th>
              <th>Subnet</th>
              <!-- <th>Network</th> -->
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in networks" :key="item.id">
              <td><a @click.prevent="openSidebar(item)">{{ item.vnet_name }}</a></td>
              <td>
                <!-- <ul>
                    <li v-for="subnet in item.subnets">
                      {{ subnet.subnet_name }}
                    </li>
                  </ul> -->
                local
              </td>
              <td>
                Total Subnet :{{ item.subnets.length }}
              </td>
              <!-- <td>
                  <ul>
                    <li v-for="subnet in item.subnets">
                      {{ subnet.network_prefix }}
                   
                    </li>
                  </ul>
                </td> -->
              <td width="50">
                <button @click="openModal(item.id, item.vnet_name)" class="delete-button">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- <p v-else>No items available</p> -->
        <table v-else>
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
            <button @click.prevent="addSubnetSidebar" class="custom-button"> + Add Subnet</button>
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
            <tr v-for="subnet in selectedNetwork ? selectedNetwork.subnets : []" :key="subnet.id">
              <!-- Subnet Name -->
              <td>{{ subnet ? subnet.subnet_name : 'No Subnet Name' }}</td>
              <!-- Network Prefix -->
              <td>{{ subnet ? subnet.network_prefix : 'No Network Prefix' }}</td>
              <!-- Action -->
              <td>
                <button
                  @click="openModalSubnet(selectedNetwork.id, selectedNetwork.vnet_name, subnet.subnet_name, subnet.id)"
                  class="list-delete-button">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        </br>
        <div v-if="subnetResponse">
          <h2 align="center">{{ subnetResponseMessage }}</h2>
          <pre align="center" v-if="!apiError">SUBNET: {{ subnet_name }}</pre>
          <pre align="center" v-if="apiError">{{ apiError.error }} : {{ selectedName }}</pre>
        </div>
        <button @click="closeSidebar" class="close-button">×</button>
      </div>
    </div>

    <!-- Second sidebar -->
    <div class="add-subnet-sidebar" :class="{ 'add-subnet-sidebar-visible': addSubnetSidebarVisible }">
      <!-- Second sidebar content -->
      <div class="add-subnet-sidebar-content">
        <h2>Add Subnet</h2>
        <!-- ... your content for adding subnet -->
        <div class="add-form-row">
          <input type="text" v-model="selectedSubnetName" placeholder="Subnet Name" title="Subnet Name" />
        </div>
        <div class="add-form-row">
          <input type="text" v-model="selectedVnetSubnets" placeholder="Enter subnet (e.g., 10.0.0.0)"
            pattern="\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}" title="Please enter a valid IP address" />
        </div>
        <div class="add-form-row">
          <button @click="addSubnet" class="row-button"> + Add Subnet</button>
        </div>
      </div>
      <button @click="closeSubnetSidebar" class="close-subnet-button">×</button>
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
          <p>Subnet "{{ subnet_name }}" under VNET "{{ vnet_name }}"?</p>
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
import axios from "axios";
import https from "https";
import {
  ENDPOINT_NETWORKS,
  NETWORK_URL,
  NETWORKS,
  NETWORK_URL_V2,
} from "../config/api.ts";

const INSTANCE = axios.create({
  //baseURL: LOCAL_URL,
  baseURL: NETWORK_URL,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Bypass certificate validation
});

const INSTANCE_V2 = axios.create({
  baseURL: NETWORK_URL_V2,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Bypass certificate validation
});

const PRODUCT_NAME = "Network";
const LIST_NETWORK = "create-network";
const BLANK_CLUSTER = "_";

export default {
  name: "ListNetwork",
  // layout: 'home',
  data() {
    return {
      selectedName: "", // Dropdown for network name
      selectedVlan: "", // VLAN (disabled and readonly)
      selectedPrefixLen: "", // Prefix Length (disabled and readonly)
      selectedNetworkAddress: "", // Network Address (disabled and readonly)
      selectedGateway: "", // Gateway (disabled and readonly)
      selectedVnetName: "",
      selectedSubnetName: "",
      selectedVnetSubnets: "10.55.0.0",
      networks: [], // This will be populated with data from the API
      harvesterNetworks: [],
      showNotification: false,
      notificationType: "", // 'success' or 'error'
      notificationMessage: "",
      loading: false,
      isModalOpen: false,
      apiResponse: null,
      subnetResponse: null,
      isModalSubnetOpen: false,
      vnet_name: "",
      subnet_name: "",
      subnet_id: "",
      selectedNetwork: null,
      sidebarVisible: false,
      addSubnetSidebarVisible: false,
      apiError: null,
      apiResponseMessage: "",
      network: []
    };
  },
  methods: {
    addSubnet() {
      // const newSubnet = {
      //   network: this.selectedVnetSubnets,
      //   subnet_name: this.selectedSubnetName,
      // };

      // const vnet_data = {
      //   vnet_name: this.selectedNetwork.vnet_name.toLowerCase(),
      //   //vnet_vlan: this.selectedVnetVlan,
      //   subnets: [newSubnet],
      // };

      //v0.2

      const subnet_data = {
        subnet_name: this.selectedSubnetName.toLowerCase(),
        network: this.selectedVnetSubnets,
      };

      console.log(this.selectedNetwork)
      let vnet = this.selectedNetwork.id

      // const vnet_data_string = JSON.stringify(vnet_data);
      console.log("send to API", subnet_data);
      console.log("log", this.selectedNetwork);

      INSTANCE_V2.post(
        `/vnets/${vnet}/subnets/`,
        subnet_data
      ).then((response) => {
        // Handle the response here
        console.log("Subnet Network created:", response.data);
        this.isLoading = false;

        //use results from response
        let newSubnetFromResponse = response.data;
        this.subnet_name = response.data.subnet_name;
        this.fetchNetworks();
        this.selectedNetwork.subnets.push(newSubnetFromResponse);

        // Set the API response data in the component
        this.subnetResponse = response.data;
        this.apiError = null; // Reset error state
        this.subnetResponseMessage = "Subnet Added Successfully";

        this.addSubnetSidebarVisible = false;
      })
        .catch((error) => {
          // Handle any errors here
          console.error("Error creating network:", error);
          this.isLoading = false;
          this.subnetResponseMessage = "Error";
          // Set the API error in the component
          this.apiError = "Error creating Subnet";
          this.apiResponse = 1; // Reset response state
        });
    },
    addSubnetSidebar() {
      this.selectedSubnetName = null;
      this.addSubnetSidebarVisible = true;
    },
    closeSubnetSidebar() {
      this.addSubnetSidebarVisible = false;
    },
    async openSidebar(item) {
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
      this.$router.push(`/${PRODUCT_NAME}/c/${BLANK_CLUSTER}/${LIST_NETWORK}`); // Assuming '/create-network' is the route for the Create Network page
    },
    openModal(vnetId, vnetName) {
      // Set the selected VLAN name
      this.selectedVnetId = vnetId;
      this.selectedVnetName = vnetName;
      this.subnetResponse = false;
      // Open the modal
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },

    openModalSubnet(vnet_id, vnet_name, subnet_name, subnet_id) {
      // Set the selected VLAN name
      console.log(vnet_id, vnet_name, subnet_name, subnet_id);
      this.vnet_id = vnet_id;
      this.vnet_name = vnet_name;
      this.subnet_name = subnet_name;
      this.subnet_id = subnet_id;

      // Open the modal
      this.isModalSubnetOpen = true;
    },

    closeModalSubnet() {
      this.isModalSubnetOpen = false;
    },

    fetchNetworks() {
      console.log("fetching networks");
      // Fetch the network list from your API
      INSTANCE_V2.get(`/vnets/`)
        .then((response) => {
          this.networks = response.data;
          this.network = this.networks;
          console.log("from API", this.networks);
        })
        .catch((error) => {
          console.error("Error fetching Network List:", error);
        });

      return this.network;
    },
    deleteNetwork() {
      console.log(`Delete Network Endpoint, ${this.selectedVnetName},${this.selectedVnetId} `);
      // Make an Axios DELETE request to delete the network with the selected VLAN name
      INSTANCE_V2.delete(`/vnets/${this.selectedVnetId}`)
        .then((response) => {
          // Handle the response here
          console.log("Network deleted:", response.data);
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
        .catch((error) => {
          // Handle any errors here
          console.error("Error deleting network:", error);
          this.loading = false;
          this.apiResponseMessage = "Error";
          // Set the API error in the component
          this.apiError = error.response ? error.response.data : error.message;
          this.apiResponse = 1; // Reset response state
        });
    },

    async deleteSubnet() {
      console.log(
        `Delete Subnet Endpoint, ${this.vnet_id}, ${this.vnet_name}, ${this.subnet_name}, ${this.subnet_id}`
      );
      // Make an Axios DELETE request to delete the network with the selected VLAN name
      INSTANCE_V2.delete(
        `/subnets/${this.subnet_id}`
      )
        .then(async (response) => {
          // Handle the response here
          console.log("Network deleted:", response.data);
          this.loading = false;

          this.subnetResponse = response.data;
          // Set the API response data in the component
          this.subnetResponseMessage = "Subnet Successfully Deleted";
          this.apiError = null; // Reset error state

          //call of subnets
          INSTANCE_V2.get(
            `/subnets/${this.vnet_id}`
          ).then(async (response) => {
            this.selectedNetwork.subnets = response.data;
          }).catch((error) => {
            this.subnetResponseMessage = "Error";
          });
          // Update the selectedNetwork with the selected vnet_name
          this.selectedNetwork.vnet_name = this.vnet_name;
          console.log("Selected Network:", this.selectedNetwork);
          // Close the modal after deletion
          this.closeModalSubnet();
        })
        .catch((error) => {
          // Handle any errors here
          console.error("Error deleting network:", error);
          this.loading = false;
          this.subnetResponseMessage = "Error";
          // Set the API error in the component
          this.apiError = error.response ? error.response.data : error.message;
          this.subnetResponse = 1; // Reset response state
        });
    },

    refreshList() {
      this.fetchNetworks();
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

.custom-button {
  background-color: #3b7498;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
  /* Add this line for vertical alignment if needed */
}

.delete-button {
  background-color: #ff001e;
  color: #fff;
  border: none;
  padding: 0px 10px;
  /* Adjust padding */
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  /* Add margin for spacing */
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

.success {
  background-color: #4caf50;
  /* Green */
}

.error {
  background-color: #f44336;
  /* Red */
}

/* Your CSS styles go here */
table {
  width: 100%;
  border-collapse: collapse;
  /* margin-top: 10px; */
}

th,
td {
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
  margin-top: 20px;
  /* Add margin for spacing */
}

.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 0;
  height: 100%;
  background-color: #736f6f;
  /* Set a default background color */
  overflow-x: hidden;
  transition: 0.5s;
  /* Adjust the duration of the animation */
}

.sidebar-content {
  padding: 20px;
  margin-top: 60px;
}

.sidebar-visible {
  width: 65%;
  /* Adjust the width of the sidebar */
}

.close-button {
  position: absolute;
  top: 60px;
  right: 10px;
  border: none;
  font-size: 12px;
  cursor: pointer;
  color: #f90c0c;
  /* Set a default color */
}

/* .close-subnet-button {
    position: absolute;
    top: 50px;
    right: 50px;
    border: none;
    font-size: 12px;
    cursor: pointer;
    color: #25bbb4; 
  } /* Set a default color */

.dark-theme .sidebar {
  background-color: #333;
  /* Dark theme background color */
  color: #fff;
  /* Dark theme text color */
}

/* Styles for the second sidebar */
.add-subnet-sidebar {
  position: fixed;
  top: 0;
  right: -40%;
  /* Initially off-screen */
  width: 40%;
  height: 100%;
  background-color: #9c9393;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  transition: right 0.3s ease-out;
  z-index: 2;
}

/* Make the second sidebar visible */
.add-subnet-sidebar.add-subnet-sidebar-visible {
  right: 0;
}

/* Your existing styles for the second sidebar content */
.add-subnet-sidebar-content {
  /* ... */
  margin-top: 60px;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  padding: 20px 10px 10px 10px;
  /* Add top and bottom padding */
}

/* Your existing styles for the close button of the second sidebar */
.close-subnet-button {
  position: absolute;
  top: 60px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
  color: #25bbb4;
}

.row-button {
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: left;
}

.add-form-row {
  width: 300px;
  /* display: grid; */
  justify-content: center;
  align-items: center;
  /* Add this line for vertical alignment if needed */
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
  