<template>
  <Modal size="lg" v-if="fRequest.show">
    <template #header>
      <div class="row">
        <div style="margin-right: auto;">
          <h1 class="mb-0">
            <i class="fa fa-star fa-pulse mr-10"></i> Make a wish!
          </h1>
        </div>
        <div>
          <cButton class="btn-x-modal" @click="returnToPreviousRoute">
            <i class="x-icon fa fa-close fa-lg"></i>
          </cButton>
        </div>
      </div>
    </template>
    <template v-slot:content>
      <p class="mb-10">We value your input and are eager to hear your suggestions, ideas, and feedback. Please use this form to share your thoughts with us. Your feedback helps us improve and better serve you.</p>
      <WishForm />
    </template>
  </Modal>
</template>

<script>
import Modal from '../components/common/Modal'
import WishForm from '../components/forms/WishForm'
import cButton from '../components/common/Button'
import { PRODUCT_NAME, LIST_NETWORK } from '../config/constants';
export default {
  name: 'WishPage',
  components: {
    Modal,
    WishForm,
    cButton
  },
  data() {
    return {
      fRequest: {
        show: true,
      },
      previousRoute: {}
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.previousRoute = from
    })
  },
  methods: {
    returnToPreviousRoute () {
      if (this.previousRoute.fullPath.includes('Infrastructure')) {
        this.$router.go(-1);
      } else {
        this.$router.push({ name: `${PRODUCT_NAME}-c-cluster-${LIST_NETWORK}`})
      }
    }
  }
}
</script>