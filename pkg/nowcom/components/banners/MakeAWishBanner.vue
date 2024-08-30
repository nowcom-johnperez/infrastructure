<template>
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
import Modal from '../common/Modal.vue';
import WishForm from '../forms/WishForm.vue';
import cButton from '../common/Button'
import { Banner } from '@components/Banner';
export default {
  name: 'WhatsNewBanner',
  components: {
    Banner,
    Modal,
    WishForm,
    cButton
  },
  data() {
    return {
      fRequest: {
        show: false,
      }
    }
  },
}
</script>