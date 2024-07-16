<template>
  <div>
    <h1 class="text-label">Add {{ ruleType }} security rule</h1>
    <p class="mt-0">{{ vnetId }}</p>

    <div class="mt-30 rules-form-container">
      <LabeledSelect :options="listing.source" v-model="form.source" label="Source" />

      <div v-if="form.source === 'IP Address'" class="add-form-row mt-15">
        <label for="sourcePort">Source IP addresses/CIDR ranges</label>
        <input
          v-model="form.sourceIp"
          type="text"
          placeholder="10.0.0.0/24 or 2001:1234::/64"
          class="mt-5"
        />
      </div>

      <!-- vnet selection -->

      <!-- subnet from selected vnet  -->

      <LabeledSelect v-if="form.source === 'Vnet'" :options="vnets" v-model="form.sourceVnet" label="Virtual Network" class="mt-15"/>
      <LabeledSelect v-if="form.source === 'Subnet'" :options="subnets" v-model="form.sourceSubnet" label="Subnets" class="mt-15"/>

      <!-- <div class="add-form-row mt-15">
        <label for="sourcePort">Source Port Ranges</label>
        <input
          v-model="form.sourcePort"
          type="text"
          placeholder=""
          class="mt-5"
        />
      </div> -->

      <LabeledSelect :options="listing.source" v-model="form.destination" label="Destination" class="mt-15"/>
      <LabeledSelect :options="listing.application" v-model="form.application" label="Application" class="mt-15"/>

      <div v-if="form.application === 'custom'" class="add-form-row mt-15">
        <label for="destinatinoPortRanges">Destination Port Ranges</label>
        <input
          v-model="form.destinationPortRanges"
          type="text"
          placeholder=""
          class="mt-5"
        />
      </div>

      <RadioButtons class="mt-15" :options="['Allow', 'Deny']" v-model="form.action" name="action" title="Action"/>

      <div class="add-form-row mt-15">
        <label for="priority">Priority</label>
        <input
          v-model.number="form.priority"
          type="text"
          placeholder=""
          class="mt-5"
        />
      </div>

      <div class="add-form-row mt-15">
        <label for="name">Name</label>
        <input
          v-model="form.name"
          type="text"
          placeholder=""
          class="mt-5"
        />
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
import RadioButtons from '../common/RadioButtons.vue';
import cButton from '../common/Button'
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
        sourceServiceTag: ['Internet', 'Virtual Network', 'AzureLoadBalancer', 'ActionGroup', 'ApiManagement', 'AppService', 'AzureBackup', 'AzureBotService', 'AzureCloud'],
      },
      form: {
        source:                'Any',
        sourceIp:              '',
        sourceVnet:            '',
        sourceSubnet:          '',
        sourceServiceTag:      'Internet',
        sourcePort:            '*',
        destination:           'Any',
        application:           'custom',
        destinationPortRanges: '8080',
        protocol:              'Any',
        action:                'Allow',
        priority:              110,
        name:                  '',
        description:           ''
      }
    }
  },
  computed: {
    isFormComplete() {
      return this.form.name && this.form.source && this.form.destination ? true : false
    }
  },
  methods: {
    async save() {
      const payload = {
        name:    this.form.name.toLowerCase(),
        direction: this.ruleType,
        vnet: this.vnetId,
        source: this.form.source,
        destination: this.form.destination,
        application: this.form.application.split(/,\s*/),
        action: this.form.action,
        description: this.form.description,
        priority: this.form.priority,
      }

      if (this.form.application === 'custom') {
        payload.destinationPortRanges = this.form.destinationPortRanges.split(/,\s*/);
      }

      if (this.form.source === 'IP Address') {
        payload.sourceIpAddress = this.form.sourceIp.split(/,\s*/);
      }
      if (this.form.source === 'Vnet') {
        payload.sourceVnet = this.form.sourceVnet;
      }
      if (this.form.source === 'Subnet') {
        payload.sourceSubnet = this.form.sourceSubnet;
      }

      const firewallData = {
          apiVersion: `${API}/${API_VERSION}`,
          kind:       'SecurityRule',
          metadata:   {
              name:      this.form.name.toLowerCase(),
              namespace: 'default'
          },
          spec: payload
      };
      
      console.log(`firewallData`, firewallData)

      try {
        this.saving = true
        await firewallService.createFirewall(firewallData)
        this.closeForm()
      } catch (err) {
        console.error(err);
        this.$store.dispatch('growl/error', {
          title: 'Error',
          message: 'Error Saving Firewall Rules',
        })
      } finally {
        this.saving = false
      }
    },
    async fetchApplicationList() {
      const res = await firewallService.getApplicationList()
      this.listing.application = res.data.items.map((d) => d.spec.name)
    },
    closeForm() {
      this.$emit('onClose')
    }
  },
  mounted() {
    this.fetchApplicationList()
  }
}
</script>

<style lang="scss" scoped>
.rules-form-container {
  overflow-y: auto;
  height: 80vh;
}
</style>
