<template>
  <div>
    <h1 class="text-label">{{ labelHeader }} {{ ruleType }} security rule</h1>
    <p class="mt-0">{{ vnetId }}</p>

    <div class="mt-30 rules-form-container">
      <LabeledSelect :options="listing.source" v-model="form.source" label="Source" required/>

      <div v-if="form.source === 'IP Address'" class="add-form-row mt-15">
        <label for="sourceIP">Source IP addresses/CIDR ranges <span class="text-danger">*</span></label>
        <input
          v-model="form.sourceIp"
          type="text"
          placeholder="10.0.0.0/24"
          class="mt-5"
        />
        <span v-if="errors.sourceIp" class="text-danger">{{ errors.sourceIp }}</span>
      </div>

      <div v-if="form.source === 'Vnet'" class="add-form-row mt-15">
        <label for="sourceVirtualNetwork">Source Virtual Network</label>
        <input
          :value="vnetId"
          type="text"
          disabled
          class="mt-5"
        />
      </div>

      <LabeledSelect id="sourceSubnet" name="sourceSubnet" ref="sourceSubnet" v-if="form.source === 'Subnet'" :options="subnets" v-model="form.sourceSubnet" label="Source Subnets" class="mt-15" required multiple/>
      <span v-if="errors.sourceSubnet" class="text-danger">{{ errors.sourceSubnet }}</span>
      
      <!-- <div class="add-form-row mt-15">
        <label for="sourcePort">Source Port Ranges</label>
        <input
          v-model="form.sourcePort"
          type="text"
          placeholder=""
          class="mt-5"
        />
      </div> -->

      <LabeledSelect :options="listing.source" v-model="form.destination" label="Destination" class="mt-15" required/>

      <div v-if="form.destination === 'IP Address'" class="add-form-row mt-15">
        <label for="destinationIp">Destination IP addresses/CIDR ranges <span class="text-danger">*</span></label>
        <input
          v-model="form.destinationIp"
          type="text"
          placeholder="10.0.0.0/24"
          class="mt-5"
        />
        <span v-if="errors.destinationIp" class="text-danger">{{ errors.destinationIp }}</span>
      </div>

      <div v-if="form.destination === 'Vnet'" class="add-form-row mt-15">
        <label for="destinationVirtualNetwork">Destination Virtual Network</label>
        <input
          :value="vnetId"
          type="text"
          disabled
          class="mt-5"
        />
      </div>

      <LabeledSelect id="destinationSubnet" v-if="form.destination === 'Subnet'" :options="subnets" v-model="form.destinationSubnet" label="Destination Subnets" class="mt-15" required multiple />
      <span v-if="errors.destinationSubnet" class="text-danger">{{ errors.destinationSubnet }}</span>

      <LabeledSelect :options="listing.application" v-model="form.application" label="Application" class="mt-15" multiple/>

      <div v-if="form.application.includes('custom')" class="add-form-row mt-15">
        <label for="destinatinoPortRanges">Destination Port Ranges <span class="text-danger">*</span></label>
        <input
          v-model="form.destinationPortRanges"
          type="text"
          placeholder=""
          class="mt-5"
        />
        <span v-if="errors.destinationPortRanges" class="text-danger">{{ errors.destinationPortRanges }}</span>
      </div>

      <RadioButtons class="mt-15" :options="['Allow', 'Deny']" v-model="form.action" name="action" title="Action"/>

      <div class="add-form-row mt-15">
        <label for="priority">Priority 
          <span class="text-danger mr-5">*</span>
          <span class="info-icon" v-clean-tooltip="tooltipPriority">
            <i class="fa fa-info-circle" aria-hidden="true"></i>
          </span>
        </label>
        <input
          v-model.number="form.priority"
          type="text"
          placeholder=""
          class="mt-5"
        />
        
        <span v-if="errors.priority" class="text-danger">{{ errors.priority }}</span>
      </div>

      <div class="add-form-row mt-15">
        <label for="name">Name <span class="text-danger">*</span></label>
        <input
          v-model="form.name"
          type="text"
          placeholder=""
          :disabled="isEditMode"
          class="mt-5"
        />
        <span v-if="errors.name" class="text-danger">{{ errors.name }}</span>
      </div>

      <div class="add-form-row mt-15">
        <label for="description">Description</label>
        <textarea
          v-model="form.description"
          rows="5"
          class="mt-5"
        ></textarea>
      </div>

      <div class="add-form-row mt-15 mb-30">
        <cButton class="cbtn btn-primary" :disabled="saving || !isFormComplete" @click="save">
          <template v-if="!saving">
            <span v-if="!isEditMode"><i class="fa fa-plus fa-lg mr-5"></i> Add</span>
            <span v-else><i class="fa fa-pencil fa-lg mr-5"></i> Update</span>
          </template>
          <template v-else>
            <i class="fa fa-spinner fa-spin fa-lg mr-5"></i> Processing
          </template>
        </cButton>
        <cButton class="cbtn btn-light ml-5" :disabled="saving" @click="$emit('onClose')">
          Cancel
        </cButton> 
      </div>
    </div>
  </div>
