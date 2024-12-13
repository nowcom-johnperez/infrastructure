<template>
  <Card class="environment-card" :show-highlight-border="false" :sticky="true" v-if="service">
    <template #title>
      <div class="title-container w-100">
        <div class="title-text">
          {{ service.spec.environmentName }}
        </div>
        <button v-if="canDelete" class="btn btn-sm btn-danger" @click="deleteItem">
          <i class="icon icon-trash" />
        </button>
      </div>
      
    </template>
    <template #body>
      <div class="environment-details">
        <div class="detail-item">
          <i class="fa fa-server detail-icon"></i>
          <span class="detail-label">Size:</span>
          <span class="detail-value">{{ service.spec.clusterSize }}</span>
        </div>
        <div class="detail-item">
          <i class="fa fa-shield detail-icon"></i>
          <span class="detail-label">FW Policy:</span>
          <span class="detail-value">{{ service.spec.networkPolicy }}</span>
        </div>
        <div class="detail-item">
          <i class="fa fa-globe detail-icon"></i>
          <span class="detail-label">DNS:</span>
          <span class="detail-value">
            <template v-if="service.dns.length > 0">
              <CopyToClipboardText v-for="dns in service.dns" :key="`${dns}-${service.spec.environmentName}`" :text="dns" class="mr-5" />
            </template>
            <span v-else>not available</span>
          </span>
        </div>
      </div>
      <div class="node-info">
        <EnvironmentStatus :statuses="service.statuses" />
      </div>
    </template>
    <template #actions>
      <a v-if="service?.clusterId !== 'Pending'" :href="`/c/${service.clusterId}/explorer#cluster-events`" @click.prevent="exploreCluster(service.clusterId)" class="btn role-secondary btn-sm">
        Explore
      </a>
      <button type="button" @click="viewItem" class="btn role-secondary btn-sm ml-auto">
        Manage
      </button>
    </template>
  </Card>
</template>


<script>
import { Card } from '@components/Card';
import EnvironmentStatus from './EnvironmentStatus.vue';
import { CAPI } from '@shell/config/types';
import { ENVIRONMENT_SIZES } from '../../config/constants';
import { BadgeState } from '@components/BadgeState';
import { EventBus } from '../../config/event-bus';
import { getBadgeColor } from '../../services/helpers/environment'
import CopyToClipboardText from '@shell/components/CopyToClipboardText.vue'
export default {
  name: 'EnvironmentCard',
  components: {
    Card,
    BadgeState,
    EnvironmentStatus,
    CopyToClipboardText
  },
  props: {
    service: {
      type: Object,
      default: null,
    },
  },
  data() {
    const sizes = ENVIRONMENT_SIZES;
    return {
      sizes
    }
  },
  computed: {
    serviceSize() {
      return this.sizes.find((d) => d.size.toLowerCase() === this.service.size.toLowerCase())
    },
    canDelete() {
      const schema = this.$store.getters['management/schemaFor'](CAPI.RANCHER_CLUSTER);
      return !!schema?.resourceMethods.find((x) => x.toLowerCase() === 'delete');
    },
  },
  methods: {
    badgeColor(status) {
      return getBadgeColor(status, true)
    },
    checkStatus() {
      EventBus.$emit('env-modal-status', this.service)
    },
    viewItem() {
      this.$emit('view-click', this.service)
    },
    deleteItem() {
      EventBus.$emit('env-modal-delete', this.service)
    },
    exploreCluster(clusterId) {
      this.$router.push(`/c/${clusterId}/explorer#cluster-events`)
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@shell/assets/styles/fonts/_icons.scss";

.theme-dark {
  .environment-card {
    border: 1px solid #fff;

    .environment-details {
      .detail-icon {
        color: #fff;
      }
      .detail-value {
        color: #fff;
      }
    }
  }

  .policy-text {
    color: #fff !important;
  }
}

.environment-card {
  padding: 10px;
  border: 1px solid #dcdee7;

  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .btn-danger {
    margin-top: 0;
    padding: 5px 8px;
    display: flex;
    align-items: center;
  }

  .title-text {
    font-size: 1.5rem;
    font-weight: bold;
    margin-right: auto;
  }

  .status-badge {
    cursor: pointer;
  }

  .environment-details {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 10px 0;

    .detail-item {
      display: flex;
      align-items: center;
      font-size: 1rem;
      flex: 1 1 45%;
    }

    .detail-icon {
      margin-right: 5px;
      color: #000;
    }

    .detail-label {
      font-weight: bold;
      margin-right: 5px;
    }

    .detail-value {
      color: #000;
    }
  }

  .node-info {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}

</style>
