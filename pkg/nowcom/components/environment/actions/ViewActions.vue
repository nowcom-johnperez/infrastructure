<template>
  <div class="details-table">
    <div class="row-detail">
      <div class="row-label">Change Env Size</div>
      <div class="row-val">
        <button class="btn btn-sm role-secondary ml-10 clikable" type="button">
          {{ currentObj.size }}
        </button>
      </div>
    </div>

    <div>
      <button class="btn role-secondary ml-10 clikable" type="button" @click="isModalClientSecret = true">
        Reset SPN Client Secret
      </button>
    </div>

    <div class="mt-15">
      <button class="btn role-secondary ml-10 clikable" type="button">
        Enable Github Repo for Environment
      </button>
    </div>

    <Modal v-if="isModalClientSecret">
      <template v-slot:content>
        <div class="w-100">
          <div class="client-label">Client ID</div>
          <div class="val">
            <input type="text" value="client id" readonly>
          </div>
        </div>
        <div class="w-100 mt-15">
          <div class="client-label">Client Secret</div>
          <div class="val">
            <input type="text" value="client secret" readonly>
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <div class="flex">
          <div class="pb-5">
            <p class="section-subtitle mb-0">SPN secret has been reset and updated on your cluster</p>
            <p class="section-subtitle mb-0">New secret shown above please record incase of future usage</p>
          </div>
          <div class="mt-5">
            <button class="btn btn-sm role-secondary" @click="isModalClientSecret = false">Close</button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '../../common/Modal.vue';
export default {
  name: 'EnvironmentViewActions',
  props: {
    currentObj: {
      type: Object,
      required: true
    }
  },
  components: {
    Modal
  },
  data() {
    return {
      isModalClientSecret: false,
    }
  }
}
</script>