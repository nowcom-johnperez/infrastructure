<template>
  <div class="base create-base">
    <Loading :loading="isLoading" />
    <div class="create-content">
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
          <!-- Updated select input with "Create New VNET" option -->
          <!-- <select v-model="selectedVnetName" @change="handleSelectChange">
                    <option value="">Select Network Name</option>
                    <option v-for="network in networks" :value="network.vnet_name">{{ network.vnet_name }}</option>
                    <option value="Create VNET">Create New VNET</option>
                </select> -->
          <div class="input-container">
            <label for="vnet">VNet Name</label>
            <input type="text" class="mt-10" name="vnet" v-model="selectedVnetName" placeholder="e.g. vnet" required />
            <span class="info-icon">
              <i class="fa fa-info-circle" aria-hidden="true"></i>
            </span>
            <div class="tooltip">Nowcom Virtual Network (VNet) is the fundamental building block for your private network in Nowcom Cloud.
            VNet enables many types of Nowcom resources, such as Nowcom Virtual Machines (VM),
            to securely communicate with each other, the internet, and on-premises networks.
            VNet is similar to a traditional network that you'd operate in your own data center,
            but brings with it additional benefits of Nowcom's infrastructure such as scale, availability, and
            isolation.</div>
          </div>

          <div class="checkbox-content mt-20">
            <input type="checkbox" id="dhcp" v-model="dhcpEnabled" />
            <label for="dhcp">DHCP Enabled?</label>
          </div>
          
          <div class="checkbox-content mt-20">
            <input type="checkbox" id="dhcp" v-model="externalDNSenabled" />
            <label for="dhcp">External DNS</label>
          </div>

          <div class="mt-20">
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
                <cButton class="cbtn btn-light" @click="addSubnet">
                  <i class="fa fa-plus mr-5"></i>
                  Add Subnet
                </cButton>
              </div>
            </div>
          </div>

          <div class="input-container">
            <label for="tags">Tags</label>
            <input type="text" class="mt-10" name="tags" v-model="newTag" placeholder="Type and press Enter to add tags" @keydown.enter.prevent="addTag" />
            <span class="info-icon">
              <i class="fa fa-info-circle" aria-hidden="true"></i>
            </span>
            <div class="tooltip">Tooltip text</div>
          </div>
          <Tag v-for="(tag, index) in tags" :key="index" :show-delete="true" @delete="removeTag(index)" class="mt-10">{{tag}}</Tag>

          <!-- New input field that appears when "Create New VNET" is selected -->
          <!-- Modal for creating a new network -->
          <!-- <Modal v-if="creatingNewNetwork">
            <template v-slot:content>
              <h2>Create New Network</h2>
              <input v-model="newNetworkName" value="Vrf-" placeholder="Enter new network name" @input="handleNewNetworkInput" />
            </template>

            <template v-slot:footer>
              <cButton class="cbtn btn-primary" @click="deleteNetwork" label="Save" />
              <cButton class="cbtn btn-light" @click="closeModal" label="Cancel" />
            </template>
          </Modal> -->
        </div>

        <Modal size="lg" v-if="reviewModalState">
          <template #header>
            <h1 class="mb-0">Review</h1>
          </template>
          <template v-slot:content>
            
            <div>
              <h2>Configure</h2>
              <p>
                Virtual Network Name: &nbsp; <span class="text-bold" :style="{ color: selectedVnetName ? '' : 'red', 'font-size': '1.3rem' }">{{ selectedVnetName || 'empty' }}</span>
              </p>
              <p>
                DHCP Enabled: {{ dhcpEnabled }}
              </p>
              <p>
                External DNS: {{ externalDNSenabled }}
              </p>
            </div>
            
            <div class="mt-30">
              <h2>Tags</h2>
              <div class="mt-10">
                <template v-if="tags.length > 0">
                  <Tag v-for="(tag, index) in tags" :key="index">{{tag}}</Tag>
                </template>
                <p v-else>No Tags</p>
              </div>
            </div>

            <div class="mt-30">
              <h2>Subnet</h2>
              <Subnet v-for="(name, index) in selectedSubnetName" :key="index" :name="name" :current-address="selectedVnetSubnets[index] || 'empty'" :ip-list="selectedVnetSubnets" />
            </div>
          </template>

          <template v-slot:footer>
            <cButton class="cbtn btn-primary" @click="createNetwork" :disabled="!selectedVnetName || hasInvalidIPAddress || hasDuplicateIPAddress || isLoading" label="Create" />
            <cButton class="cbtn btn-light" @click="reviewModalState = false" label="Cancel" />
          </template>
        </Modal>
      </div>
    </div>
    <div class="footer">
      <div class="form-column-bottom">
        <!-- <button class="cbtn btn-light mr-10" :disabled="currentTab === 0" @click="previousTab">Previous</button>
        <button class="cbtn btn-light" :disabled="currentTab === 3" @click="nextTab">Next</button> -->
        <!-- Conditionally render the button based on the current tab -->
        <button class="cbtn btn-primary ml-10" @click="reviewModalState = true">
          Review
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import Tabs from '../components/common/Tabs'
import Subnet from '../components/Subnet'
import Tag from '../components/common/Tag'
import Loading from '../components/common/Loading'
import cButton from '../components/common/Button'
import Modal from '../components/common/Modal'
import { isValidIP, combineArraysIntoObjects } from '../services/helpers/utils'
import { PRODUCT_NAME, LIST_NETWORK, BLANK_CLUSTER } from '../config/constants'

