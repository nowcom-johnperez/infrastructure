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
            Nowcom Virtual Network (VNet) is the fundamental building block for your private network in Nowcom Cloud. <br/>
            VNet enables many types of Nowcom resources, such as Nowcom Virtual Machines (VM), <br />
            to securely communicate with each other, the internet, and on-premises networks. <br />
            VNet is similar to a traditional network that you'd operate in your own data center, <br />
            but brings with it additional benefits of Nowcom's infrastructure such as scale, availability, and
            isolation.
          </p>
          <br />
          <div class="input-container">
            <label for="vnet">VNet Name</label>
            <input type="text" class="mt-10" name="vnet" v-model="selectedVnetName" placeholder="e.g. vnet" required />
            <span class="info-icon" v-clean-tooltip="tooltipVnet">
              <i class="fa fa-info-circle" aria-hidden="true"></i>
            </span>
          </div>
          
          <div class="checkbox-content mt-20">
            <input type="checkbox" id="dhcp" v-model="externalDNSenabled" />
            <label for="dhcp" v-clean-tooltip="tooltipComingSoon">External DNS</label>
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
              <div v-for="(subnet, index) in subnets" :key="`subnet_${index}`" class="row mt-10" style="justify-content: space-between; gap: 5px; align-items: center;">
                <div>
                  <input v-model="subnet.name" type="text" placeholder="Subnet Name"
                  title="Please enter a valid IP address" />
                </div>
                <div>
                  <input v-model="subnet.address" type="text" placeholder="Enter subnet (e.g., 10.0.0.0)"
                    pattern="\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}" title="Please enter a valid IP address"
                    />
                </div>
                <div class="subnet-suffix">
                  <p>/24</p>
                </div>
                <div class="checkbox-content">
                  <input type="checkbox" id="dhcp" v-model="subnet.dhcpEnabled" />
                  <label for="dhcp">DHCP Enabled?</label>
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

          <h3 class="mt-20">
            Labels
            <i class="fa fa-info-circle ml-5" v-clean-tooltip="tooltipLabels" aria-hidden="true"></i>
          </h3>
          <div>
            <div class="row" style="align-items: center;">
              <div>
                <label for="key">Key</label>
                <input type="text" name="key" v-model="tags.key" placeholder="Key"/>
              </div>
              <div class="ml-5 mr-5">
                <label for="value">Value</label>
                <input type="text" name="value" v-model="tags.value" placeholder="Value" @keydown.enter="addTag"/>
              </div>
              <div class="mt-15">
                <cButton class="cbtn btn-light" @click="addTag">
                  <i class="fa fa-plus mr-5"></i>
                  Add Label
                </cButton>
              </div>
            </div>
          </div>
          <Tag v-for="(tag, index) in tags.items" :key="index" :show-delete="showTagDelete(tag)" @delete="removeTag(index)" class="mt-10">{{tag}}</Tag>
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
                External DNS: {{ externalDNSenabled }}
              </p>
            </div>

            <div class="mt-30">
              <h2>Subnet</h2>
              <SubnetTable :subnets="subnets" />
            </div>
            
            <div class="mt-30">
              <h2>Labels</h2>
              <div>
                <template v-if="tags.items.length > 0">
                  <Tag v-for="(tag, index) in tags.items" class="mt-5" :key="index">{{tag}}</Tag>
                </template>
                <p v-else>No Tags</p>
              </div>
            </div>

            <div class="mt-10 mb-10" v-if="apiResponse">
              <Alert :variant="apiResponse" @close="apiResponse = null">{{ apiResponseMessage }}</Alert>
            </div>
          </template>

          <template v-slot:footer>
            <cButton class="cbtn btn-primary" @click="createNetwork" :disabled="isInvalidForm || isLoading" label="Create" />
            <cButton class="cbtn btn-light" @click="reviewModalState = false" label="Cancel" />
          </template>
        </Modal>
      </div>
    </div>
    <div class="footer">
      <div class="form-column-bottom">
        <button class="cbtn btn-primary ml-10" @click="reviewModalState = true">
          Review
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import Tabs from '../components/common/Tabs'
import SubnetTable from '../components/SubnetTable'
import Tag from '../components/common/Tag'
import Loading from '../components/common/Loading'
import cButton from '../components/common/Button'
import Modal from '../components/common/Modal'
import Alert from '../components/common/Alert'
import { isValidIP } from '../services/helpers/utils'
import { PRODUCT_NAME, LIST_NETWORK, BLANK_CLUSTER } from '../config/constants'

