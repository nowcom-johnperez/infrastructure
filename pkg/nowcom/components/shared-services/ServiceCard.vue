<script>
import { Card } from '@components/Card';
import { BadgeState } from '@components/BadgeState';
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
    getBadgeColor (status) {
      let color = 'clickable ml-20 mr-20'

      if (status === 'Pending') {
        color += ' bg-info'
      } else if (status === 'Approved') {
        color += ' bg-success'
      } else {
        color += ' bg-error'
      }

      return color;
    },
    getServiceIcon (service) {
      let icon = 'fa-database'
      if (service === 'Elasticsearch') {
        icon = 'fa-search'
      } else if (service === 'Redis') {
        icon = 'fa-server'
      } else {
        icon = 'fa-database'
      }
      return icon;
    },
  }
};
</script>

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
          :color="getBadgeColor(service.status)"
          />
        </div>
      </div>
    </template>
    <template #body>
      <div class="shared-service-content">
       <div class="img-service">
        <i :class="`fa fa-3x ${getServiceIcon(service.service)}`"></i>
       </div>
       <div class="service-descriptions">
        <h3>{{ service.service }}</h3>
        <p>{{ service.description }}</p>
        <p class="mt-10">{{ service.environment }}</p>
       </div>
      </div>
    </template>
    <template #actions>
      <button class="btn role-primary btn-sm">
        View
      </button>
    </template>
  </Card>
</template>

<style lang="scss" scoped>
@import "@shell/assets/styles/fonts/_icons.scss";

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
