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
        <span v-if="errors.envName" class="text-danger">{{ errors.envName }}</span>

        <div class="mt-15 input-container">
          <label for="networkType">Namespace <span class="text-danger">*</span></label>
          <Select :options="namespaceList" v-model="selected.namespace" class="mt-5"/>
        </div>
        <span v-if="errors.namespace" class="text-danger">{{ errors.namespace }}</span>
  
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
  
        <div class="mt-15 input-container">
          <label for="networkType">Network Policy <span class="text-danger">*</span></label>
          <Select :options="networkPolicy" v-model="selected.networkPolicy" class="mt-5"/>
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
          <label for="orgName">Organization Name <span class="text-danger">*</span></label>
          <input type="text" class="mt-10" name="orgName" v-model="selected.orgName" placeholder="Organization Name" required />
          <span class="info-icon" v-clean-tooltip="'Organization Name'">
            <i class="fa fa-info-circle" aria-hidden="true"></i>
          </span>
        </div>
        <span v-if="errors.orgName" class="text-danger">{{ errors.orgName }}</span>
  
        <div class="input-container mt-15">
          <label for="orgName">Team Name <span class="text-danger">*</span></label>
          <input type="text" class="mt-10" name="orgName" v-model="selected.teamName" placeholder="Team Name" required />
          <span class="info-icon" v-clean-tooltip="'Team Name'">
            <i class="fa fa-info-circle" aria-hidden="true"></i>
          </span>
        </div>
        <span v-if="errors.teamName" class="text-danger">{{ errors.teamName }}</span>
  
        <div class="team-header input-container mt-30">
          <div>
            <h1>Team Access</h1>
          </div>
          <div>
            <button type="button" class="btn role-primary btn-sm ml-auto" @click="addMember">Add</button>
          </div>
        </div>

        <div v-for="(role, ctr) in selected.owners" :key="`${ctr}_owners`" class="row-detail input-container">
          <div class="row-label">
            <Principal 
              :key="role"
              :value="role" />
          </div>
          <div class="row-val">
            <button v-if="selected.owners.length > 1" type="button" @click="removeOwner(ctr)" class="btn btn-danger btn-sm">remove</button>
          </div>
        </div>

        <div v-for="(role, ctr) in selected.members" :key="`${ctr}_members`" class="row-detail input-container">
          <div class="row-label">
            <Principal 
              :key="role"
              :value="role" />
          </div>
          <div class="row-val">
            <button type="button" @click="removeMember(ctr)" class="btn btn-danger btn-sm">remove</button>
          </div>
        </div>

        <div v-if="false" class="checkbox-content mt-15">
          <input type="checkbox" id="githubRepo" v-model="selected.enableGithub" />
          <label for="githubRepo">Create New Github Repo</label>
        </div>

        <div v-if="false" class="checkbox-content mt-15">
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

    <ModalStatus v-if="savingModalState" header-label="Status" :environment-id="saving.envId" :saving-modal-state="savingModalState" @onClose="closeEnv"/>
    <ModalRoles :saving-modal-state="openModalRole" @onClose="openModalRole = false" :onAdd="onAddMember" />
  </div>
</template>