export default {
  name: "CreateNetwork",
  // layout: 'home',
  data() {
    return {
      reviewModalState: false,
      subnets: [
        {
          address: "10.55.0.0",
          name: "default",
          dhcpEnabled: false,
        }
      ],
      selectedVnetName: "", // Dropdown for network name
      isLoading: false,
      apiResponse: null, // New data property to store the API response
      apiResponseMessage: null, // New data property to store the API response
      currentTab: 0, // Initial tab
      tabList: ['Configure'],
      newTag: "",
      tags: {
        items: [],
        key: "",
        value: ""
      },
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
    SubnetTable,
    Alert
  },
  computed: {
    tooltipVnet() {
      return {
        content: `VNet name is used to identify your virtual network`,
        hideOnTargetClick: false
      }
    },
    tooltipLabels() {
      return {
        content: `Labels accepts key:value pair`,
        hideOnTargetClick: false
      }
    },
    tooltipComingSoon() {
      return {
        content: 'Feature coming soon!',
        hideOnTargetClick: false,
      }
    },
    isInvalidForm () {
      return !this.selectedVnetName || this.hasInvalidIPAddress || this.hasDuplicateIPAddress || this.hasInvalidSubnetName
    },
    hasDuplicateIPAddress() {
      const uniqueIPAddresses = new Set(this.subnets.map((subnet) => subnet.address));
      return this.subnets.length !== uniqueIPAddresses.size;
    },
    hasInvalidSubnetName() {
      return this.subnets.some(subnet => subnet.name === '')
    },
    hasInvalidIPAddress() {
      return this.subnets.some(subnet => !isValidIP(subnet.address));
    },
    user() {
      return this.$store.getters['auth/v3User']
    },
  },
  mounted() {
    if (this.$store.getters['auth/loggedIn']) {
      const date = new Date()
      this.tags.items.push(`packetlifter.dev/owner:${this.user.username}`)
      this.tags.items.push(`packetlifter.dev/created:${date.toISOString()}`)
    }
  },
  methods: {
    showTagDelete(tag) {
      return !['packetlifter.dev/owner', 'packetlifter.dev/created'].some((text) => tag.includes(text))
    },
    addTag() {
      const trimmedKey = this.tags.key.trim();
      const trimmedValue = this.tags.value.trim();
      if (trimmedKey && trimmedValue) {
        this.tags.items.push(`${trimmedKey}:${trimmedValue}`);
        this.tags.key = ""; // Clear the input field after adding a tag
        this.tags.value = ""; // Clear the input field after adding a tag
      }
    },
    removeTag(index) {
      this.tags.items.splice(index, 1);
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
      this.subnets.push({
        address: "10.55.0.0",
        name: "",
        dhcpEnabled: false,
      })
    },

    removeSubnet(index) {
      this.subnets.splice(index, 1);
    },
    async createNetwork() {
      // loading
      try {
        this.isLoading = true;
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
            subnets: this.subnets,
          }
        };
        await this.$store.dispatch(`${PRODUCT_NAME}/create`, vnet_data);
        this.apiResponse = 'success';
        this.apiResponseMessage = "VNET Successfully Added";
        this.isLoading = false;
        this.routeListNetwork();
      } catch (error) {
        console.error("Error creating network:", error.response.data.details);

        const e = error.response.data;

        if (e.reason === 'AlreadyExists') {
          this.apiResponseMessage = `${e?.details?.name} network already exist`;
        } else {
          this.apiResponseMessage = "Oops! Something went wrong!";
        }
        this.isLoading = false;
        
        this.apiResponse = 'error';
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