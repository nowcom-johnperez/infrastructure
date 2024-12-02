<template>
  <div>
    <div class="env-form-container basic-grid">
      <div class="left-form">
        <h1>Basic</h1>
        <div class="input-container">
          <label for="environmentName">Name <span class="text-danger">*</span></label>
          <input type="text" class="mt-10" name="environmentName" v-model="selected.envName" placeholder="Environment Name" required />
          <span class="info-icon" v-clean-tooltip="'Naming Scheme must be {ENV NAME}-{TEAM}'">
            <i class="fa fa-info-circle" aria-hidden="true"></i>
          </span>
        </div>

        <div class="mt-15 input-container">
          <label for="networkType">Namespace <span class="text-danger">*</span></label>
          <Select :options="namespaceList" v-model="selected.namespace" class="mt-5"/>
        </div>

  
        <div class="mt-15 input-container">
          <label for="size">Size <span class="text-danger">*</span></label>
          <CardSelect :options="sizes" @onSelect="(size) => selected.size = size" class="mt-5" :current="selected.size" />
        </div>

        <div class="input-container mt-15">
          <label for="size">Size Information</label>
          <div class="mt-5">
            <NodeInfo :node="nodeInfo.master" :show-usage="false" />
            <NodeInfo v-if="nodeInfo.worker" :node="nodeInfo.worker" class="mt-15" :show-usage="false" />
          </div>
          <!-- <ul class="size-description-list">
            <li v-for="(desc, index) in sizeDescription" :key="index">
              <i class="fa fa-check"></i> {{ desc }}
            </li>
          </ul> -->
        </div>
  
        <div class="mt-15 input-container">
          <label for="networkType">Network Type <span class="text-danger">*</span></label>
          <Select :options="networkType" v-model="selected.networkType" class="mt-5"/>
        </div>
  
        <div v-if="selected.networkType === 'Isolated'" class="mt-15 input-container">
          <label for="networkType">Network <span class="text-danger">*</span></label>
          <input type="text" class="mt-10" name="nodes" v-model="generatedNetworkName" placeholder="1" required disabled/>
          <span class="info-icon" v-clean-tooltip="'Generated network name'">
            <i class="fa fa-info-circle" aria-hidden="true"></i>
          </span>
        </div>

        <!-- <div class="mt-15">
          <SubnetCreate @onAdd="addSubnet" />
        </div> -->
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

        <div class="checkbox-content mt-15">
          <input type="checkbox" id="githubRepo" v-model="selected.enableGithub" />
          <label for="githubRepo">Create New Github Repo</label>
        </div>

        <div class="checkbox-content mt-15">
          <input type="checkbox" id="keyvaultAzure" v-model="selected.enableKeyvault" />
          <label for="keyvaultAzure">Create New Azure Keyvault</label>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="form-column-bottom">
        <button class="btn role-primary ml-10" @click="createEnv">
          Create
        </button>
        <button class="btn role-secondary ml-10" @click="closeEnv">
          Cancel
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
// import SubnetCreate from '../forms/InitialSubnetCreation.vue'
import { HOME, PRODUCT_NAME, ENVIRONMENT_SIZES } from '../../config/constants';
import { HCI as HCI_ANNOTATIONS } from '@shell/config/labels-annotations';
// import { harvesterService } from '../../services/api';
import { NAMESPACE, CONFIG_MAP } from '@shell/config/types';
import NodeInfo from './NodeInfo.vue';
import { getConfig } from '../../config/api';
const { ENVIRONMENT_CLUSTER, STACK, VANGUARD_API } = getConfig()
export default {
  name: 'EnvironmentCreateForm',
  components: {
    Select,
    CardSelect,
    ModalStatus,
    // SubnetCreate
    NodeInfo
  },
  data() {
    const sizes = ENVIRONMENT_SIZES;
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
        networkType: 'Express',
        network: null,
        enableGithub: false,
        enableKeyvault: false,
        userDataTemplate: null,
        // subnets: [],
        namespace: ''
      },
      sizes,
      // networkType: [
      //   'Express',
      //   'Isolated',
      // ],
      networkType: [
        { label: 'Express', value: 'Express', disabled: false },
        { label: 'Isolated', value: 'Isolated', disabled: true },
      ],
      namespaceList: []
    }
  },
  computed: {
    generatedNetworkName() {
      const network = this.selected.networkType === 'Isolated' ? "vnet-" : "express-"

      return network + this.selected.envName
    },
    nodeInfo () {
      if (!this.selected.size) return {}
      return this.sizes.find((size) => size.size === this.selected.size) || {}
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
  async fetch() {
    if (this.$store.getters['management/schemaFor'](NAMESPACE)) {
      const namespace = await this.$store.dispatch('management/findAll', { type: NAMESPACE })
      console.log(`namespace`, namespace.map((n) => n.metadata?.name))
      this.namespaceList = namespace.map((n) => n.metadata?.name)
    }

    if (this.$store.getters['cluster/schemaFor'](CONFIG_MAP)) {
      // const configMaps = await harvesterService.getConfigMaps()
      const configMaps = await this.$store.dispatch('cluster/findAll', { type: CONFIG_MAP })
      const userDataOptions = [];
      const networkDataOptions = [];

      (configMaps.data || []).map((O) => {
        const cloudTemplate =
          O.metadata?.labels?.[HCI_ANNOTATIONS.CLOUD_INIT];

        if (cloudTemplate === 'user') {
          userDataOptions.push({
            label: O.metadata.name,
            value: O.data.cloudInit
          });
        }

        if (cloudTemplate === 'network') {
          networkDataOptions.push({
            label: O.metadata.name,
            value: O.data.cloudInit
          });
        }
      });

      if (userDataOptions.length > 0) this.selected.userDataTemplate = userDataOptions[0].label
    }

    const envResponse = await this.$store.dispatch('cluster/findAll', { type: 'stacks' })
    console.log(`envResponse`, envResponse)
  },
  methods: {
    addSubnet (subnets) {
      this.selected.subnets = subnets
    },
    createEnv () {
      this.savingModalState = true

      const payload = {
        apiVersion: `${VANGUARD_API}`,
        kind: "Stack",
        metadata: {
          name: '',
          namespace: 'default',
          annotations: {
            team: this.selected.teamName,
            org: this.selected.orgName,
            'rancher-uid': '',
          },
        },
        spec: {
          clusterSize: this.selected.size.toLocaleLowerCase(),
          networkType: this.selected.networkType.toLocaleLowerCase(),
          networkPolicy: this.selected.networkType,
          environmentName: this.selected.envName
        }
      };

      console.log(`payload`, payload)

      setTimeout(() => {
        this.saving.cluster = true
        this.saving.networks = true
      }, 1500)
    },
    closeEnv() {
      this.$router.push({
        name: `${PRODUCT_NAME}-c-cluster-${HOME}`,
        params: {
          cluster: ENVIRONMENT_CLUSTER
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
  .input-container {
    width: 470px !important
  }

  .env-form-container {
    // display: flex;

    // .left-form {
    //   flex: 1
    // }

    // .right-form {
    //   flex: 1
    // }

    .size-description-list {
      list-style: none;
      padding-left: 0;
      line-height: 20px;
      li i {
        color: green;
        margin-right: 10px;
      }
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