<template>
  <div class="base">
    <Loading :loading="isLoading" />
    <div>
      <h1>Create VNET Network</h1>
      <!-- <p>This is page is for the creation of VNET</p> -->
      <br />
      <Tabs :list="tabList" :current="currentTab" @set-active="changeTab" />
      <div class="tab-content-container mt-10">
        <div class="tab-content" :class="{ 'show': currentTab === 0 }">
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
          <Modal v-if="creatingNewNetwork">
            <template v-slot:content>
              <h2>Create New Network</h2>
              <input v-model="newNetworkName" value="Vrf-" placeholder="Enter new network name" @input="handleNewNetworkInput" />
            </template>

            <template v-slot:footer>
              <cButton class="btn btn-primary" @click="deleteNetwork" label="Save" />
              <cButton class="btn btn-light" @click="closeModal" label="Cancel" />
            </template>
          </Modal>
        </div>

        <div class="tab-content" :class="{ 'show': currentTab === 1 }">
          <!-- <h5 align="left">Subnet</h5>   -->
          <p>
            Configure your virtual network address space with the IPv4 and IPv6 addresses and subnets you need.
          </p>
          <p class="mt-5">
            Define the address space of your virtual network with one or more IPv4 or IPv6 address ranges.
            Create subnets to segment the virtual network address space into smaller ranges for use by your
            applications.
            When you deploy resources into a subnet, Nowcom assigns the resource an IP address from the subnet.
          </p>
          <div class="mt-20">
            <div v-for="(subnet, index) in selectedVnetSubnets" :key="`subnet_${index}`" class="row mt-10" style="justify-content: space-between; gap: 5px; align-items: center;">
              <div>
                <input v-model="selectedSubnetName[index]" type="text" placeholder="Subnet Name"
                title="Please enter a valid IP address" @input="handleSubnetInput(index)" />
              </div>
              <div>
                <input v-model="selectedVnetSubnets[index]" type="text" placeholder="Enter subnet (e.g., 10.0.0.0)"
                  pattern="\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}" title="Please enter a valid IP address"
                  @input="handleSubnetInput(index)" />
              </div>
              <div class="subnet-suffix">
                <p>/24</p>
              </div>
              <div class="form-column" align="left">
                <cButton v-if="index > 0" class="btn-icon" @click="removeSubnet(index)">
                  <i class="fa fa-trash fa-lg text-danger"></i>
                </cButton>
              </div>
            </div>
          </div>
          <div class="form-row ml-5">
            <div class="form-column" align="left">
              <cButton class="btn btn-success" @click="addSubnet">
                <i class="fa fa-plus mr-5"></i>
                Add Subnet
              </cButton>
            </div>
          </div>
        </div>

        <div class="tab-content" :class="{ 'show': currentTab === 2 }">
          <div>
            <input v-model="newTag" placeholder="Type and press Enter to add tags" @keydown.enter.prevent="addTag" />
          </div>
          <Tag v-for="(tag, index) in tags" :key="index" :show-delete="true" @delete="removeTag(index)" class="mt-10">{{tag}}</Tag>
        </div>

        <div class="tab-content" :class="{ 'show': currentTab === 3 }">
          <h2>Basics</h2>
          <p :style="{ color: selectedVnetName ? '' : 'red' }">
            Name : {{ selectedVnetName || 'empty' }}
          </p>

          <br /><br /><br />
          <h2>Tag</h2>
          <div class="mt-10">
            <Tag v-for="(tag, index) in tags" :key="index">{{tag}}</Tag>
          </div>

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
    <div class="footer">
      <div class="form-column-bottom">
        <button class="btn btn-light mr-10" :disabled="currentTab === 0" @click="previousTab">Previous</button>
        <button class="btn btn-light" :disabled="currentTab === 3" @click="nextTab">Next</button>
        <!-- Conditionally render the button based on the current tab -->
        <button class="btn btn-primary ml-10"
          :disabled="isLoading || (currentTab === 3 && (!selectedVnetName || hasInvalidIPAddress || hasDuplicateIPAddress))"
          @click="currentTab === 3 ? createNetwork : currentTab = 3">
          {{ currentTab === 3 ? 'Create' : 'Review + Create' }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import Tabs from '../components/common/Tabs'
import Tag from '../components/common/Tag'
import Loading from '../components/common/Loading'
import cButton from '../components/common/Button'
import Modal from '../components/common/Modal'
import { vNetService } from '../services/api/vnet';

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
      currentTab: 0, // Initial tab
      tabList: ['Basics', 'IP Address', 'Tags', 'Review + Create'],
      newTag: "",
      tags: [],
      hasInvalidIPAddress: false,
    };
  },
  components: {
    Tabs,
    Loading,
    cButton,
    Modal,
    Tag
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
      // Hide the spinner after 2 seconds
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
    changeTab(tabIndex) {
      this.currentTab = tabIndex;
    },
    previousTab() {
      if (this.currentTab < this.tabList.length && this.currentTab > 0) {
        this.currentTab--;
      }
    },
    nextTab() {
      if (this.currentTab >= 0 && this.currentTab !== this.tabList.length - 1) {
        this.currentTab++;
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
    async createNetwork() {
      // loading
      try {
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

        const response = await vNetService.createNetwork(vnet_data);
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
      } catch (error) {
        console.error("Error creating network:", error);
        this.isLoading = false;
        this.apiResponseMessage = "Error";
        // Set the API error in the component
        this.apiError = "Error creating VRF";
        this.apiResponse = 1; // Reset response state
      }
    },

    async fetchNetworks() {
      const response = await vNetService.getNetworks();
      const parsedData = response.data.items.map(item => ({
        name: item.spec.name,
        subnets: item.spec.subnets.map(subnet => ({
          address: subnet.address,
          name: subnet.name,
          prefix_len: subnet.prefix_len
        }))
      }));

      this.networks = parsedData;
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

/* Style for tab content */
h2 {
  color: #007bff;
}
/* Add this style to position the buttons at the bottom */
.footer {
  position: fixed;
  bottom: 30px;
  border-top: 2px solid #9c9393;
  width: 80%;
  padding: 20px 0;
}

.form-column-bottom {
  display: flex;
  justify-content: start;
}

.invalid-ip {
  color: red;
}

.invalid-message {
  color: blue;
}
</style>