</template>

<script>
import LabeledSelect from '@shell/components/form/LabeledSelect.vue';
import RadioButtons from '../common/RadioButtons.vue';
import cButton from '../common/Button'
import { ip } from '@form-validation/validator-ip';
import { firewallService } from '../../services/api/firewall'
import { getConfig } from '../../config/api';
const { API_VERSION, API } = getConfig();
export default {
  name:  'RulesForm',
  props: {
    ruleType: {
      type:     String,
      required: true
    },
    vnetId: {
      type:     String,
      required: true
    },
    vnets: {
      type: Array,
      required: true,
    },
    subnets: {
      type: Array,
      required: true,
    },
    rowData: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    LabeledSelect,
    RadioButtons,
    cButton
  },
  data() {
    return {
      saving:  false,
      listing: {
        source:           ['Any', 'IP Address', 'Subnet', 'Vnet'],
        application:      [],
      },
      form: {
        source:                'Any',
        sourceIp:              '',
        sourceSubnet:          [],
        destination:           'Any',
        destinationIp:         '',
        destinationSubnet:     [],
        application:           ['custom'],
        destinationPortRanges: '8080',
        protocol:              'Any',
        action:                'Allow',
        priority:              110,
        name:                  '',
        description:           ''
      },
      errors: {}
    }
  },
  computed: {
    isEditMode() {
      return Object.keys(this.rowData).length > 0
    },
    labelHeader() {
      return !this.isEditMode ? 'Add' : 'Edit'
    },
    isFormComplete() {
      return this.form.name && this.form.source && this.form.destination ? true : false
    },
    tooltipPriority() {
      return {
        content: `Priority tooltip placeholder`,
        hideOnTargetClick: false
      }
    },
  },
  methods: {
    validation() {
      this.errors = {}
      if (!this.form.name) this.errors.name = 'Name is required'
      if (!this.form.source) this.errors.source = 'Source is required'
      if (!this.form.destination) this.errors.destination = 'Destination is required'
      if (this.form.priority < 0 || this.form.priority > 999) this.errors.priority = 'Priority value must be from 1-999.'
      if (!this.form.priority) this.errors.priority = 'Priority is required'
      // max to 65535

      if (this.form.source === 'IP Address') {
        if (!this.form.sourceIp) this.errors.sourceIp = 'Source IP is required'
        else {
          const sourceIPList = this.form.sourceIp.split(/,\s*/);

          sourceIPList.some((ipv4) => {
            const sourceIp = ip().validate({
              value: ipv4,
              options: {
                  ipv6: false,
                  message: `The value ${ipv4} is not valid IP v4`,
              },
            });
            if (!sourceIp.valid) this.errors.sourceIp = sourceIp.message
            return !sourceIp.valid
          })
          
        }
      }

      if (this.form.source === 'Subnet') {
        if (this.form.sourceSubnet.length === 0) this.errors.sourceSubnet = 'Source Subnet is required'
      }

      if (this.form.destination === 'IP Address') {
        if (!this.form.destinationIp) this.errors.destinationIp = 'Destination IP is required'
        else {
          const destinationIPList = this.form.destinationIp.split(/,\s*/);

          destinationIPList.some((ipv4) => {
            const sourceIp = ip().validate({
              value: ipv4,
              options: {
                  ipv6: false,
                  message: `The value ${ipv4} is not valid IP v4`,
              },
            });
            if (!sourceIp.valid) this.errors.destinationIp = sourceIp.message
            return !sourceIp.valid
          })
        }
      }

      if (this.form.destination === 'Subnet') {
        if (this.form.destinationSubnet.length === 0) this.errors.destinationSubnet = 'Destination Subnet is required'
      }

      if (this.form.application.includes('custom')) {
        const destinationPortRanges = this.form.destinationPortRanges.split(/,\s*/);
        destinationPortRanges.some((port) => {
          const isValid = port < 0 || port < 65535

          if (!isValid) this.errors.destinationPortRanges = `Invalid Port: ${port}`

          return isValid
        })
      }

      const patternName = /^[a-z][-a-z0-9_]*$/;
      if (!patternName.test(this.form.name)) this.errors.name = 'Name is invalid'

      return Object.keys(this.errors).length === 0
    },
    async save() {
      if (!this.validation()) return
      const payload = {
        name:    this.vnetId + '-' + this.form.name.toLowerCase(),
        direction: this.ruleType,
        vnet: this.vnetId,
        source: this.form.source,
        destination: this.form.destination,
        application: this.form.application.map((app) => {
          return {
            name: app
          }
        }) || [],
        action: this.form.action,
        description: this.form.description,
        priority: this.form.priority,
      }

      if (this.form.source === 'IP Address') {
        payload.sourceIpAddress = this.form.sourceIp.split(/,\s*/);
      }

      if (this.form.source === 'Subnet') {
        payload.sourceSubnet = this.form.sourceSubnet;
      }

      if (this.form.destination === 'IP Address') {
        payload.destinationIpAddress = this.form.destinationIp.split(/,\s*/);
      }

      if (this.form.destination === 'Subnet') {
        payload.destinationSubnet = this.form.destinationSubnet;
      }

      if (this.form.application.includes('custom')) {
        payload.destinationPortRanges = this.form.destinationPortRanges.split(/,\s*/);
      }

      try {
        this.saving = true
        
        if (this.isEditMode) {
          // override set only name no need to append vnetId
          payload.name = this.form.name

          const firewallData = {
            apiVersion: `${API}/${API_VERSION}`,
            kind:       'SecurityRule',
            metadata:   {
                name:      this.rowData.metadata.name,
                namespace: 'default'
            },
            spec: payload
          };

          await firewallService.updateFirewall(this.rowData.metadata.name, firewallData)
        } else {
          const firewallData = {
            apiVersion: `${API}/${API_VERSION}`,
            kind:       'SecurityRule',
            metadata:   {
                name:      this.vnetId + '-' + this.form.name.toLowerCase(),
                namespace: 'default'
            },
            spec: payload
          };
          await firewallService.createFirewall(firewallData)
        }

        this.closeForm()
      } catch (err) {
        console.error(err);
        this.$store.dispatch('growl/error', {
          title: 'Error',
          message: 'Error Saving Firewall Rules',
        }, { root: true })
      } finally {
        this.saving = false
      }
    },
    async fetchApplicationList() {
      const res = await firewallService.getApplicationList()
      this.listing.application = res.data.items.map((d) => d.metadata.name)
    },
    closeForm() {
      this.$emit('onClose')
    },
    populateData() {
      if (this.isEditMode) {
        // populate data
        this.form.source = this.rowData.source
        if (this.form.source === 'IP Address') this.form.sourceIp = this.rowData.sourceIpAddress.join(', ')
        this.form.destination = this.rowData.destination
        if (this.form.destination === 'IP Address') this.form.destinationIp = this.rowData.destinationIpAddress.join(', ')
        this.form.application = this.rowData.application
        if (this.form.application.includes('custom')) this.form.destinationPortRanges = this.rowData.destinationPortRanges.join(', ')
        this.form.action = this.rowData.action
        this.form.name = this.rowData.name
        this.form.description = this.rowData.description

        setTimeout(() => {
          if (this.form.source === 'Subnet') this.form.sourceSubnet = this.rowData.sourceSubnet
          if (this.form.destination === 'Subnet') this.form.destinationSubnet = this.rowData.destinationSubnet
        }, 500)
      }
    }
  },
  mounted() {
    this.fetchApplicationList()
    this.populateData()
  }
}
</script>

<style lang="scss" scoped>
.rules-form-container {
  overflow-y: auto;
  height: 80vh;
}
</style>
