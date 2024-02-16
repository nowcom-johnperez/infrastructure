<template>
    <div class="base">
        <h1>Create NAT Gateway</h1>
        <!-- <p>This is page is for the creation of VNET</p> -->
        <br />
        <!-- Tab buttons -->
        <div class="tab-buttons">
            <button @click="changeTab('tab1')" :class="{ 'active': currentTab === 'tab1' }">Basics</button>
            <button @click="changeTab('tab2')" :class="{ 'active': currentTab === 'tab2' }">Outbound IP</button>
            <button @click="changeTab('tab3')" :class="{ 'active': currentTab === 'tab3' }">Subnet</button>
            <button @click="changeTab('tab4')" :class="{ 'active': currentTab === 'tab4' }">Review + Create</button>
        </div>
        <div class="form-container">
            <div class="form-row-2">
                <div class="form-column">
                    <!-- Tab content -->
                    <div v-if="currentTab === 'tab1'">
                        <p>
                            Nowcom NAT gateway can be used to translate outbound flows from a virtual network to the public
                            internet.
                        </p>
                        <br />
                        <h5 align="left">NAT Gateway Name</h5>
                        <input type="text" v-model="selectedNatGatewayName" placeholder="vnet" required />
                    </div>
                </div>
            </div>
            <div class="form-container">
                <div class="form-row-2">
                    <div v-if="currentTab === 'tab2'">
                        <!-- <h5 align="left">Subnet</h5>   -->
                        <p>
                            Configure which public IP addresses and public IP prefixes to use. Each outbound IP address
                            provides 64,000 SNAT ports for the NAT gateway resource to use. You can add up to 16 outbound IP
                            addresses.
                            <br /> <br />
                            Note: While you do not have to complete this step to create a NAT gateway, the NAT gateway will
                            not be functional and any subnet with this NAT gateway will not have outbound connectivity until
                            you have added at least one public IP address or public IP prefix.
                            You can also add and reconfigure which IP addresses are included after creating the NAT gateway.
                        </p>
                        <br />
                        <div>
                            <p>Public IP:</p>
                            <select id="publicIp" v-model="selectedPublicIp">
                                <option v-for="ip in publicIps" :key="ip" :value="ip">{{ ip }}</option>
                            </select>
                        </div>
                        <br />
                        <div>
                            <p>Corporate IP:</p>
                            <select id="corporateIp" v-model="selectedCorporateIp">
                                <option v-for="ip in corporateIps" :key="ip" :value="ip">{{ ip }}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-container">
                <div class="form-row-2">
                    <div class="form-column">
                        <div v-if="currentTab === 'tab3'">
                            <div>
                                <p>To use the NAT gateway, at least one subnet must be selected. You can add and remove
                                    subnets after creating the NAT gateway.</p>
                            </div>
                            <br />
                            <div>
                                <p>VNET:</p>
                                <select id="vnet" v-model="selectedVnet">
                                    <option v-for="vnet in vnets" :key="vnet" :value="vnet">{{ vnet }}</option>
                                </select>
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
                            <p :style="{ color: selectedNatGatewayName ? '' : 'red' }">
                                Name : {{ selectedNatGatewayName || 'empty' }}
                            </p>

                            <br /><br /><br />
                            <h2>Tag</h2>
                            <span v-for="(tag, index) in tags" :key="index" class="tag">
                                {{ tag }}
                            </span>

                            <br /><br /><br />
                            <h2>Subnet</h2>

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
                        <pre v-if="!apiError" align="center"> Created VNET: {{ apiResponse.vnet_name }}</pre>
                        <pre v-if="apiError" align="center">{{ apiError.error }} : {{ selectedNatGatewayName }}</pre>
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
                        :disabled="isLoading || !selectedNatGatewayName || hasInvalidIPAddress || hasDuplicateIPAddress"
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
import { NETWORK_URL, NETWORKS, NETWORK_URL_V2 } from "../config/api.ts";

const INSTANCE = axios.create({
    baseURL: NETWORK_URL,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Bypass certificate validation
});

const INSTANCE_V2 = axios.create({
    baseURL: NETWORK_URL_V2,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Bypass certificate validation
});

const PRODUCT_NAME = "Network";
const LIST_NETWORK = "vnet";
const BLANK_CLUSTER = "_";

export default {
    name: "CreateNatGateway",
    // layout: 'home',
    data() {
        return {
            selectedNatGatewayName: "", // Dropdown for network name
            publicIps: ['192.168.1.1', '192.168.1.2', '192.168.1.3'], // Example public IP addresses
            corporateIps: ['10.0.0.1', '10.0.0.2', '10.0.0.3'], // Example corporate IP addresses
            vnets: ['dev1', 'int0', 'prod'], // Example corporate IP addresses
            isLoading: false,
            apiResponse: null, // New data property to store the API response
            apiResponseMessage: null, // New data property to store the API response
            apiError: null,
            apiResponseUpdate: "", //response for update
            currentTab: "tab1", // Initial tab
            newTag: "",
            tags: [],
            hasInvalidIPAddress: false,
        };
    },
    computed: {

    },
    watch: {

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
        createNetwork() {
            // loading
            this.isLoading = true;

            const data = {
                vnet_name: this.selectedNatGatewayName.toLowerCase(),
            };
            // const vnet_data_string = JSON.stringify(vnet_data);
            console.log("send to API", data);

            INSTANCE_V2.post(`/vnets/`, data)
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
            INSTANCE_V2.get(`/vnets/`)
                .then((response) => {
                    this.networks = response.data;
                    console.log("from API", this.networks);
                })
                .catch((error) => {
                    console.error("Error fetching Network List:", error);
                });
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