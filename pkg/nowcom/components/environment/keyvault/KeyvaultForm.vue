<template>
  <form class="mt-20" @submit.prevent="submitForm">
    <div class="mt-10 mb-10" v-if="errorRes.show">
      <Alert :variant="errorRes.variant" @close="errorRes.show = false">{{ errorRes.msg }}</Alert>
    </div>
    <input type="text" v-model="vaultKey" placeholder="Key" class="mb-10">
    <input type="text" v-model="vaultValue" placeholder="Value" class="mb-10">
    <button type="submit" class="btn btn-sm role-primary full-width mt-10" :disabled="!vaultValue || !vaultKey || loading">
      <span style="margin-left: auto; margin-right: auto;" v-if="loading">
        <i class="fa fa-spinner fa-spin mr-10"></i> Saving...
      </span>
      <span style="margin-left: auto; margin-right: auto;" v-else>Save</span>
    </button>
  </form>
</template>

<script>
import Alert from '../../common/Alert'
export default {
  name: 'WishForm',
  components: {
    Alert
  },
  data () {
    return {
      loading: false,
      vaultKey: null,
      vaultValue: null,
      errorRes: {
        show: false,
        msg: null,
        variant: 'error'
      }
    }
  },
  computed: {
    user() {
      return this.$store.getters['auth/v3User']
    },
  },
  methods: {
    async submitForm() {
      if (!this.vaultKey || !this.vaultValue) return
      try {
        this.loading = true
        // const payload = {
        //   apiVersion: `${TRIDENT_API}/${API_VERSION}`,
        //   kind: "Wish",
        //   metadata: {
        //     // name: this.subject.toLowerCase().replace(/ /g, '-')
        //     generateName: "wish-"
        //   },
        //   spec: {
        //     title: this.subject,
        //     description: this.request,
        //     user: this.user.name || this.user.username || this.user.id || this.user.uuid
        //   }
        // };

        // await wishService.makeAwish(payload);
        this.loading = false
        this.errorRes = {
          show: true,
          variant: 'success',
          msg: "Your request has been successfully added to the keyvault."
        }

        setTimeout(() => {
          this.errorRes.show = false
        }, 5000)
        this.$emit('onSave', {
          key: this.vaultKey,
          value: this.vaultValue
        })
      } catch (err) {
        this.loading = false
        if (err.response?.statusText === "" && err.response?.data?.reason === "AlreadyExists") {
          this.errorRes = {
            show: true,
            variant: 'error',
            msg: "It appears this key-value pair is already listed in our keyvault."
          }
        } else {
          this.errorRes = {
            show: true,
            variant: 'error',
            msg: "Oops! Something went wrong!"
          }
        }
      }
    }
  }
}
</script>