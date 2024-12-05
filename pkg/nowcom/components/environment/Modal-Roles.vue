<template>
  <Teleport to="body">
    <Modal size="lg" v-if="savingModalState">
      <template #header>
        <h1 class="mb-0">{{ headerLabel }}</h1>
      </template>
      <template v-slot:content>
        <div>
          <ClusterPermissionsEditor
            v-model="bindings"
            :use-two-columns-for-custom="true"
          />
        </div>
      </template>

      <template v-slot:footer>
        <button type="button" class="btn role-secondary mr-5" @click="closeModalStatus">Close</button>
        <button
          type="button"
          class="btn role-primary"
          @click="apply"
        >
          {{ t('generic.add') }}
        </button>
      </template>
    </Modal>
  </Teleport>
</template>

<script>
import Teleport from 'vue2-teleport'
import ClusterPermissionsEditor from '@shell/components/form/Members/ClusterPermissionsEditor';
import Modal from '../common/Modal'
export default {
  name: 'ModalRoles',
  data() {
    return {
      bindings: []
    }
  },
  components: {
    Modal,
    ClusterPermissionsEditor,
    Teleport
  },
  props: {
    savingModalState: {
      type: Boolean,
      required: false
    },
    headerLabel: {
      type: String,
      default: 'Assign Members'
    },
    onAdd: {
      type:    Function,
      default: () => {}
    }
  },
  methods: {
    closeModalStatus () {
      this.$emit('onClose')
    },
    apply() {
      this.onAdd(this.bindings);
      this.closeModalStatus();
    },
  }
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