<template>
  <div class="table-container">
    <table class="subnet-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th>DHCP</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(subnet, index) in subnets" :key="index" :class="{'error': checkIfHasError(subnet.address)}">
          <td>{{ subnet.name}}</td>
          <td>{{ subnet.address}}</td>
          <td>
            <BadgeState
              :color="subnet.dhcpEnabled ? 'bg-success' : 'bg-info'"
              :label="subnet.dhcpEnabled ? 'ENABLED' : 'DISABLED'"
            />
          </td>
          <td>{{ errorMessage(checkIfHasError(subnet.address)) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { isValidIP, validateString } from '../services/helpers/utils'
import { BadgeState } from '@components/BadgeState';
export default {
  name: "SubnetTable",
  props: {
    subnets: {
      type: Array,
      required: true
    }
  },
  components: {
    BadgeState
  },
  methods: {
    checkIfHasError(address) {
      if (!isValidIP(address)) {
        return 'invalid-ip'
      }

      if (this.subnets.filter((sub) => sub.address === address).length > 1) {
        return 'duplicate-address'
      }

      const addressObj = this.subnets.find((subnet) => subnet.address === address)
      if (addressObj.name === '') {
        return 'subnet-name-required'
      }

      console.log(`addressObj.name`, addressObj.name, validateString(addressObj.name))

      if (!validateString(addressObj.name)) {
        return 'subnet-name-invalid'
      }

      return false
    },

    errorMessage(error) {
      if (error === 'invalid-ip') {
        return "Invalid IP"
      } else if (error === 'duplicate-address') {
        return "Duplicate Address"
      } else if (error === 'subnet-name-required') {
        return "Subnet Name is required"
      } else if (error === 'subnet-name-invalid') {
        return "Subnet Name is invalid"
      } else {
        return ""
      }
    }
  }
}
</script>

<style scoped lang="scss">
.table-container {
  overflow-x: auto;
}
.subnet-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  text-align: left;
  font-family: 'Inter', sans-serif;
  border: 1px solid #e5e7eb; /* Gray-200 */

  th {
    padding: 12px 15px;
    background-color: #f9fafb; /* Gray-50 */
    border-bottom: 2px solid #e5e7eb; /* Gray-200 */
    color: #374151; /* Gray-700 */
    font-weight: 600;
    text-transform: uppercase;
    text-align: left;
  }

  td {
    padding: 12px 15px;
    border-bottom: 1px solid #e5e7eb; /* Gray-200 */
    color: #4b5563; /* Gray-600 */
  }

  tbody tr:hover {
    background-color: #f3f4f6; /* Gray-100 */
  }

  tbody tr:nth-child(even) {
    background-color: #f9fafb; /* Gray-50 */
  }

  tbody tr.error {
    background-color: #f86060 !important;
    color: #fff;
  }
}

@media (max-width: 640px) {
  .subnet-table th,
  .subnet-table td {
    padding: 8px 10px;
  }
}
</style>