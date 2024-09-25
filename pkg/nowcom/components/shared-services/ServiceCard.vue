<template>
  <Card class="service-card" :show-highlight-border="false" :sticky="true" v-if="service">
    <template #title>
      <div style="width: 100%; display: flex">
        <div style="font-size: 1.2rem; margin-right: auto;">
          {{ service.name }}
        </div>
        <div class="shared-services-status">
          <BadgeState
          :label="service.status"
          :color="badgeColor(service.status)"
          />
        </div>
      </div>
    </template>
    <template #body>
      <div class="shared-service-content">
       <div class="img-service">
        <i :class="`fa fa-3x ${serviceIcon(service.service)}`"></i>
       </div>
       <div class="service-descriptions">
        <h3>{{ service.service }}</h3>
        <p>{{ service.description }}</p>
        <p class="mt-10">{{ service.environment }}</p>
       </div>
      </div>
    </template>
    <template #actions>
      <button type="button" class="btn role-primary btn-sm" @click="viewItem">
        View
      </button>
    </template>
  </Card>
</template>

<script>
import { Card } from '@components/Card';
import { BadgeState } from '@components/BadgeState';
import { getBadgeColor, getServiceIcon } from '../../services/helpers/shared-service';
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
  name: 'ServiceCard',
  methods: {
    badgeColor (status) {
      return getBadgeColor(status)
    },
    serviceIcon (service) {
      return getServiceIcon(service)
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
  .service-card {
    border: 1px solid #fff
  }
}

.service-card {
  padding: 10px;
  ::v-deep .card-body {
    overflow: hidden !important;
  }

  .shared-service-content {
    display: flex;
    align-items: center;
    padding: 1.5rem;
    text-align: left;
    transition: transform 0.3s, box-shadow 0.3s;

    .img-service {
      margin-right: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .service-descriptions h3 {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }

    .card-icon {
      font-size: 2.5rem;
    }
  }
}
</style>
