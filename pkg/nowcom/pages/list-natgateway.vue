<template>
    <div class="base">
        <h1>NAT Gateway</h1>
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
        <GroupButtons :list="natGatewayButtons" @action="actionHandler"/>
        <div class="form-row mt-10">
            <div class="form-column">
                <UniversalTable :headers="vnetHeaders" :filters="filters" :items="networks" @action-click="openModal" />
            </div>
        </div>

        <SideBar type="main" :sidebar-visible="sidebarVisible">
            <h2>{{ selectedNetwork ? selectedNetwork.vnet_name : 'No Network Selected' }}</h2>
            <div class="form-row">
                <div class="form-column" align="left">
                    <cButton class="custom-button" @click="addSubnetSidebar">
                        <i class="fa fa-plus"></i> Add Subnet
                    </cButton>
                </div>
            </div>
            <UniversalTable v-if="selectedNetwork" :headers="subVnetHeaders" :items="selectedNetwork.subnets" @action-click="openModalSubnet" />
            <UniversalTable v-if="selectedNetwork" :headers="subnetworkHeader" :items="selectedNetwork.subnets" @action-click="openModalSubnet" />
            </br>
            <div v-if="subnetResponse">
                <h2 align="center">{{ subnetResponseMessage }}</h2>
                <pre align="center" v-if="!apiError">SUBNET: {{ subnet_name }}</pre>
                <pre align="center" v-if="apiError">{{ apiError.error }} : {{ selectedName }}</pre>
            </div>

            <cButton class="btn-x" @click="closeSidebar">
                <i class="x-icon fa fa-close fa-lg"></i>
            </cButton>
        </SideBar>

        <SideBar type="sub" :sidebar-visible="addSubnetSidebarVisible">
            <h2>Add Subnet</h2>
            <!-- ... your content for adding subnet -->
            <div class="add-form-row">
                <input v-model="selectedSubnetName" type="text" placeholder="Subnet Name" title="Subnet Name" />
            </div>
            <div class="add-form-row">
                <input
                v-model="selectedVnetSubnets"
                type="text"
                placeholder="Enter subnet (e.g., 10.0.0.0)"
                pattern="\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}"
                title="Please enter a valid IP address"
                />
            </div>
            <div class="add-form-row">
                <cButton class="cbtn btn-light" :disabled="isAddSubnetDisabled" @click="addSubnet">
                    <i class="fa fa-plus fa-lg mr-5"></i> Add Subnet
                </cButton> 
            </div>

            <cButton class="btn-x" @click="closeSubnetSidebar">
                <i class="x-icon fa fa-close fa-lg"></i>
            </cButton>
        </SideBar>

        <Modal v-if="isModalOpen">
            <template v-slot:content>
                <h2>Delete?</h2>
                <p>Are you sure that you want to delete VLAN "{{ selectedVnetName }}"?</p>
            </template>

            <template v-slot:footer>
                <cButton class="delete-button" @click="deleteNetwork" label="Yes" />
                <cButton class="ok-button" @click="closeModal" label="No" />
            </template>
        </Modal>

        <Modal v-if="isModalSubnetOpen">
            <template v-slot:content>
                <h2>Are you sure that you want to delete:</h2>
                <p>Subnet "{{ subnet_name }}" under VNET "{{ vnet_name }}"?</p>
            </template>

            <template v-slot:footer>
                <cButton class="delete-button" @click="deleteSubnet" label="Yes" />
                <cButton class="ok-button" @click="closeModalSubnet" label="No" />
            </template>
        </Modal>
    </div>
</template>

<script>
import UniversalTable from '../components/UniversalTable'
import cButton from '../components/common/Button'
import SideBar from '../components/Sidebar'
import GroupButtons from '../components/common/GroupButtons'
import Modal from '../components/common/Modal'
// import { NAT_BUTTONS } from '../config/buttons'
import { SORTABLE_NETWORK_HEADERS, SORTABLE_SUB_NETWORK_HEADERS } from '../config/table'
import { natService } from '../services/api/nat';

const PRODUCT_NAME = "Network";
const LIST_NAT_GATEWAY = "nat.gateway";
const CREATE_NAT_GATEWAY = "create.nat.gateway";
const BLANK_CLUSTER = "_";

