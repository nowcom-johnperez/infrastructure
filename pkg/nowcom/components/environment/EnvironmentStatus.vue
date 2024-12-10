<template>
  <div class="status-presentation" >
    <p v-if="showLabel" class="text-lg mb-5">Status</p>
    <div class="usage">
      <Bar
      :percentage="100"
      :primaryColor="gradientStyle"
      secondaryColor="--border"
      :slices="slices" 
      :style="{ background: gradientStyle }"
      v-tooltip="statusTooltip"
      />
      <span v-tooltip="statusTooltip" class="w-100 clickable">
        {{ statusPercentages.counts.active }} / {{ Object.keys(statuses).length }}
      </span>
    </div>
  </div>
</template>

<script>
import Bar from '@shell/components/graph/Bar';
export default {
  name: 'StatusInfo',
  props: {
    statuses: {
      type: Object,
      required: true
    },
    showUsage: {
      type: Boolean,
      default: false
    },
    showLabel: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Bar
  },
  computed: {
    statusTooltip() {
      let tooltip = ''
      if (this.statuses.network) tooltip += `<span class="${this.getTextStatusColor(this.statuses.network)}">Vnet Creation</span> <br />`
      if (this.statuses.networkPolicy) tooltip += `<span class="${this.getTextStatusColor(this.statuses.networkPolicy)}">Network Policy</span> <br />`
      if (this.statuses.clusterCreation) tooltip += `<span class="${this.getTextStatusColor(this.statuses.clusterCreation)}">Cluster creation</span> <br />`
      if (this.statuses.certificateServices) tooltip += `<span class="${this.getTextStatusColor(this.statuses.certificateServices)}">Certificate services</span> <br />`
      if (this.statuses.dns) tooltip += `<span class="${this.getTextStatusColor(this.statuses.dns)}">DNS</span> <br />`
      return tooltip
    },

    statusPercentages() {
      const total = Object.keys(this.statuses).length;

      const counts = {
        active: Object.values(this.statuses).filter(s => s === 'active').length,
        warning: Object.values(this.statuses).filter(s => s === 'warning').length,
        inactive: Object.values(this.statuses).filter(s => s === 'inactive').length
      };

      return {
        active: (counts.active / total) * 100,
        warning: (counts.warning / total) * 100,
        inactive: (counts.inactive / total) * 100,
        counts
      };
    },

    gradientStyle() {
      const { active, warning, inactive } = this.statusPercentages;
      return `linear-gradient(to right, 
        var(--primary) 0%,
        var(--primary) ${active}%,
        var(--warning) ${active}%,
        var(--warning) ${active + warning}%,
        var(--error) ${active + warning}%,
        var(--error) 100%)`;
    },

    slices() {
      const { active, warning } = this.statusPercentages;
      return [active, active + warning]; // Positions of transitions
    },

    totalStatusCount() {
      return Object.keys(this.statuses).length
    },
  },

  methods: {
    getTextStatusColor(status) {
      let text = 'text-'
      if (status === 'active') {
        text += 'primary'
      } else if (status === 'warning') {
        text += 'warning'
      } else {
        text += 'error'
      }
      return text
    }
  }
}
</script>


<style lang="scss" scoped>
  .status-presentation {
    align-items: center;
    text-align: center;

    .role {
      font-weight: bold;
      font-size: small;
    }

    .usage {
      display: flex;
      flex-direction: column;
      align-items: center;

      span {
        margin-top: 0.5rem;
        font-size: 0.9rem;
      }
    }

    .resources {
      display: flex;
      flex-direction: column;
      align-items: center;

      .label {
        font-size: 0.8rem;
        color: gray;
        margin-bottom: 0.3rem;
      }
    }
  }
</style>