<template>
  <div class="environment-detail-view">
    <div class="environment-detail-header">
      <div class="environment-detail-info">
        <h2 class="section-title">Environment Information</h2>
        <p class="section-subtitle">Details about the environment.</p>
      </div>
    </div>
    

    <Tabs :list="['Basic', 'Actions', 'KeyVault', 'App Launcher', 'Linked Services']" :current="currentTabIndex" @set-active="setTab"/>

    <div class="tab-content-container mt-40">
      <!-- Basic Information Tab -->
      <div class="tab-content" :class="{ 'show': currentTabIndex === 0 }">
        <BasicView :current-obj="currentObj" />
      </div>

      <!-- Actions Tab -->
      <div class="tab-content" :class="{ 'show': currentTabIndex === 1 }">
        <ActionsTab :current-obj="currentObj" />
      </div>

      <!-- KeyVault -->
      <div class="tab-content" :class="{ 'show': currentTabIndex === 2 }">
        <KeyvaultView :current-obj="currentObj" />
      </div>

      <!-- App Launcher -->
      <div class="tab-content" :class="{ 'show': currentTabIndex === 3 }">
        <AppLauncherView :current-obj="currentObj" />
      </div>

      <!-- Link Services -->
      <div class="tab-content" :class="{ 'show': currentTabIndex === 4 }">
        <LinkServicesView />
      </div>

    </div>
  </div>
</template>

<script>
import Tabs from '../common/Tabs'
import ActionsTab from './actions/ViewActions.vue'
import LinkServicesView from './link-services/LinkServicesView.vue';
import KeyvaultView from './keyvault/KeyvaultView.vue';
import AppLauncherView from './app-launcher/AppLauncherView.vue';
import BasicView from './basic/BasicView.vue';
import { EventBus } from '../../config/event-bus';
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
    BasicView,
    ActionsTab,
    LinkServicesView,
    KeyvaultView,
    AppLauncherView
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
  mounted() {
    EventBus.$emit('load-environment', true) // stop fetching list
  },
  beforeDestroy() {
    EventBus.$emit('load-environment', false) // stop fetching list
  }
}
</script>