export default {
    name: "ListNatGateway",
    components: {
        UniversalTable,
        cButton,
        SideBar,
        GroupButtons,
        Modal
    },
    // layout: 'home',
    data() {
        return {
            selectedName: "", // Dropdown for network name
            selectedVnetName: "",
            selectedSubnetName: "",
            selectedVnetSubnets: "10.55.0.0",
            networks: [], // This will be populated with data from the API
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
            network: [],
            users: [
                {
                    name: "francis",
                    age: 17,
                    email: "fvictoriano@nowcom.com",
                    address: {
                        street: "1152 S Ardmore",
                        city: "Los Angeles",
                        state: "California"
                    }
                },
                {
                    name: "Andy",
                    age: 17,
                    email: "andy@nowcom.com",
                    address: {
                        street: "1152 S Ardmore",
                        city: "Los Angeles",
                        state: "California"
                    }
                },
                {
                    name: "george",
                    age: 17,
                    email: "george@nowcom.com",
                    address: {
                        street: "1152 S Ardmore",
                        city: "Los Angeles",
                        state: "California"
                    }
                },
                {
                    name: "kate",
                    age: 17,
                    email: "kate@nowcom.com",
                    address: {
                        street: "1152 S Ardmore",
                        city: "Los Angeles",
                        state: "California"
                    }
                },
                {
                    name: "carlo",
                    age: 17,
                    email: "carlo@nowcom.com",
                    address: {
                        street: "1152 S Ardmore",
                        city: "Los Angeles",
                        state: "California"
                    }
                },
                {
                    name: "mohenne",
                    age: 17,
                    email: "mohenne@nowcom.com",
                    address: {
                        street: "1152 S Ardmore",
                        city: "Los Angeles",
                        state: "California"
                    }
                }

            ],
            filters: {
                name: { value: '', keys: ['vnet_name'] }
            },
            currentPage: 1,
            totalPages: 0,
            natGatewayButtons: [],
            vnetHeaders: [],
            subVnetHeaders: []
        };
    },
    computed: {
        isAddSubnetDisabled() {
            // Check conditions to disable the button
            return !this.selectedSubnetName || !this.selectedVnetSubnets;
        },
    },
    methods: {
        actionHandler (action) {
            if (action === 'create') {
                this.routeCreateNetwork()
            } else if (action === 'refresh') {
                this.fetchNetworks()
            }
        },
        async addSubnet() {
            //v0.2
            const subnet_data = {
                subnet_name: this.selectedSubnetName.toLowerCase(),
                network: this.selectedVnetSubnets,
            };

            let vnet = this.selectedNetwork.id

            console.log("send to API", subnet_data);
            console.log("log", this.selectedNetwork);

            try {
                const response = await natService.createSubnet(vnet, subnet_data);
                console.log("Subnet Network created:", response.data);
                this.loading = false;

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
            } catch (error) {
                console.log(error.response)
                this.loading = false;
                alert(error.response.data.detail)
                this.subnetResponseMessage = "Error";
                // Set the API error in the component
                this.apiError = "Error creating Subnet";
            }
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
            this.$router.push(`/${PRODUCT_NAME}/c/${BLANK_CLUSTER}/${CREATE_NAT_GATEWAY}`); // Assuming '/create-network' is the route for the Create Network page
        },
        openModal(row) {
            const { vnetId, vnetName } = row;
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

        openModalSubnet(row) {
            // Set the selected VLAN name
            const { subnet_name, id } = row
             
            this.vnet_id = this.selectedNetwork.id;
            this.vnet_name = this.selectedNetwork.vnet_name;
            this.subnet_name = subnet_name;
            this.subnet_id = id;

            // Open the modal
            this.isModalSubnetOpen = true;
        },

        closeModalSubnet() {
            this.isModalSubnetOpen = false;
        },

        async fetchNetworks() {
            try {
                const networks = await natService.getAllVnets()
                this.networks = networks.map((network) => {
                    return {
                        ...network,
                        attachments: 'local',
                        subnetLength: "Total Subnet: " + network.subnets.length
                    }
                })
            } catch (error) {
                console.error("Error fetching Network List:", error);
            }
        },
        async deleteNetwork() {
            console.log(`Delete Network Endpoint, ${this.selectedVnetName},${this.selectedVnetId} `);
            try {
                const response = await natService.deleteNetwork(this.selectedVnetId);
                this.loading = false;
                this.apiResponse = response.data;
                // Set the API response data in the component
                this.apiResponseMessage = "VNET Successfully Deleted";
                this.apiError = null; // Reset error state
                //this.fetchHarvesterNetworks();
                this.fetchNetworks();

                // Close the modal after deletion
                this.closeModal();
            } catch (error) {
                console.error("Error deleting network:", error);
                this.loading = false;
                this.apiResponseMessage = "Error";
                // Set the API error in the component
                this.apiError = error.response ? error.response.data : error.message;
                this.apiResponse = 1; // Reset response state
            }
        },

        async getlAllSubnets (subnetId) {
            try {
                const response = await natService.getAllSubnets(subnetId);
                this.selectedNetwork.subnets = response.data;
            } catch (error) {
                this.subnetResponseMessage = "Error";
            }
        },

        async deleteSubnet() {
            console.log(
                `Delete Subnet Endpoint, ${this.vnet_id}, ${this.vnet_name}, ${this.subnet_name}, ${this.subnet_id}`
            );
            // Make an Axios DELETE request to delete the network with the selected VLAN name

            try {
                const response = await natService.deleteSubNet(this.subnet_id);
                console.log("Network deleted:", response.data);
                this.loading = false;

                this.subnetResponse = response.data;
                // Set the API response data in the component
                this.subnetResponseMessage = "Subnet Successfully Deleted";
                this.apiError = null; // Reset error state

                //call of subnets
                await this.getlAllSubnets();
                // Update the selectedNetwork with the selected vnet_name
                this.selectedNetwork.vnet_name = this.vnet_name;
                console.log("Selected Network:", this.selectedNetwork);
                // Close the modal after deletion
                this.closeModalSubnet();
            } catch (error) {
                // Handle any errors here
                console.error("Error deleting network:", error);
                this.loading = false;
                this.subnetResponseMessage = "Error";
                // Set the API error in the component
                this.apiError = error.response ? error.response.data : error.message;
                this.subnetResponse = 1; // Reset response state
            }
        },
    },
    created() {
        // this.natGatewayButtons = NAT_BUTTONS;
        this.vnetHeaders = SORTABLE_NETWORK_HEADERS;
        this.subVnetHeaders = SORTABLE_SUB_NETWORK_HEADERS;
    },
    mounted() {
        // Fetch the VLAN list and network list when the component is mounted
        this.fetchNetworks();
        //this.fetchHarvesterNetworks();
    },
};
</script>
  
<style scoped>
</style>
  