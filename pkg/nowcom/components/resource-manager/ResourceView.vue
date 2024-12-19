<template>
  <div>
    <CustomCapacity />
    <div class="mb-30">
       <!-- <CustomProjectNamespace :create-project-location-override="customProjectCreateLocation" /> -->
       <CustomProjectsList :create-project-location-override="customProjectCreateLocation" />

      <SideBar type="main" :sidebar-visible="sidebarVisible" @close="closeSidebar">
        <component v-if="currentComponent" :is="currentComponent" :current-obj="currentObj"></component>
      </SideBar>
    </div>
  </div>
</template>

<script>
import { PRODUCT_NAME, RESOURCE_MANAGEMENT } from '../../config/constants';
// import CustomProjectNamespace from './CustomProjectNamespace.vue';
import CustomProjectsList from './CustomProjectsList.vue';
import CustomCapacity from './CustomCapacity.vue';
import { MANAGEMENT } from '@shell/config/types';
import { EventBus } from '../../config/event-bus';
import SideBar from '../Sidebar'
export default {
  name: 'ResourceView',
  components: {
    SideBar,
    CustomCapacity,
    // CustomProjectNamespace
    CustomProjectsList
  },
  data() {
    return {
      currentObj: null,
      currentComponent: null,
      sidebarVisible: false,
    }
  },
  computed: {
    customProjectCreateLocation() {
      return {
        name: `${PRODUCT_NAME}-c-cluster-${RESOURCE_MANAGEMENT}-create`,
        params: {
          resource: MANAGEMENT.PROJECT,
          product:  this.$store.getters['currentProduct'].name,
        }
      }
    }
  },
  methods: {
    openSidebar(d) {
      if (this.sidebarVisible) this.closeSidebar()
      this.$nextTick(() => {
        this.currentObj = d.item
        this.currentComponent = d.component
        this.sidebarVisible = true
      })
    },
    closeSidebar () {
      this.sidebarVisible = false
      this.currentObj = null
      this.currentComponent = null
    },
  },
  mounted() {
    EventBus.$on('component-view', this.openSidebar)
  },
  beforeDestroy() {
    EventBus.$off('component-view')
  }
}
</script>

<style lang="scss" scoped>
.capacity-container {
  display: flex;
  justify-content: space-evenly;
}
</style>