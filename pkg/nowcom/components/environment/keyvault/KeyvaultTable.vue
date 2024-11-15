<template>
  <div>
    <SortableTable
      :table-actions="false"
      :row-actions="false"
      key-field="id"
      :rows="list"
      :headers="headers"
      :loading="loading"
      :paging="true" 
      :rows-per-page="10"
      :search="true"
    >
      <template #header-right>
        <button class="btn btn-sm role-primary" type="button" @click="create.show = true">
          <i class="fa fa-plus mr-5"></i>
          {{ t('generic.create') }}
        </button>
      </template>
      <template #col:name="{ row }">
        <td>
          <div class="list-cluster-name">
            <a href="#" @click.prevent="viewItem(row)">{{ row.name }}</a>
          </div>
        </td>
      </template>
    </SortableTable>

    <!-- <Teleport to=".environment-detail-view"> -->
    <Teleport to="body">
      <Modal size="lg" v-if="create.show">
        <template #header>
          <div class="row">
            <div style="margin-right: auto;">
              <h1 class="mb-0">
                Create new key
              </h1>
            </div>
            <div>
              <button class="btn-x-modal" @click="create.show = false">
                <i class="x-icon fa fa-close fa-lg"></i>
              </button>
            </div>
          </div>
        </template>
        <template v-slot:content>
          <KeyvaultForm @onSave="handleOnSave" />
        </template>
      </Modal>
    </Teleport>
  </div>
</template>

<script>
import SortableTable from '@shell/components/SortableTable';
import Modal from '../../common/Modal.vue';
import KeyvaultForm from './KeyvaultForm.vue';
import { KEYVAULT_HEADER } from '../../../config/table'
import Teleport from 'vue2-teleport'
export default {
  name: 'KeyvaultTable',
  data() {
    const headers = KEYVAULT_HEADER
    return {
      loading: false,
      list: [],
      headers,
      create: {
        show: false,
      }
    }
  },
  components: {
    KeyvaultForm,
    SortableTable,
    Modal,
    Teleport
  },

  methods: {
    handleOnSave (data) {
      console.log(`test`, data)
      this.list.push(data)
      this.create.show = false
    }
  }
}
</script>