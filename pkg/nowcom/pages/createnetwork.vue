<template>
  <div class="base">
    <h1>Create VNET Network</h1>
    <!-- <p>This is page is for the creation of VNET</p> -->
    <br />
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
              but brings with it additional benefits of Nowcom's infrastructure such as scale, availability, and
              isolation.
            </p>
            <br />
            <h5 align="left">VNET Name</h5>
            <!-- Updated select input with "Create New VNET" option -->
            <!-- <select v-model="selectedVnetName" @change="handleSelectChange">
                      <option value="">Select Network Name</option>
                      <option v-for="network in networks" :value="network.vnet_name">{{ network.vnet_name }}</option>
                      <option value="Create VNET">Create New VNET</option>
                  </select> -->
            <!-- <h5 align="left">VNET Name</h5> -->
            <input type="text" v-model="selectedVnetName" placeholder="vnet" required />

            <!-- New input field that appears when "Create New VNET" is selected -->
            <!-- Modal for creating a new network -->
            <div v-if="creatingNewNetwork" class="modal-overlay">
              <div class="modal">
                <!-- Modal content -->
                <div>
                  <h2>Create New Network</h2>
                  <input v-model="newNetworkName" value="Vrf-" placeholder="Enter new network name"
                    @input="handleNewNetworkInput" />
                </div>
                <!-- Buttons container with flex layout -->
                <div class="button-container">
                  <!-- Save button -->
                  <button class="custom-button" @click="saveNewNetwork">Save</button>
                  <!-- Cancel button -->
                  <button class="custom-button" @click="cancelNewNetwork">Cancel</button>
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
            <p>
              Configure your virtual network address space with the IPv4 and IPv6 addresses and subnets you need.
              <br /> <br />
              Define the address space of your virtual network with one or more IPv4 or IPv6 address ranges.
              Create subnets to segment the virtual network address space into smaller ranges for use by your
              applications.
              When you deploy resources into a subnet, Nowcom assigns the resource an IP address from the subnet.
            </p>
            <br />
            <div v-for="(subnet, index) in selectedVnetSubnets" :key="index" class="form-row-3">
              <input v-model="selectedSubnetName[index]" type="text" placeholder="Subnet Name"
                title="Please enter a valid IP address" @input="handleSubnetInput(index)" />
              <div>
                <input v-model="selectedVnetSubnets[index]" type="text" placeholder="Enter subnet (e.g., 10.0.0.0)"
                  pattern="\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}" title="Please enter a valid IP address"
                  @input="handleSubnetInput(index)" />
              </div>
              <div class="subnet-suffix">
                <p>/24</p>
              </div>
              <div class="form-column" align="left">
                <button v-if="index > 0" class="row-button" @click="removeSubnet(index)">Remove
                </button>
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
              <div>
                <input v-model="newTag" placeholder="Type and press Enter to add tags" @keydown.enter.prevent="addTag" />
              </div>
              <div>
                <span v-for="(tag, index) in tags" :key="index" class="tag">
                  {{ tag }}
                  <button @click="removeTag(index)">X</button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-container">
        <div class="form-row-2">
          <div class="form-column">
            <div v-if="currentTab === 'tab4'">
              <h2>Basics</h2>
              <p :style="{ color: selectedVnetName ? '' : 'red' }">
                Name : {{ selectedVnetName || 'empty' }}
              </p>

              <br /><br /><br />
              <h2>Tag</h2>
              <span v-for="(tag, index) in tags" :key="index" class="tag">
                {{ tag }}
              </span>

              <br /><br /><br />
              <h2>Subnet</h2>
              <p v-for="(name, index) in selectedSubnetName" :key="index">
                {{ name }} -
                <span :class="{ 'invalid-ip': !isValidIPAddress(selectedVnetSubnets[index]) }">
                  {{ selectedVnetSubnets[index] || 'empty' }}
                  <span v-if="!isValidIPAddress(selectedVnetSubnets[index])" class="invalid-message"> (Invalid IP
                    Address)</span>
                  <span v-if="isDuplicateIPAddress(index)" class="invalid-message"> (Duplicate IP Address)</span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <br />
      <!-- Loading indicator -->
      <div v-if="isLoading" class="spinner-modal">
        <div class="spinner-content">
          <!-- You can use an image or any other content for the spinner -->
          <img src="../assets/img/loading.png" alt="Loading Spinner" class="spinner-image" />
        </div>
      </div>
      <br /> <br /> <br />
      <div class="form-row">
        <div class="form-column">
          <!-- Display API response data -->
          <div v-if="apiResponse">
            <h2 align="center">
              {{ apiResponseMessage }}
            </h2>
            <pre v-if="!apiError" align="center"> Created VNET: {{ apiResponse.metadata.name }}</pre>
            <pre v-if="apiError" align="center">{{ apiError.error }} : {{ selectedVnetName }}</pre>
          </div>
        </div>
      </div>
      <!-- Dynamic rows for subnets -->
      <div class="form-row-bottom">
        <div class="form-column-bottom">
          <button class="custom-button" :disabled="currentTab === 'tab1'" @click="previousTab">Previous</button>
          <button class="custom-button" :disabled="currentTab === 'tab4'" @click="nextTab">Next</button>
          <!-- Conditionally render the button based on the current tab -->
          <button v-if="currentTab === 'tab4'" class="custom-button"
            :disabled="isLoading || !selectedVnetName || hasInvalidIPAddress || hasDuplicateIPAddress"
            @click="createNetwork">
            {{ currentTab === 'tab4' ? 'Create' : 'Review + Create' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import https from "https";
import axios from "axios";
import {
  NETWORK_URL_V2,
  BEARERTOKEN
} from "../config/api.ts";

const INSTANCE_V2 = axios.create({
  baseURL: NETWORK_URL_V2,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Bypass certificate validation
  headers: {
    'Authorization': `Bearer ${BEARERTOKEN}`
  }
});

const PRODUCT_NAME = "Network";
const LIST_NETWORK = "VNET";
const BLANK_CLUSTER = "_";

export default {
  name: "CreateNetwork",
  // layout: 'home',
  data() {
    return {
      selectedVnetName: "", // Dropdown for network name
      selectedVnetSubnets: ["10.55.0.0"], // Network Address (disabled and readonly)
      selectedSubnetName: ["default"],
      networks: [], // This will be populated with data from the API
      isLoading: false,
      apiResponse: null, // New data property to store the API response
      apiResponseMessage: null, // New data property to store the API response
      apiError: null,
      newNetworkName: "", // New data property for the new network name
      creatingNewNetwork: false, // New data property to track if creating a new network
      apiResponseUpdate: "", //response for update
      currentTab: "tab1", // Initial tab
      newTag: "",
      tags: [],
      hasInvalidIPAddress: false,
    };
  },
  computed: {
    isValidIPAddress() {
      return (ip) => {
        const ipRegex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
        return ipRegex.test(ip);
      };
    },
    hasDuplicateIPAddress() {
      const uniqueIPAddresses = new Set(this.selectedVnetSubnets);
      return this.selectedVnetSubnets.length !== uniqueIPAddresses.size;
    },
  },
  watch: {
    selectedVnetSubnets: {
      handler(newVal) {
        // Check for invalid IP addresses when the selectedVnetSubnets array changes
        this.hasInvalidIPAddress = newVal.some(ip => !this.isValidIPAddress(ip));
      },
      deep: true,
    },
  },
  methods: {
    isDuplicateIPAddress(index) {
      const currentIPAddress = this.selectedVnetSubnets[index];
      return this.selectedVnetSubnets.indexOf(currentIPAddress) !== index;
    },
    addTag() {
      const trimmedTag = this.newTag.trim();
      if (trimmedTag) {
        this.tags.push(trimmedTag);
        this.newTag = ""; // Clear the input field after adding a tag
      }
    },
    removeTag(index) {
      this.tags.splice(index, 1);
    },
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
      this.$router.push(`/${PRODUCT_NAME}/c/${BLANK_CLUSTER}/${LIST_NETWORK}`); // Assuming '/create-network' is the route for the Create Network page
    },
    changeTab(tabName) {
      this.currentTab = tabName;
    },
    previousTab() {
      switch (this.currentTab) {
        case "tab2":
          this.currentTab = "tab1";
          break;
        case "tab3":
          this.currentTab = "tab2";
          break;
        case "tab4":
          this.currentTab = "tab3";
          break;
        // Add more cases for additional tabs if needed
      }
    },
    nextTab() {
      switch (this.currentTab) {
        case "tab1":
          this.currentTab = "tab2";
          break;
        case "tab2":
          this.currentTab = "tab3";
          break;
        case "tab3":
          this.currentTab = "tab4";
          break;
        // Add more cases for additional tabs if needed
      }
    },
    handleSelectChange() {
      const network = this.networks.find(
        (net) => net.vnet_name === this.selectedVnetName
      );
      if (this.selectedVnetName === "Create VNET") {
        this.creatingNewNetwork = true; // Show the new network input field
        this.newNetworkName = ""; // Clear any previous input
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
      console.log("Saving new network:", this.newNetworkName);

      // Update the selectedName to the new network
      this.selectedVnetName = this.newNetworkName;

      // Fetch and populate other fields based on the new network
      this.populateFields(this.selectedVnetName);

      // Close the modal after saving
      this.cancelNewNetwork();
    },

    cancelNewNetwork() {
      // Reset the newNetworkName and close the modal
      this.newNetworkName = "";
      this.creatingNewNetwork = false;
    },

    handleSubnetInput(index) {
      console.log("HandleSubnetInput", index)
      // Handle input in the specified subnet field
      // You can access the subnet value using this.selectedVnetSubnets[index]
    },

    addSubnet() {
      // Add a new empty subnet field
      this.$set(
        this.selectedVnetSubnets,
        this.selectedVnetSubnets.length,
        "10.55.0.0"
      );
      this.$set(
        this.selectedSubnetName,
        this.selectedSubnetName.length,
        ""
      );
    },

    removeSubnet(index) {
      // Remove the subnet at the specified index
      this.selectedVnetSubnets.splice(index, 1);
      this.selectedSubnetName.splice(index, 1);
    },

    combineArraysIntoObjects(subnets, subnetNames) {
      // Check if both arrays have the same length
      if (subnets.length !== subnetNames.length) {
        console.error("Arrays must have the same length");
        return [];
      }

      // Use map to combine the arrays into an array of objects
      const combinedArray = subnets.map((subnet, index) => {
        return {
          address: subnet,
          name: subnetNames[index],
          prefix_len: 24
        };
      });

      return combinedArray;
    },
    createNetwork() {
      // loading
      this.isLoading = true;
      const combinedObjects = this.combineArraysIntoObjects(
        this.selectedVnetSubnets,
        this.selectedSubnetName
      );

      const vnet_data = {
        apiVersion: "packetlifter.dev/v1",
        kind: "Vnet",
        // vnet_vlan: this.selectedVnetVlan,
        metadata: {
          name: this.selectedVnetName.toLowerCase(),
          namespace: "default"
        },
        spec: {
          name: this.selectedVnetName.toLowerCase(),
          subnets: combinedObjects,
        }
      };
      // const vnet_data_string = JSON.stringify(vnet_data);
      console.log("send to API", vnet_data);

      INSTANCE_V2.post(`/apis/packetlifter.dev/v1/namespaces/default/vnets`, vnet_data)
        .then((response) => {
          // Handle the response here
          console.log("Network created:", response.data);
          this.isLoading = false;
          // Set the API response data in the component
          this.apiResponse = response.data;
          console.log("response from create networks", this.apiResponse);

          this.apiResponseMessage = "VNET Successfully Added";

          this.apiError = null; // Reset error state
          this.fetchNetworks();

          setTimeout(() => {
            this.routeListNetwork();
          }, 2000);
        })
        .catch((error) => {
          // Handle any errors here
          console.error("Error creating network:", error);
          this.isLoading = false;
          this.apiResponseMessage = "Error";
          // Set the API error in the component
          this.apiError = "Error creating VRF";
          this.apiResponse = 1; // Reset response state
        });
    },

    fetchNetworks() {
      // Fetch the network list from your API
      INSTANCE_V2.get(`/apis/packetlifter.dev/v1/vnets`)
        .then((response) => {
          this.networks = response.data;

          // Parse the "name" and "subnets" under the "spec" section
          const parsedData = response.data.items.map(item => ({
            name: item.spec.name,
            subnets: item.spec.subnets.map(subnet => ({
              address: subnet.address,
              name: subnet.name,
              prefix_len: subnet.prefix_len
            }))
          }));

          this.networks = parsedData;

          console.log("from API", parsedData);
        })
        .catch((error) => {
          console.error("Error fetching Network List:", error);
        });
    },

    getGatewayForSubnet(subnet) {
      // Find the network with the selected subnet and return its gateway
      const network = this.networks.find(
        (net) => net.network_address === subnet
      );
      return network ? network.gateway : "";
    },

    populateFields(selectedVnetName) {
      this.apiResponse = "";
      // Find the selected network by name and populate other fields
      const network = this.networks.find(
        (net) => net.vnet_name === selectedVnetName
      );
      if (network) {
        this.selectedVnetName = network.vnet_name;
        //this.selectedVnetVlan = network.vnet_vlan;
        this.selectedVnetSubnets = ["10.55.0.0"];
      } else {
        // Reset other fields if the network is not found
        this.selectedVnetName = selectedVnetName;
        //this.selectedVnetVlan = 'Vlan';
        this.selectedVnetSubnets = ["10.55.0.0"];
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
.base {
  margin-left: 10px;
}

.form-container {
  text-align: left;
}

.form-row-3 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
  padding: 10px 0;
  /* Add top and bottom padding */
}

.form-row-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
  padding: 10px 0;
  /* Add top and bottom padding */
}

.form-column {
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
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  margin-left: 5px;
  width: 100px;
  /* display: grid; */
  justify-content: center;
  align-items: center;
  /* Add this line for vertical alignment if needed */
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
  background-color: #cccccc;
  /* Grey */
  color: #666666;
  /* Dark grey */
  cursor: not-allowed;
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
  margin-top: 10px;
}

th,
td {
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
  z-index: 100;
  /* Add a higher z-index value */
}

.modal {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  z-index: 101;
  /* Make sure it has a higher z-index than the overlay */
}

/* Add your styling here */
.tab-buttons {
  display: flex;
  /*margin: 0 16px; /* Add margin to the buttons */
}

.tab-buttons button {
  padding: 5px 16px;
  /* Adjust padding for smaller buttons */
  border: none;
  background-color: #3b7498;
  cursor: pointer;
  margin-right: 8px;
  /* Add margin between buttons */
  border-radius: 4px;
  /* Add rounded corners */
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
  background: rgba(0, 0, 0, 0.5);
  /* Semi-transparent black background for the modal effect */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  /* Make sure the spinner is on top of other elements */
}

.spinner-content {
  text-align: center;
}

.spinner-image {
  width: 100px;
  /* Adjust the size of your spinner image */
  height: 100px;
  animation: spin 2s linear infinite;
  /* Rotate the image indefinitely 
        /* You can add more styles to customize the appearance of your spinner image */
  border-radius: 50%;
  /* Make the image round */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.tag {
  display: inline-block;
  margin: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.tag button {
  margin-left: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: red;
}

/* Add this style to position the buttons at the bottom */
.form-row-bottom {
  position: fixed;
  bottom: 50px;
  margin-left: 10%;
  transform: translateX(-50%);
}

.form-column-bottom {
  display: flex;
  justify-content: space-between;
}

.subnet-suffix {
  display: inline-block;
  margin-left: 5px;
  /* Adjust margin as needed for spacing */
  margin-top: 10px;
}

.invalid-ip {
  color: red;
}

.invalid-message {
  color: blue;
}
</style>