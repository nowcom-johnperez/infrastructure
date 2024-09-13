<template>
  <div class="base create-base">
    <Loading :loading="isLoading" />
    <div class="create-content">
      <h1>Create Shared Service</h1>
      <br />
      <CreateForm />
    </div>
  </div>
</template>
<script>
import Loading from '../../components/common/Loading'
import CreateForm from '../../components/shared-services/CreateForm.vue'
import { PRODUCT_STORE } from '../../config/constants';
export default {
  name: "CreateSharedServicePage",
  data() {
    return {
      isLoading: false,
    };
  },
  components: {
    Loading,
    CreateForm
  },
  computed: {
    user() {
      return this.$store.getters['auth/v3User']
    },
  },
  mounted() {
    this.$store.dispatch(`${PRODUCT_STORE}/setTopNavStatus`, false);
    this.showSpinner()
  },
  methods: {
    showSpinner() {
      this.isLoading = true;
      // Hide the spinner after 2 seconds
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    },
  },
  beforeDestroy() {
    this.$store.dispatch(`${PRODUCT_STORE}/setTopNavStatus`, true);
  }
};
</script>