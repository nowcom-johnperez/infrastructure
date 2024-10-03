<template>
  <div class="environment-detail-view">
    <div class="environment-detail-header">
      <div class="environment-detail-info">
        <h2 class="section-title">Environment Information</h2>
        <p class="section-subtitle">Details about the environment.</p>
      </div>
    </div>
    

    <Tabs :list="['Basic', 'Actions', 'Link Services', 'KeyVault', 'Additional Information']" :current="currentTabIndex" @set-active="setTab"/>

    <div class="tab-content-container mt-40">
      <!-- Basic Information Tab -->
      <div class="tab-content" :class="{ 'show': currentTabIndex === 0 }">
        <div class="details-table">
          <div class="row-detail">
            <div class="row-label">Name</div>
            <div class="row-val">{{ currentObj.name }}</div>
          </div>
          
          <div class="row-detail">
            <div class="row-label">Size</div>
            <div class="row-val">{{ currentObj.size }}</div>
          </div>
          
          <div class="row-detail">
            <div class="row-label">Firewall Policy</div>
            <div class="row-val">{{ currentObj.firewallPolicy }}</div>
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

          <!-- <div class="row-detail">
            <div class="row-label">Description</div>
            <div class="row-val">{{ currentObj.description }}</div>
          </div> -->
        </div>
      </div>

      <!-- Actions Tab -->
      <div class="tab-content" :class="{ 'show': currentTabIndex === 1 }">
        <p>Actions</p>
      </div>

      <!-- Link Services -->
      <div class="tab-content" :class="{ 'show': currentTabIndex === 2 }">
        <p>Link Services</p>
      </div>

      <!-- KeyVault -->
      <div class="tab-content" :class="{ 'show': currentTabIndex === 3 }">
        <p>Key Vault</p>
      </div>

      <!-- Additional Information Tab -->
      <div class="tab-content" :class="{ 'show': currentTabIndex === 4 }">
        <p>Additional info will be set here</p>
      </div>
    </div>
  </div>
</template>

<script>
import Tabs from '../common/Tabs'
import { BadgeState } from '@components/BadgeState';
import { getBadgeColor } from '../../services/helpers/environment';
export default {
  name: 'EnvironmentView',
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
      return getBadgeColor(this.currentObj.status).replace('ml-20', '').replace('mr-20', '')
    },
    serviceIcon () {
      return getServiceIcon(this.currentObj.service)
    }
  }
}
</script>

<style scoped>
.environment-detail-view {
  border-radius: 8px;
}

.environment-detail-header {
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
  padding: 15px 0;
  /* border-bottom: 0.5px solid #6B7280; */
  line-height: 25px;
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
