<template>
  <div>
    <div class="timeline-container mt-10">
      <h2>Timeline</h2>
      <Timeline />
    </div>

    <div class="release-notes-container mt-10">
      <h2>Release Notes</h2>
      <div v-if="releaseNotes.items.length > 0" class="mt-20" v-for="v in releaseNotes.items" :key="v.name">
        <SortableTable :headers="releaseNotes.headers" :rows="v.list" keyField="version">
          <template #header-left>
            <div class="row table-heading">
              <h3 class="mb-0">
                {{ v.name }}
              </h3>
            </div>
          </template>
          <template #cell:version="{row}">
            <span class="link" @click="selectVersion(row)">{{ row.version }}</span>
          </template>
          <template #row-actions="row">
            <span></span>
          </template>
        </SortableTable>
      </div>
    </div>

    <Modal v-if="releaseNotes.showModal && releaseNotes.selected">
      <template v-slot:content>
        <h2>{{ releaseNotes.selected.version }}</h2>
        <ul>
          <li v-for="(note, idx) in releaseNotes.selected.notes" :key="idx">{{ note }}</li>
        </ul>
      </template>

      <template v-slot:footer>
        <cButton class="cbtn btn-light" @click="releaseNotes.showModal = false" label="Close" />
      </template>
    </Modal>
  </div>
</template>

<script>
import Timeline from '../components/TimelineComponent.vue'
import cButton from '../components/common/Button'
import Modal from '../components/common/Modal'
import SortableTable from '@shell/components/ResourceTable.vue'
import { RELEASE_NOTES } from '../config/release-notes'
import { RELEASE_NOTES_HEADERS } from '../config/table'
export default {
  name: 'ReleasePage',
  components: {
    SortableTable,
    Timeline,
    Modal,
    cButton
  },
  data() {
    return {
      releaseNotes: {
        showModal: false,
        selected: null,
        items: [],
        headers: []
      },

    }
  },
  methods: {
    selectVersion(rn) {
      this.releaseNotes.selected = rn
      this.releaseNotes.showModal = true
    }
  },
  mounted() {
    this.releaseNotes.headers = RELEASE_NOTES_HEADERS;
    this.releaseNotes.items = RELEASE_NOTES;
  }
}
</script>

<style scoped lang="scss">
.release-notes-container {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.release-notes-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.release-note-item {
  padding-top: 5px;
  padding-bottom: 5px;
}

.version-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.version-item {
  padding: 5px 0;
}

span.link {
  color: #007bff;
  cursor: pointer;
}
</style>
