<template>
    <div>
        <h2>Add Subnet</h2>
        <!-- ... your content for adding subnet -->
        <div class="add-form-row">
            <input v-model="subnetName" type="text" placeholder="Subnet Name" title="Subnet Name" />
        </div>
        <div class="add-form-row">
            <input
                v-model="subnetIP"
                type="text"
                placeholder="Enter subnet (e.g., 10.0.0.0)"
                pattern="\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}"
                title="Please enter a valid IP address"
            />
            <p v-if="!isSubnetIPValid" class="text-danger" style="font-weight: bold;">Invalid IP Address</p>
        </div>
        <div class="checkbox-content">
            <input type="checkbox" id="dhcp" v-model="dhcpEnabled" />
            <label for="dhcp">DHCP Enabled?</label>
        </div>
        <div class="add-form-row">
            <cButton class="cbtn btn-light" :disabled="isAddSubnetDisabled || loading" @click="addSubnet">
                <template v-if="!loading">
                    <i class="fa fa-plus fa-lg mr-5"></i> Add Subnet
                </template>
                <template v-else>
                    <i class="fa fa-spinner fa-spin fa-lg mr-5"></i> Processing
                </template>
            </cButton> 
        </div>
    </div>
</template>

<script>
import { isValidIP } from '../../services/helpers/utils'
import { vNetService } from '../../services/api/vnet';
import cButton from '../common/Button'
export default {
    name: 'AddSubnet',
    props: {
        isOpen: {
            type: Boolean,
            required: true
        },
        currentNetwork: {
            type: Object,
            required: true
        }
    },
    components: {
        cButton
    },
    data() {
        return {
            subnetName: '',
            subnetIP: '10.55.0.0',
            dhcpEnabled: false,
            loading: false,
        }
    },
    watcher: {
        isOpen (val) {
            if (!val) this.resetForm();
        } 
    },
    computed: {
        isAddSubnetDisabled() {
            // Check conditions to disable the button
            return !this.subnetName || !this.subnetIP || !this.isSubnetIPValid;
        },
        isSubnetIPValid() {
            return isValidIP(this.subnetIP)
        }
    },
    methods: {
        resetForm() {
            this.subnetName = '';
            this.subnetIP = '10.55.0.0';
            this.loading = false;
        },
        async addSubnet() {
            try {
                const network = {...this.currentNetwork};
                this.apiError = null; // Reset error state
                // v0.2
                const subnetName = this.subnetName.toLowerCase();
                const subnet_data = {
                    longName: `${network.name}-${subnetName}-${this.subnetIP}-24`,
                    name:      subnetName,
                    address:   this.subnetIP,
                    formattedAddress: `${this.subnetIP}/24`,
                    dhcpEnabled: this.dhcpEnabled,
                    prefix_len: 24
                };

                network.subnets.push(subnet_data);

                const vnet_data = {
                    apiVersion: 'packetlifter.dev/v1',
                    kind:       'Vnet',
                    // vnet_vlan: this.selectedVnetVlan,
                    metadata:   {
                        name:      network.name.toLowerCase(),
                        namespace: 'default'
                    },
                    spec: {
                        name:    network.name.toLowerCase(),
                        subnets: network.subnets,
                    }
                };

                console.log('send to API', subnet_data);
                console.log('log', network);

                this.loading = true

                await vNetService.patchSubnet(network.name, vnet_data);
                this.resetForm();
                this.$emit('success')
            } catch(error) {
                console.log(error);
                this.loading = false;
                // this.subnetResponseMessage = 'Error';
                // Set the API error in the component
                // this.apiError = 'Error creating Subnet';
            }
        },
    }
}
</script>

<style scoped>
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