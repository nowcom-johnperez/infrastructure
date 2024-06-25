<template>
  <form class="mt-20" @submit.prevent="submitForm">
    <div class="mt-10 mb-10" v-if="errorRes.show">
      <Alert :variant="errorRes.variant" @close="errorRes.show = false">{{ errorRes.msg }}</Alert>
    </div>
    <input type="text" v-model="subject" placeholder="What do you want?" class="mb-10">
    <textarea name="request" v-model="request" id="request-input" cols="30" rows="5" placeholder="Let us know more in detailed description"></textarea>
    <button type="submit" class="cbtn btn-primary full-width mt-10" :disabled="!request || loading">
      <span v-if="loading">
        <i class="fa fa-spinner fa-spin mr-10"></i> Sending...
      </span>
      <span v-else>Send</span>
    </button>
  </form>
</template>

<script>
import { wishService } from '../../services/api/wish';
import { getConfig } from '../../config/api';
import Alert from '../common/Alert'
const { API_VERSION, API } = getConfig()
export default {
  name: 'WishForm',
  components: {
    Alert
  },
  data () {
    return {
      loading: false,
      subject: null,
      request: null,
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
      if (!this.request) return
      try {
        this.loading = true
        const payload = {
          apiVersion: `${API}/${API_VERSION}`,
          kind: "MakeWish",
          metadata: {
            name: this.subject.toLowerCase().replace(/ /g, '-')
          },
          spec: {
            name: this.subject,
            description: this.request,
          }
        };

        await wishService.makeAwish(payload);
        this.loading = false
        this.subject = null
        this.request = null
        this.errorRes = {
          show: true,
          variant: 'success',
          msg: "Your request has been successfully added to the wishlist."
        }

        setTimeout(() => {
          this.errorRes.show = false
        }, 5000)
      } catch (err) {
        this.loading = false
        if (err.response?.statusText === "" && err.response?.data?.reason === "AlreadyExists") {
          this.errorRes = {
            show: true,
            variant: 'error',
            msg: "It appears this issue is already listed in our wishlist."
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