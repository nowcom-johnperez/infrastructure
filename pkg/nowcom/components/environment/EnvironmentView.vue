<template>
  <div class="environment-detail-view">
    <div class="environment-detail-header">
      <div class="environment-detail-info">
        <h2 class="section-title">Environment Information</h2>
        <p class="section-subtitle">Details about the environment.</p>
      </div>
    </div>
    

    <Tabs :list="['Basic', 'Actions', 'KeyVault', 'Linked Services']" :current="currentTabIndex" @set-active="setTab"/>

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
            <div class="row-label">Github</div>
            <div class="row-val">{{ currentObj.github || 'not available' }}</div>
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
        <ActionsTab :current-obj="currentObj" />
      </div>

      <!-- KeyVault -->
      <div class="tab-content" :class="{ 'show': currentTabIndex === 2 }">
        <KeyvaultView :current-obj="currentObj" />
      </div>

      <!-- Link Services -->
      <div class="tab-content" :class="{ 'show': currentTabIndex === 3 }">
        <LinkServicesView />
      </div>

    </div>
  </div>
</template>

<script>
import Tabs from '../common/Tabs'
import ActionsTab from './actions/ViewActions.vue'
import { BadgeState } from '@components/BadgeState';
import { getBadgeColor } from '../../services/helpers/environment';
import LinkServicesView from './link-services/LinkServicesView.vue';
import KeyvaultView from './keyvault/KeyvaultView.vue';
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
    BadgeState,
    ActionsTab,
    LinkServicesView,
    KeyvaultView
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
