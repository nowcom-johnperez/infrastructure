<template>
  <div class="base create-base">
    <Loading :loading="isLoading" />
    <div class="create-content">
      <h1>Create New Environment</h1>
      <br />
      <CreateForm />
    </div>
  </div>
</template>
<script>
import Loading from '../../components/common/Loading'
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
    user() {
      return this.$store.getters['auth/v3User']
    },
  },
  mounted() {
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

};
</script>