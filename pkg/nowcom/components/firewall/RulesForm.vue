<template>
  <div>
    <h1 class="text-label">Add {{ ruleType }} security rule</h1>
    <p class="mt-0">{{ vnetId }}</p>

    <div class="mt-30 rules-form-container">
      <LabeledSelect :options="listing.source" v-model="form.source" label="Source" />

      <div v-if="form.source === 'IP Addresses'" class="add-form-row mt-15">
        <label for="sourcePort">Source IP addresses/CIDR ranges</label>
        <input
            v-model="form.sourceIp"
            type="text"
            placeholder="10.0.0.0/24 or 2001:1234::/64"
            class="mt-5"
        />
      </div>

      <LabeledSelect v-if="form.source === 'Service Tag'" :options="listing.sourceServiceTag" v-model="form.sourceServiceTag" label="Source service tag" class="mt-15"/>

      <div class="add-form-row mt-15">
        <label for="sourcePort">Source Port Ranges</label>
        <input
            v-model="form.sourcePort"
            type="text"
            placeholder=""
            class="mt-5"
        />
      </div>

      <LabeledSelect :options="listing.source" v-model="form.destination" label="Destination" class="mt-15"/>
      <LabeledSelect :options="listing.service" v-model="form.service" label="Service" class="mt-15"/>

      <div class="add-form-row mt-15">
        <label for="sourcePort">Destination Port Ranges</label>
        <input
            v-model="form.destinationPortRanges"
            type="text"
            placeholder=""
            class="mt-5"
        />
      </div>

      <RadioButtons class="mt-15" :options="['Any', 'TCP', 'UDP', 'ICMPv4']" v-model="form.protocol" name="protocol" title="Protocol"/>
      <RadioButtons class="mt-15" :options="['Allow', 'Deny']" v-model="form.action" name="action" title="Action"/>

      <div class="add-form-row mt-15">
        <label for="sourcePort">Priority</label>
        <input
            v-model="form.priority"
            type="text"
            placeholder=""
            class="mt-5"
        />
      </div>

      <div class="add-form-row mt-15">
        <label for="sourcePort">Name</label>
        <input
            v-model="form.name"
            type="text"
            placeholder=""
            class="mt-5"
        />
      </div>

      <div class="add-form-row mt-15">
        <label for="sourcePort">Description</label>
        <textarea
            v-model="form.description"
            rows="5"
            class="mt-5"
        ></textarea>
      </div>

      <div class="add-form-row mt-15 mb-30">
        <cButton class="cbtn btn-primary" :disabled="saving" @click="">
            <template v-if="!saving">
                <i class="fa fa-plus fa-lg mr-5"></i> Add
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
import InputWithSelect from '@shell/components/form/InputWithSelect.vue';
import RadioButtons from '../common/RadioButtons.vue';
import cButton from '../common/Button'
export default {
  name: 'RulesForm',
  props: {
    ruleType: {
      type: String,
      required: true
    },
    vnetId: {
      type: String,
      required: true
    }
  },
  components: {
    LabeledSelect,
    InputWithSelect,
    RadioButtons,
    cButton
  },
  data() {
    return {
      saving: false,
      listing: {
        source: ['Any', 'IP Addresses', 'Service Tag'],
        service: ['Custom', 'HTTP', 'HTTPS', 'SSH', 'MySQL', 'MS SQL', 'PostgreSQL', 'FTP', 'Windows Admin Center'],
        sourceServiceTag: ['Internet', 'Virtual Network', 'AzureLoadBalancer', 'ActionGroup', 'ApiManagement', 'AppService', 'AzureBackup', 'AzureBotService', 'AzureCloud'],
      },
      form: {
        source: 'Any',
        sourceIp: '',
        sourceServiceTag: 'Internet',
        sourcePort: '*',
        destination: 'Any',
        service: 'Custom',
        destinationPortRanges: '8080',
        protocol: 'Any',
        action: 'Allow',
        priority: 110,
        name: '',
        description: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.rules-form-container {
  overflow-y: auto;
  height: 80vh;
}
  
</style>