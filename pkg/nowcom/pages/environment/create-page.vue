<template>
  <div class="base create-base">
    <Loading :loading="isLoading" />
    <div class="create-content">
      <h1>Create New Environment</h1>
      <br />
      <CreateForm :vnets="networks" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Loading from '../../components/common/Loading'
import { PRODUCT_STORE} from '../../config/constants'
import CreateForm from '../../components/environment/CreateForm.vue'

export default {
  name: "CreateEnvironmentPage",
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
    ...mapGetters(PRODUCT_STORE, {
      networks: 'items',
    }),
    user() {
      return this.$store.getters['auth/v3User']
    },
  },
  mounted() {
    this.showSpinner()
    this.$store.dispatch(`${PRODUCT_STORE}/findAll`)
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

};
</script>