<script>
import Select from '@shell/components/form/Select.vue';
import CardSelect from '../common/CardSelection.vue';
import ModalStatus from '../environment/Modal-Status.vue';
import ModalRoles from '../environment/Modal-Roles.vue';
import SelectPrincipal from '@shell/components/auth/SelectPrincipal';
import { HOME, PRODUCT_NAME, ENVIRONMENT_SIZES, BLANK_CLUSTER } from '../../config/constants';
import { HCI as HCI_ANNOTATIONS } from '@shell/config/labels-annotations';
import { environmentService, harvesterService } from '../../services/api';
import { CONFIG_MAP } from '@shell/config/types';
import { validateString } from '../../services/helpers/utils'
import NodeInfo from './NodeInfo.vue';
import { getConfig } from '../../config/api';
const { ENVIRONMENT_CLUSTER, STACK, VANGUARD_API, BREACHER_API } = getConfig()
export default {
  name: 'EnvironmentCreateForm',
  components: {
    Select,
    CardSelect,
    ModalStatus,
    SelectPrincipal,
    NodeInfo,
    ModalRoles
  },
  data() {
    const sizes = ENVIRONMENT_SIZES;
    return {
      savingModalState: false,
      openModalRole: false,
      saving: {
        envId: ''
      },
      errors: {},
      selected: {
        envName: '',
        size: 'Small',
        orgName: '',
        teamName: '',
        networkType: 'express',
        networkPolicy: 'standard-dev',
        network: null,
        enableGithub: false,
        enableKeyvault: false,
        userDataTemplate: null,
        // subnets: [],
        namespace: '',
        owners: [],
        members: []
      },
      sizes,
      networkType: [
        { label: 'Express', value: 'express', disabled: false },
        { label: 'Isolated', value: 'isolated', disabled: true },
      ],
      networkPolicy: [
        { label: 'Standard Dev', value: 'standard-dev', disabled: false },
      ],
      namespaceList: [],
      bindings: [],
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
    },
    user() {
      return this.$store.getters['auth/v3User']
    },
  },
  async fetch() {

    try {
      const namespaces = await harvesterService.getNamespaces()
      const excludePrefixes = ['cattle-', 'kube-', 'longhorn-', 'fleet-', 'harvester-', 'local'];
      this.namespaceList = namespaces
        .filter(n => !excludePrefixes.some(prefix => n.metadata?.name.includes(prefix)))
        .map(n => n.metadata?.name);
    } catch (error) {
      this.namespaceList = []
    }

    try {
      // page must be attached to a cluster
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
    } catch (error) {
      this.selected.userDataTemplate = null
    }

    this.bindings.push({
      roleTemplateId: 'cluster-owner',
      userPrincipalId: this.user.principalIds[0]
    })

    this.filterBindings()
  },
  methods: {
    validateForm() {
      this.errors = {}
      if (!this.selected.envName) this.errors.envName = 'Environment Name is required'
      if (this.selected.envName && !validateString(this.selected.envName)) this.errors.envName = 'Environment Name is not allowed. avoid space and other special characters'
      if (!this.selected.orgName) this.errors.orgName = 'Organization Name is required'
      if (this.selected.orgName && !validateString(this.selected.orgName)) this.errors.orgName = 'Organization Name is not allowed. avoid space and other special characters'
      if (!this.selected.teamName) this.errors.teamName = 'Team Name is required'
      if (this.selected.teamName && !validateString(this.selected.teamName)) this.errors.teamName = 'Team Name is not allowed. avoid space and other special characters'
      if (!this.selected.namespace) this.errors.namespace = 'Namespace is required'
      return Object.keys(this.errors).length === 0
    },
    filterBindings() {
      const bindings = [...this.bindings]
      this.selected.owners = bindings.filter((role) => role.roleTemplateId === 'cluster-owner').map((role) => role?.userPrincipalId || role?.groupPrincipalId)
      this.selected.members = bindings.filter((role) => role.roleTemplateId !== 'cluster-owner').map((role) => role?.userPrincipalId || role?.groupPrincipalId)
    },

    removeMember(index) {
      const userId = this.selected.members[index]
      const bindingIndex = this.bindings.findIndex((r) => r.roleTemplateId !== 'cluster-owner' && (r.userPrincipalId === userId || r.groupPrincipalId === userId))
      if (bindingIndex >= 0) {
        this.bindings.splice(bindingIndex, 1)
      }
      this.filterBindings()
    },

    removeOwner(index) {
      const userId = this.selected.members[index]
      const bindingIndex = this.bindings.findIndex((r) => r.roleTemplateId === 'cluster-owner' && (r.userPrincipalId === userId || r.groupPrincipalId === userId))

      if (bindingIndex >= 0) {
        this.bindings.splice(bindingIndex, 1)
      }
      this.filterBindings()
    },

    async addMember() {
      this.openModalRole = true
    },

    onAddMember(bindings) {
      this.$set(this, 'bindings', [...this.bindings, ...bindings]);
      // process bindings
      this.filterBindings()
    },

    async createEnv () {
      try {
        const isValid = this.validateForm()
        if (!isValid) return
        const clusterName = `${this.selected.envName}-${this.selected.teamName}`
        const payload = {
          apiVersion: `${VANGUARD_API}`,
          kind: "Stack",
          metadata: {
            name: clusterName,
            namespace: 'vanguard-system',
            annotations: {
              [`${BREACHER_API}/team`]: this.selected.teamName,
              [`${BREACHER_API}/org`]: this.selected.orgName,
              [`${BREACHER_API}/rancher-uid`]: this.user.id,
              [`${BREACHER_API}/owners`]: JSON.stringify(this.selected.owners),
              [`${BREACHER_API}/members`]: JSON.stringify(this.selected.members),
              [`${BREACHER_API}/namespace`]: this.selected.namespace,
            },
          },
          spec: {
            clusterSize: this.selected.size.toLocaleLowerCase(),
            networkType: this.selected.networkType.toLocaleLowerCase(),
            networkPolicy: this.selected.networkPolicy,
            environmentName: clusterName
          }
        };

        await environmentService.create(payload)

        this.savingModalState = true
        this.saving.envId = clusterName
      } catch (error) {
        this.$store.dispatch('growl/error', {
          title: 'Error',
          message: 'Something went wrong! Please contact your administrator.',
        }, { root: true })
      }
    },
    closeEnv() {
      this.$router.push({
        name: `${PRODUCT_NAME}-c-cluster-${HOME}`,
        params: {
          cluster: BLANK_CLUSTER
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
  .team-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

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