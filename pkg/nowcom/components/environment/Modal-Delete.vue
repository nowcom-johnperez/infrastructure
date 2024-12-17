<template>
  <Modal size="sm" v-if="modalState">
    <template #header>
      <h1 class="mb-0">{{ headerLabel }}</h1>
    </template>
    <template v-slot:content>
      <p>Are you sure that you want to delete Environment "{{ environment.spec?.environmentName }}"?</p>
    </template>

    <template v-slot:footer>
      <button class="cbtn btn-danger" @click="initDelete" :disabled="loading">Yes</button>
      <button class="cbtn btn-light" @click="closeModal" :disabled="loading">No</button>
    </template>
  </Modal>
</template>

<script>
import { environmentService } from '../../services/api';
import Modal from '../common/Modal'
export default {
  name: 'ModalStatus',
  components: {
    Modal
  },
  props: {
    modalState: {
      type: Boolean,
      required: true
    },
    environment: {
      type: Object,
      required: true
    },
    headerLabel: {
      type: String,
      default: 'Delete Environment'
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async initDelete() {
      if (!this.environment.spec?.environmentName) return
      try {
        await environmentService.deleteById(this.environment.spec.environmentName)
        this.$store.dispatch('growl/success', {
          title: 'Environment',
          message: `You have successfully deleted environment ${this.environment.spec.environmentName}`,
        }, { root: true })
        this.$emit('deleteSuccess')
        this.closeModal()
      } catch (error) {
        this.$store.dispatch('growl/error', {
          title: 'Environment',
          message: 'Failed to delete environment. Please try again.',
        }, { root: true })
      }
    },
    closeModal () {
      this.$emit('onClose')
    }
  },
}
</script>

<style lang="scss" scoped>

.status-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.success-state {
  color: green;
}

.processing-state {
  color: #007bff;
}

</style>