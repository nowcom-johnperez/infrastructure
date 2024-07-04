<template>
  <div class="rebranded">
    <div class="row mb-20 full-width logo-handler">
      <div class="col image-handler">
        <img src="../assets/img/trident-banner.gif" alt="NOWCOM">
      </div>
    </div>

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

    <div class="col span-12 pl-50 pr-50">
      <Banner
        data-testid="makewish"
        color="info whats-new"
      >
        <div style="margin-right: auto;">
          We value your input and are eager to hear your suggestions, ideas, and feedback.
        </div>
        <a
          class="hand"
          href="#"
          @click.prevent="fRequest.show = true"
        >
          <i class="fa fa-star fa-pulse mr-5"></i> Make a wish!
        </a>
      </Banner>
    </div>
    
    <div class="full-width">
      <K8STable />
      <!-- <Virtualization class="mt-40" /> -->
    </div>

    <Modal size="lg" v-if="fRequest.show">
      <template #header>
        <div class="row">
          <div style="margin-right: auto;">
            <h1 class="mb-0">
              <i class="fa fa-star fa-pulse mr-10"></i> Make a wish!
            </h1>
          </div>
          <div>
            <cButton class="btn-x-modal" @click="fRequest.show = false">
              <i class="x-icon fa fa-close fa-lg"></i>
            </cButton>
          </div>
        </div>
      </template>
      <template v-slot:content>
        <p class="mb-10">Please use this form to share your thoughts with us. Your feedback helps us improve and better serve you.</p>
        <WishForm />
      </template>
    </Modal>
  </div>
</template>

<script>
import cButton from '../components/common/Button'
import K8STable from '../components/home/k8s-table'
import Virtualization from '../components/home/virtualization'
import { Banner } from '@components/Banner';
import { getVendor } from '@shell/config/private-label';
import Modal from '../components/common/Modal.vue';
import WishForm from '../components/forms/WishForm.vue';
import { PRODUCT_NAME, BLANK_CLUSTER, ROAD_MAP } from '../config/constants';
export default {
  name: 'HomePage',
  layout: 'plain',
  components: {
    K8STable,
    Virtualization,
    cButton,
    Banner,
    Modal,
    WishForm
  },
  data() {
    return {
      vendor: getVendor(),
      fRequest: {
        show: false,
      }
    }
  },
  computed: {
    whatsNewUrl () {
      return {
        path: `/${PRODUCT_NAME}/c/${BLANK_CLUSTER}/${ROAD_MAP}`
      }
    }
  },
  methods: {
    featureRequest() {
      this.fRequest.show = true
    }
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
