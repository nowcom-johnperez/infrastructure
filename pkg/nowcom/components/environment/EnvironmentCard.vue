<template>
  <Card class="environment-card" :show-highlight-border="false" :sticky="true" v-if="service">
    <template #title>
      <div style="width: 100%; display: flex">
        <div style="font-size: 1.2rem; margin-right: auto;">
          {{ service.name }}
        </div>
        <div class="environment-status" @click="checkStatus">
          <BadgeState
          :label="service.status"
          :color="badgeColor(service.status)"
          />
        </div>
      </div>
    </template>
    <template #body>
      <div class="environment-size-description">
        <p style="font-size: 1.2rem"><span class="policy-text">Size:</span> {{ service.size }}</p>
        <ul>
          <li v-for="(desc, index) in serviceSize.description" :key="index">
            <i class="fa fa-check"></i> {{ desc }}
          </li>
        </ul>

        <p style="font-size: 1.2rem"><span class="policy-text">Firewall Policy:</span> {{ service.firewallPolicy }}</p>
      </div>

      
    </template>
    <template #actions>
      <button type="button" @click="viewItem" class="btn role-primary btn-sm">
        View
      </button>
    </template>
  </Card>
</template>

<script>
import { Card } from '@components/Card';
import { ENVIRONMENT_SIZES } from '../../config/constants';
import { BadgeState } from '@components/BadgeState';
import { EventBus } from '../../config/event-bus';
import { getBadgeColor } from '../../services/helpers/environment'
export default {
  components: {
    Card,
    BadgeState
  },
  props: {
    service: {
      type: Object,
      default: null,
    },
  },
  name: 'EnvironmentCard',
  data() {
    const sizes = ENVIRONMENT_SIZES;
    return {
      sizes
    }
  },
  computed: {
    serviceSize() {
      return this.sizes.find((d) => d.size.toLowerCase() === this.service.size.toLowerCase())
    }
  },
  methods: {
    badgeColor(status) {
      return getBadgeColor(status)
    },
    checkStatus() {
      EventBus.$emit('env-modal-status', this.service)
    },
    viewItem() {
      this.$emit('view-click', this.service)
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@shell/assets/styles/fonts/_icons.scss";

.theme-dark {
  .environment-card {
    border: 1px solid #fff
  }

  .policy-text {
    color: #fff !important;
  }
}

.environment-card {
  padding: 10px;
  ::v-deep .card-body {
    overflow: hidden !important;
  }

  .environment-size-description {
    ul {
      padding-left: 0;
    }

    li {
      list-style: none;
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;

      i {
        color: #28a745;
        margin-right: 0.5rem;
      }
    }

    .policy-text {
      font-weight: bold;
      color: #000;
    }
  }
}
</style>
