<template>
  <div>
    <h2 class="text-label">{{ currentObj.name }}</h2>
    <Tabs :list="['Basic', 'Additional Information']" :current="currentTabIndex" @set-active="setTab"/>

    <div class="tab-content-container mt-40">
      <div class="tab-content" :class="{ 'show': currentTabIndex === 0 }">
        Basic Info Here
      </div>

      <div class="tab-content" :class="{ 'show': currentTabIndex === 1 }">
        <pre>
          {{ currentObj }}
        </pre>
      </div>
    </div>
  </div>
</template>

<script>
import Tabs from '../common/Tabs'
export default {
  name: 'SharedServiceView',
  props: {
    currentObj: {
      type: Object,
      required: true
    }
  },
  components: {
    Tabs
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
  }
}
</script>