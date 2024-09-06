<template>
  <div>
    <div class="env-form-container">
      <div class="left-form">
        <h1>Basic</h1>
        <div class="input-container">
          <label for="environmentName">Name</label>
          <input type="text" class="mt-10" name="environmentName" v-model="selected.envName" placeholder="Environment Name" required />
          <span class="info-icon" v-clean-tooltip="'Naming Scheme must be {ENV NAME}-{TEAM}'">
            <i class="fa fa-info-circle" aria-hidden="true"></i>
          </span>
        </div>
  
        <div class="mt-15 input-container">
          <label for="size">Size <span class="text-danger">*</span></label>
          <CardSelect :options="sizes" @onSelect="(size) => selected.size = size" class="mt-5" :current="selected.size" />
        </div>
  
        <div class="mt-15 input-container">
          <label for="networkType">Network Type <span class="text-danger">*</span></label>
          <Select :options="networkType" v-model="selected.networkType" class="mt-5"/>
        </div>
  
        <div v-if="selected.envName" class="mt-15 input-container">
          <label for="networkType">Network <span class="text-danger">*</span></label>
          <input type="text" class="mt-10" name="nodes" v-model="generatedNetworkName" placeholder="1" required disabled/>
          <span class="info-icon" v-clean-tooltip="'Generated network name'">
            <i class="fa fa-info-circle" aria-hidden="true"></i>
          </span>
        </div>
      </div>
  
      <div class="right-form">
        <h1>Additional Information</h1>
        <div class="input-container mt-15">
          <label for="orgName">Organization Name</label>
          <input type="text" class="mt-10" name="orgName" v-model="selected.orgName" placeholder="Organization Name" required />
          <span class="info-icon" v-clean-tooltip="'Organization Name'">
            <i class="fa fa-info-circle" aria-hidden="true"></i>
          </span>
        </div>
  
        <div class="input-container mt-15">
          <label for="teamName">Team Name</label>
          <input type="text" class="mt-10" name="teamName" v-model="selected.teamName" placeholder="Team Name" required />
          <span class="info-icon" v-clean-tooltip="'Team Name'">
            <i class="fa fa-info-circle" aria-hidden="true"></i>
          </span>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="form-column-bottom">
        <button class="cbtn btn-primary ml-10" @click="createEnv">
          Create
        </button>
      </div>
    </div>

    <ModalStatus header-label="Create Status" :status="saving" :saving-modal-state="savingModalState" @onClose="closeEnv"/>
  </div>
</template>

<script>
import Select from '@shell/components/form/Select.vue';
import CardSelect from '../common/CardSelection.vue';
import ModalStatus from '../environment/Modal-Status.vue';
import { HOME, PRODUCT_NAME } from '../../config/constants';
export default {
  name: 'EnvironmentCreateForm',
  components: {
    Select,
    CardSelect,
    ModalStatus,
  },
  data() {
    return {
      savingModalState: false,
      saving: {
        networks: false,
        firewall: false,
        git: false,
        keyvaults: false,
        cluster: false,
        services: false,
        certDNS: false
      },
      selected: {
        envName: '',
        size: 'Small',
        orgName: '',
        teamName: '',
        networkType: 'Standard',
        network: null
      },
      sizes: [
        { size: 'Small', description: ['Control Pane', 'Worker', 'ETCD']},
        { size: 'Medium', description: ['1 Dedicated Control Pane']},
        { size: 'Large', description: ['3 Control Pane', '3 Worker Nodes']},
      ],
      networkType: [
        'Express',
        'Standard',
      ],
    }
  },
  computed: {
    nodeToolTip() {
      if (this.selected.size === 'Small') {
        return 'Control Pane, Worker, ETCD'
      } else if (this.selected.size === 'Medium') {
        return '1 Worker node dedicated'
      } else {
        return '3 Control Pane and 3 Worker Node'
      }
    },
    generatedNetworkName() {
      const network = this.selected.networkType === 'Standard' ? "vnet-" : "express-"

      return network + this.selected.envName
    }
  },
  watch: {
    'selected.size' (newSize) {
      if (newSize === 'Small') {
        this.selected.node = 1
      } else if (newSize === 'Medium') {
        this.selected.node = 2
      } else {
        this.selected.node = 6
      }
    }
  },
  methods: {
    createEnv () {
      this.savingModalState = true

      setTimeout(() => {
        this.saving.cluster = true
        this.saving.networks = true
      }, 1500)
    },
    closeEnv() {
      this.$router.push({
        name: `${PRODUCT_NAME}-c-cluster-${HOME}`,
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .input-container {
    width: 470px !important
  }

  .env-form-container {
    display: flex;

    .left-form {
      flex: 1
    }

    .right-form {
      flex: 1
    }
  }

  /* Add this style to position the buttons at the bottom */
  .footer {
    position: fixed;
    bottom: 0;
    border-top: 2px solid #9c9393;
    width: 80%;
    padding: 20px 0;
    background-color: #fff;
  }

  .theme-dark .footer {
    background-color: #1b1c21;
  }

  .form-column-bottom {
    display: flex;
    justify-content: start;
  }
</style>