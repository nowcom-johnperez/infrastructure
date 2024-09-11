<script>
import { Card } from '@components/Card';
import { ENVIRONMENT_SIZES } from '../../config/constants';
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
  name: 'EnvironmentCard',
  data() {
    const sizes = ENVIRONMENT_SIZES;
    return {
      sizes
    }
  },
  computed: {
    serviceSize() {
      return this.sizes.find((d) => d.size === this.service.size)
    }
  },
  methods: {
    getBadgeColor (status) {
      let color = 'clickable ml-20 mr-20'

      if (status === 'Processing') {
        color += ' bg-info'
      } else if (status === 'Done') {
        color += ' bg-success'
      } else {
        color += ' bg-error'
      }

      return color;
    },
  }
};
</script>

<template>
  <Card class="environment-card" :show-highlight-border="false" :sticky="true" v-if="service">
    <template #title>
      <div style="width: 100%; display: flex">
        <div style="font-size: 1.2rem; margin-right: auto;">
          {{ service.name }}
        </div>
        <div class="environment-status">
          <BadgeState
          :label="service.status"
          :color="getBadgeColor(service.status)"
          />
        </div>
      </div>
    </template>
    <template #body>
      <div class="environment-size-description">
        <p style="font-size: 1.2rem">{{ service.size }}</p>
        <ul>
          <li v-for="(desc, index) in serviceSize.description" :key="index">
            <i class="fa fa-check"></i> {{ desc }}
          </li>
        </ul>
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
      list-style: none; /* Remove the default bullet */
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;

      i {
        color: #28a745; /* Green color for the checkmark */
        margin-right: 0.5rem;
      }
    }
  }
}
</style>
