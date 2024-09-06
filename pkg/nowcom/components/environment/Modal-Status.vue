<template>
  <Modal size="lg" v-if="savingModalState">
    <template #header>
      <h1 class="mb-0">{{ headerLabel }}</h1>
    </template>
    <template v-slot:content>
      <div>
        <ul class="status-list">
          <li class="status-item">
            <span>Creating Networks</span>
            <i :class="status.networks ? 'fa fa-check success-state' : 'fa fa-spinner fa-spin processing-state'"></i>
          </li>
          <li class="status-item">
            <span>Creating Firewall Connections</span>
            <i :class="status.firewall ? 'fa fa-check success-state' : 'fa fa-spinner fa-spin processing-state'"></i>
          </li>
          <li class="status-item">
            <span>Creating Git Repository on Github</span>
            <i :class="status.git ? 'fa fa-check success-state' : 'fa fa-spinner fa-spin processing-state'"></i>
          </li>
          <li class="status-item">
            <span>Creating Keyvaults and Service Accounts</span>
            <i :class="status.keyvaults ? 'fa fa-check success-state' : 'fa fa-spinner fa-spin processing-state'"></i>
          </li>
          <li class="status-item">
            <span>Creating K8s Cluster</span>
            <i :class="status.cluster ? 'fa fa-check success-state' : 'fa fa-spinner fa-spin processing-state'"></i>
          </li>
          <li class="status-item">
            <span>Creating Keyvault Services</span>
            <i :class="status.services ? 'fa fa-check success-state' : 'fa fa-spinner fa-spin processing-state'"></i>
          </li>
          <li class="status-item">
            <span>Creating Cert and DNS Services</span>
            <i :class="status.certDNS ? 'fa fa-check success-state' : 'fa fa-spinner fa-spin processing-state'"></i>
          </li>
        </ul>
      </div>
    </template>

    <template v-slot:footer>
      <button class="cbtn btn-light" @click="closeModalStatus">Close</button>
    </template>
  </Modal>
</template>

<script>
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
    status: {
      type: Object,
      default: () => {},
      required: true
    },
    headerLabel: {
      type: String,
      default: 'Create Status'
    }
  },
  methods: {
    closeModalStatus () {
      this.$emit('onClose')
    }
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