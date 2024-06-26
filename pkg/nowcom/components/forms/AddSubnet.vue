<template>
    <div>
        <div v-if="currentNetwork?.vrf === 'express' && Object.keys(currentSub).length > 0 || !currentNetwork?.vrf">
            <h2>Add Subnet</h2>
            <div class="add-form-row">
                <input v-model="subnetName" type="text" placeholder="Subnet Name" title="Subnet Name" />
                <p v-if="!isSubnetValidName && subnetName" class="text-danger" style="font-weight: bold;">Invalid Name Format</p>
            </div>
            <div class="add-form-row">
                <input
                    v-model="subnetIP"
                    type="text"
                    placeholder="Enter subnet (e.g., 10.0.0.0)"
                    pattern="\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}"
                    title="Please enter a valid IP address"
                    :disabled="currentNetwork?.vrf === 'express'"
                />
                <p v-if="!isSubnetIPValid" class="text-danger" style="font-weight: bold;">Invalid IP Address</p>
                <p v-if="subnetName && hasDuplicateIP && !loading" class="text-danger" style="font-weight: bold;">Duplicate IP Address</p>
            </div>
            <div class="checkbox-content">
                <input type="checkbox" id="dhcp" v-model="dhcpEnabled" />
                <label for="dhcp">DHCP Enabled?</label>
            </div>
            <div class="add-form-row">
                <cButton class="cbtn btn-light" :disabled="isAddSubnetDisabled || loading || !isEnabledExpressAdd || !isSubnetValidName || hasDuplicateIP" @click="addSubnet">
                    <template v-if="!loading">
                        <i class="fa fa-plus fa-lg mr-5"></i> Add Subnet
                    </template>
                    <template v-else>
                        <i class="fa fa-spinner fa-spin fa-lg mr-5"></i> Processing
                    </template>
                </cButton> 
            </div>
        </div>
        <div v-else class="mt-20">
            <NotFound msg="No IP Address available" />
        </div>
    </div>
</template>

<script>
import { isValidIP, transformArrayToObject, validateString } from '../../services/helpers/utils'
import { vNetService } from '../../services/api/vnet';
import { expressService } from '../../services/api/express';
import cButton from '../common/Button'
import NotFound from '../common/NotFound'
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
        },
        currentSub: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        cButton,
        NotFound
    },
    data() {
        return {
            subnetName: '',
            subnetIP: '10.0.0.0',
            dhcpEnabled: false,
            loading: false,
            tempNetwork: {}
        }
    },
    watch: {
        isOpen (val) {
            if (!val) this.resetForm();
            else {
                this.initExpressForm()
            }
        },
    },
    computed: {
        isAddSubnetDisabled() {
            // Check conditions to disable the button
            return !this.subnetName || !this.subnetIP || !this.isSubnetIPValid;
        },
        isSubnetIPValid() {
            return isValidIP(this.subnetIP)
        },
        isEnabledExpressAdd() {
            return this.currentNetwork?.vrf === 'express' && Object.keys(this.currentSub).length > 0 || !this.currentNetwork.vrf
        },
        isSubnetValidName() {
            return validateString(this.subnetName)
        },
        hasDuplicateIP() {
            return !this.currentNetwork.vrf && this.currentNetwork.subnets.find((subnet) => subnet.address === this.subnetIP)
        }
    },
    methods: {
        initExpressForm() {
            if (this.currentNetwork?.vrf === 'express') {
                this.subnetName = this.currentSub.name
                this.subnetIP = this.currentSub.address
            }
        },
        resetForm() {
            this.subnetName = '';
            this.subnetIP = '10.0.0.0';
            this.loading = false;
        },
        async processNormalSubnet() {
            return new Promise(async (resolve, reject) => {
                try {
                    this.tempNetwork = {...this.currentNetwork};
                    this.apiError = null; // Reset error state
                    // v0.2
                    const subnetName = this.subnetName.toLowerCase();
                    const subnet_data = {
                        longName: `${this.tempNetwork.name}-${subnetName}-${this.subnetIP}-24`,
                        name:      subnetName,
                        address:   this.subnetIP,
                        formattedAddress: `${this.subnetIP}/24`,
                        dhcpEnabled: this.dhcpEnabled,
                        prefix_len: 24
                    };

                    this.tempNetwork.subnets.push(subnet_data);

                    const subs = this.tempNetwork.subnets.map((sub) => {
                        return {
                            name: sub.name,
                            address: sub.address
                        }
                    })

                    const vnet_data = {
                        apiVersion: 'packetlifter.io/v1',
                        kind:       'Vnet',
                        // vnet_vlan: this.selectedVnetVlan,
                        metadata:   {
                            name:      this.tempNetwork.name.toLowerCase(),
                            namespace: 'default'
                        },
                        spec: {
                            name:    this.tempNetwork.name.toLowerCase(),
                            subnets: subs,
                        }
                    };

                    await vNetService.patchSubnet(this.tempNetwork.name, vnet_data);
                    resolve('success');
                } catch (error){
                    // remove the added name
                    const index = this.tempNetwork.subnets.findIndex((subnet) => subnet.name === this.subnetName.toLowerCase())
                    this.tempNetwork.subnets.splice(index, 1);
                    reject(error);
                }
            })
            
        },

        async processExpressSubnet() {
            return new Promise(async (resolve, reject) => {
                try {
                    const express_data = {
                        apiVersion: 'packetlifter.io/v1',
                        kind:       'Subnet',
                        metadata:   {
                            name:      this.currentSub.name,
                            labels:     transformArrayToObject([{ key: 'displayName', value: this.subnetName }])
                        },
                        spec: {
                            name:    this.currentSub.name,
                            dhcpEnabled: this.dhcpEnabled,
                            activated: true,
                        }
                    };
                    await expressService.patchExpressSubnet(this.currentSub.name, express_data);
                    resolve("success");
                } catch (error) {
                    reject(error)
                }
            })
            
        },
        async addSubnet() {
            try {
                this.loading = true
                if (this.currentNetwork?.vrf === 'express') {
                    await this.processExpressSubnet()
                } else {
                    await this.processNormalSubnet()
                }
                this.resetForm();
                this.$emit('success')
            } catch(error) {
                this.loading = false;
                console.log(`error`, error)
                this.$emit('error', error.response?.data?.message);
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