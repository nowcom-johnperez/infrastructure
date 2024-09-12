<template>
  <div>
    <TopNav v-show="showTopNav" />

    <div class="pt-10">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import TopNav from '../components/TopNav'
import { mapGetters } from 'vuex'
import { PRODUCT_STORE } from '../config/constants';
export default {
  name: 'DefaultLayout',
  layout: 'plain',
  components: {
    TopNav
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(PRODUCT_STORE, {
      showTopNav: 'getTopNav',
    }),
  }
}
</script>