export default {
  name: "CreateNetwork",
  // layout: 'home',
  data() {
    return {
      reviewModalState: false,
      selectedVnetName: "", // Dropdown for network name
      selectedVnetSubnets: ["10.55.0.0"], // Network Address (disabled and readonly)
      selectedSubnetName: ["default"],
      isLoading: false,
      apiResponse: null, // New data property to store the API response
      apiResponseMessage: null, // New data property to store the API response
      apiError: null,
      newNetworkName: "", // New data property for the new network name
      creatingNewNetwork: false, // New data property to track if creating a new network
      apiResponseUpdate: "", //response for update
      currentTab: 0, // Initial tab
      tabList: ['Configure'],
      newTag: "",
      tags: [],
      dhcpEnabled: false,
      externalDNSenabled: false,
      externalDNSsource: ''
    };
  },
  components: {
    Tabs,
    Loading,
    cButton,
    Modal,
    Tag,
    Subnet
  },
  computed: {
    hasDuplicateIPAddress() {
      const uniqueIPAddresses = new Set(this.selectedVnetSubnets);
      return this.selectedVnetSubnets.length !== uniqueIPAddresses.size;
    },
    hasInvalidIPAddress() {
      return this.selectedVnetSubnets.some(ip => !isValidIP(ip));
    }
  },
  methods: {
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
        this.isLoading = false;
      }, 2000);
    },
    routeListNetwork() {
      this.$router.push(`/${PRODUCT_NAME}/c/${BLANK_CLUSTER}/${LIST_NETWORK}`); // Assuming '/create-network' is the route for the Create Network page
    },
    changeTab(tabIndex) {
      this.currentTab = tabIndex;
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
    async createNetwork() {
      // loading
      try {
        this.isLoading = true;
        const combinedObjects = combineArraysIntoObjects(
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

        const response = await this.$store.dispatch(`${PRODUCT_NAME}/create`, vnet_data);
        console.log("Network created:", response.data);
        
        // Set the API response data in the component
        this.apiResponse = response.data;
        console.log("response from create networks", this.apiResponse);

        this.apiResponseMessage = "VNET Successfully Added";

        this.apiError = null; // Reset error state

        this.isLoading = false;
        this.routeListNetwork();
      } catch (error) {
        console.error("Error creating network:", error);
        this.isLoading = false;
        this.apiResponseMessage = "Error";
        // Set the API error in the component
        this.apiError = "Error creating VRF";
        this.apiResponse = 1; // Reset response state
      }
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
/* h2 {
  color: #007bff;
} */
/* Add this style to position the buttons at the bottom */
.footer {
  position: fixed;
  bottom: 0;
  border-top: 2px solid #9c9393;
  width: 70%;
  padding: 20px 0;
  background-color: #fff;
}

.theme-dark .footer {
  background-color: #1b1c21;
}

.form-column-bottom {
  display: flex;
  justify-content: start;
}
</style>