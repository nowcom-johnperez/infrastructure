<template>
  <div class="indented-panel pt-20">
    <TopNav v-show="showTopNav" />

    <div class="pt-10">
      <div class="rebranded">
        <div class="row mb-20 full-width logo-handler">
          <div class="col image-handler">
            <img src="../assets/img/trident.gif" alt="NOWCOM">
          </div>
        </div>

        <WhatsNewBanner />
        
        <div class="full-width">
          <Environments />
          <SharedService v-if="false" />
          <SideBar type="main" :sidebar-visible="sidebarVisible" @close="closeSidebar">
            <component v-if="currentComponent" :is="currentComponent" :current-obj="currentObj"></component>
          </SideBar>
        </div>

        <MakeAWishBanner />
      </div>
    </div>
  </div>
  
</template>

<script>
import TopNav from '../components/TopNav'
import Environments from '../components/home/environment'
import SharedService from '../components/home/shared-service'
import { mapGetters } from 'vuex'
import { PRODUCT_STORE } from '../config/constants';
import { getVendor } from '@shell/config/private-label';
import WhatsNewBanner from '../components/banners/WhatsNewBanner.vue';
import MakeAWishBanner from '../components/banners/MakeAWishBanner.vue';
import SideBar from '../components/Sidebar'
import { EventBus } from '../config/event-bus';
export default {
  name: 'HomePage',
  components: {
    SideBar,
    Environments,
    SharedService,
    WhatsNewBanner,
    MakeAWishBanner,
    TopNav
  },
  data() {
    return {
      vendor: getVendor(),
      currentObj: null,
      currentComponent: null,
      sidebarVisible: false,
    }
  },
  computed: {
    ...mapGetters(PRODUCT_STORE, {
      showTopNav: 'getTopNav',
    })
  },
  methods: {
    openSidebar(d) {
      this.currentObj = d.item
      this.currentComponent = d.component
      this.sidebarVisible = true
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
h1 {
  color: #007bff;
}

.rebranded {
  align-items: center;
}

.logo-handler {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  width: 100%;
}

.image-handler {
  text-align: center;

  img {
    width: 100%;
    height: 200px;
    object-fit: contain;
  }
}
</style>
