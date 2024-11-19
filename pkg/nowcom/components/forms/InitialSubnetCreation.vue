<template>
  <div>
    <div class="flex" style="justify-content: space-between; justify-items: center;">
      <div>
        <label>Subnets</label>
      </div>
      <div>
        <button class="btn role-secondary btn-sm" @click="addSubnet">
          <i class="fa fa-plus mr-5"></i>
          Add Subnet
        </button>
      </div>
    </div>
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
</template>

<script>
import { isValidIP, validateString } from '../../services/helpers/utils'
export default {
  name: 'SubnetCreation',
  data() {
    return {
      subnets: [
        {
          address: "10.0.0.0",
          name: "default",
          dhcpEnabled: false,
        }
      ]
    }
  },
  computed: {
    hasDuplicateIPAddress() {
      const uniqueIPAddresses = new Set(this.subnets.map((subnet) => subnet.address));
      return this.subnets.length !== uniqueIPAddresses.size;
    },
    hasInvalidSubnetName() {
      return this.subnets.some(subnet => subnet.name === '' || !validateString(subnet.name))
    },
    hasInvalidIPAddress() {
      return this.subnets.some(subnet => !isValidIP(subnet.address));
    },
  },
  methods: {
    addSubnet () {
      this.subnets.push({
        address: "10.0.0.0",
        name: "",
        dhcpEnabled: false,
      })

      this.$emit('onAdd', this.subnets)
    },
    removeSubnet(index) {
      this.subnets.splice(index, 1);
    },
  }
}
</script>