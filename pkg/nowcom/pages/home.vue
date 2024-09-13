<template>
  <div>
    <div class="rebranded">
      <div class="row mb-20 full-width logo-handler">
        <div class="col image-handler">
          <img src="../assets/img/trident.gif" alt="NOWCOM">
        </div>
      </div>

      <WhatsNewBanner />
      
      <div class="full-width">
        <Environments />
        <SharedService />
      </div>

      <MakeAWishBanner />
    </div>
  </div>
  
</template>

<script>
import Environments from '../components/home/environment'
import SharedService from '../components/home/shared-service'
import { getVendor } from '@shell/config/private-label';
import WhatsNewBanner from '../components/banners/WhatsNewBanner.vue';
import MakeAWishBanner from '../components/banners/MakeAWishBanner.vue';
export default {
  name: 'HomePage',
  components: {
    Environments,
    SharedService,
    WhatsNewBanner,
    MakeAWishBanner
  },
  data() {
    return {
      vendor: getVendor(),
    }
  },
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
