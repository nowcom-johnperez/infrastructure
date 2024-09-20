<template>
  <div class="service-detail-view">
    <div class="service-detail-header">
      <div class="service-detail-img mr-20">
        <i :class="`fa fa-4x ${serviceIcon}`"></i>
      </div>
      <div class="service-detail-info">
        <h2 class="section-title">Shared Service Information</h2>
        <p class="section-subtitle">Details about the service and its environment.</p>
      </div>
    </div>
    

    <Tabs :list="['Basic', 'Additional Information']" :current="currentTabIndex" @set-active="setTab"/>

    <div class="tab-content-container mt-40">
      <!-- Basic Information Tab -->
      <div class="tab-content" :class="{ 'show': currentTabIndex === 0 }">
        <div class="details-table">
          <div class="row-detail">
            <div class="row-label">Service Name</div>
            <div class="row-val">{{ currentObj.name }}</div>
          </div>
          
          <div class="row-detail">
            <div class="row-label">Service Type</div>
            <div class="row-val">{{ currentObj.service }}</div>
          </div>

          <div class="row-detail">
            <div class="row-label">Environment</div>
            <div class="row-val">{{ currentObj.environment }}</div>
          </div>

          <div class="row-detail">
            <div class="row-label">Status</div>
            <div class="row-val">
              <BadgeState
                :label="currentObj.status"
                :color="badgeColor"
              />
            </div>
          </div>

          <div class="row-detail">
            <div class="row-label">Description</div>
            <div class="row-val">{{ currentObj.description }}</div>
          </div>
        </div>
      </div>

      <!-- Additional Information Tab -->
      <div class="tab-content" :class="{ 'show': currentTabIndex === 1 }">
        <pre class="additional-info">
          {{ currentObj }}
        </pre>
      </div>
    </div>
  </div>
</template>

<script>
import Tabs from '../common/Tabs'
import { BadgeState } from '@components/BadgeState';
import { getBadgeColor, getServiceIcon } from '../../services/helpers/shared-service';
export default {
  name: 'SharedServiceView',
  props: {
    currentObj: {
      type: Object,
      required: true
    }
  },
  components: {
    Tabs,
    BadgeState
  },
  data() {
    return {
      currentTabIndex: 0
    }
  },
  methods: {
    setTab (tabIndex) {
      this.currentTabIndex = tabIndex
    },
  },
  computed: {
    statusClass() {
      return this.currentObj.status === 'Approved' ? 'approved' : 'pending';
    },
    badgeColor () {
      return getBadgeColor(this.currentObj.status)
    },
    serviceIcon () {
      return getServiceIcon(this.currentObj.service)
    }
  }
}
</script>

<style scoped>
.service-detail-view {
  border-radius: 8px;
}

.service-detail-header {
  display: flex;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.section-subtitle {
  font-size: 14px;
  color: #6B7280; /* Light gray */
  margin-bottom: 30px;
}

.details-table {
  width: 100%;
  border-spacing: 0 10px;
}

.row-detail {
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 20px;
  padding: 10px 0;
}

.row-label {
  font-weight: 600;
  font-size: 16px;
}

.row-val {
  font-size: 16px;
}

.service-status {
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
}

.additional-info {
  background-color: #f9fafb;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  font-family: monospace;
  color: #374151;
}
</style>
