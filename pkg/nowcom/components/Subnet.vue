<template>
    <div class="subnet-container">
        <div class="subnet-name">{{ name }}</div>
        <!-- <div>-</div> -->
        <div :class="{ 'invalid-ip': !isValidIPAddress }">
            {{ currentAddress }}
            <span v-if="!isValidIPAddress" class="invalid-message">
                (Invalid IP Address)
            </span>
            <span v-else-if="isDuplicateIPAddress" class="invalid-message"> (Duplicate IP Address)</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Subnet',
    props: {
        name: {
            type: String,
            required: true
        },
        currentAddress: {
            type: String,
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
            const ipRegex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
            return ipRegex.test(this.currentAddress);
        },
        isDuplicateIPAddress() {
            return this.ipList.filter((ip) => ip === this.currentAddress).length > 1
        }
    },
}
</script>

<style scoped>
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
.invalid-ip {
  color: red;
}

.invalid-message {
  color: blue;
}
</style>