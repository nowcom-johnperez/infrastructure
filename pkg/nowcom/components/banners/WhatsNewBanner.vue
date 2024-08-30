<template>
  <div class="col span-12 pl-50 pr-50">
    <Banner
      data-testid="changelog-banner"
      color="info whats-new"
    >
      <div style="margin-right: auto;">
        {{ t('home.seeWhatsNew') }}
      </div>
      <router-link
        class="hand"
        :to="whatsNewUrl"
      >
        <span v-clean-html="t('home.whatsNewLink')" />
      </router-link>
    </Banner>
  </div>
</template>

<script>
import { Banner } from '@components/Banner';
import { PRODUCT_NAME, BLANK_CLUSTER, ROAD_MAP } from '../../config/constants';
export default {
  name: 'WhatsNewBanner',
  components: {
    Banner
  },
  computed: {
    whatsNewUrl () {
      return {
        path: `/${PRODUCT_NAME}/c/${BLANK_CLUSTER}/${ROAD_MAP}`
      }
    }
  },
}
</script>