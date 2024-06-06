<template>
    <div class="subnet-container">
        <div class="subnet-name" :class="{ 'invalid-message': !isValidIPAddress }">{{ subnet.name }}</div>
        <!-- <div>-</div> -->
        <div :class="{ 'invalid-message': !isValidIPAddress }">
            {{ subnet.address }}
            <span v-if="!isValidIPAddress">
                (Invalid IP Address)
            </span>
            <span v-else-if="isDuplicateIPAddress"> (Duplicate IP Address)</span>
        </div>
        <div>
            DHCP Enabled: {{ subnet.dhcpEnabled }}
        </div>
    </div>
</template>

<script>
import { isValidIP } from '../services/helpers/utils'
export default {
    name: 'Subnet',
    props: {
        subnet: {
            type: Object,
            required: true
        },
        ipList: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    computed: {
        isValidIPAddress() {
            return isValidIP(this.subnet.address);
        },
        isDuplicateIPAddress() {
            return this.ipList.filter((sub) => sub.address === this.subnet.address).length > 1
        }
    },
}
</script>

<style lang="scss" scoped>
.subnet-container {
    display: flex;
    justify-items: center;
    gap: 30px;
    width: 50%;
    text-align: left;
}

.subnet-name {
    width: 60px;
    max-width: 100px;
    font-size: 1.1rem;
}

.invalid-message {
  color: red;
}
</style>