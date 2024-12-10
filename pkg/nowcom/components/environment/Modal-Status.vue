<template>
  <Modal size="lg" v-if="savingModalState">
    <template #header>
      <h1 class="mb-0">{{ headerLabel }}</h1>
    </template>
    <template v-slot:content>
      <div>
        <ul class="status-list">
          <li class="status-item">
            <span>Creating Virtual Network</span>
            <i :class="status.networks ? 'fa fa-check success-state' : 'fa fa-spinner fa-spin processing-state'"></i>
          </li>
          <li class="status-item">
            <span>Creating Network Policy</span>
            <i :class="status.networkPolicy ? 'fa fa-check success-state' : 'fa fa-spinner fa-spin processing-state'"></i>
          </li>
          <!-- <li class="status-item">
            <span>Creating Git Repository on Github</span>
            <i :class="status.git ? 'fa fa-check success-state' : 'fa fa-spinner fa-spin processing-state'"></i>
          </li> -->
          <!-- <li class="status-item">
            <span>Creating Keyvaults and Service Accounts</span>
            <i :class="status.keyvaults ? 'fa fa-check success-state' : 'fa fa-spinner fa-spin processing-state'"></i>
          </li> -->
          <li class="status-item">
            <span>Creating K8s Cluster</span>
            <i :class="status.cluster ? 'fa fa-check success-state' : 'fa fa-spinner fa-spin processing-state'"></i>
          </li>
          <!-- <li class="status-item">
            <span>Creating Keyvault Services</span>
            <i :class="status.services ? 'fa fa-check success-state' : 'fa fa-spinner fa-spin processing-state'"></i>
          </li>
          <li class="status-item">
            <span>Creating Cert and DNS Services</span>
            <i :class="status.dns ? 'fa fa-check success-state' : 'fa fa-spinner fa-spin processing-state'"></i>
          </li> -->
        </ul>
      </div>
    </template>

    <template v-slot:footer>
      <button class="cbtn btn-light" @click="closeModalStatus">Close</button>
    </template>
  </Modal>
</template>

<script>
import { environmentService } from '../../services/api';
import Modal from '../common/Modal'
export default {
  name: 'ModalStatus',
  components: {
    Modal
  },
  props: {
    savingModalState: {
      type: Boolean,
      required: true
    },
    environmentId: {
      type: String,
      required: true
    },
    headerLabel: {
      type: String,
      default: 'Create Status'
    }
  },
  data() {
    return {
      status: {
        networks: false,
        firewall: false,
        git: false,
        keyvaults: false,
        cluster: false,
        services: false,
        dns: false
      },
      intervalId: null,
      item: null
    }
  },
  methods: {
    async loadEnvironment() {
      this.item = await environmentService.getById(this.environmentId)
      this.status = {
        networks: this.getStatus('NetworkReady'),
        networkPolicy: this.getStatus('NetworkPolicyReady'),
        // git: this.getStatus('NetworkReady'),
        // keyvaults: this.getStatus('NetworkReady'),
        cluster: this.getStatus('ClusterReady'),
        // services: this.getStatus('NetworkReady'),
        // dns: this.getStatus('NetworkReady')
      }
    },
    getStatus(type) {
      if (!type || !this.item) return false
      const condition = this.item?.status?.conditions.find((c) => c.type === type)
      if (condition.status === "True") return true
      else if (condition.status === "Unknown") return false
      return false
    },
    initInterval() {
      if (!this.intervalId) {
        this.intervalId = setInterval(this.loadEnvironment, 2000)
      }
    },
    stopInterval() {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
    },
    closeModalStatus () {
      this.stopInterval()
      this.$emit('onClose')
    }
  },
  mounted() {
    this.initInterval()
  },
  beforeDestroy() {
    this.stopInterval()
  }
}
</script>

<style lang="scss" scoped>

.status-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
  }

  .success-state {
    color: green;
  }

  .processing-state {
    color: #007bff;
  }
  
  </style>