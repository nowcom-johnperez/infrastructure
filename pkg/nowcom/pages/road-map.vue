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
          <template #cell:notes="{row}">
            <span>
              {{ row.notes.slice(0, 2).join(', ') }} {{ row.notes.length > 1 ? '...' : ''}}
            </span>
          </template>
          <template #row-actions="row">
            <span></span>
          </template>
        </SortableTable>
      </div>
    </div>

    <Modal v-if="releaseNotes.showModal && releaseNotes.selected" size="fixed">
      <template v-slot:content>
        <div class="release-notes-card">
          <div class="release-notes-card-header">
            <span class="version">{{ releaseNotes.selected.version }}</span>
            <span class="date-badge">{{ releaseNotes.selected.dateRelease }}</span>
          </div>
          <ul class="notes-list">
            <li v-for="(note, idx) in releaseNotes.selected.notes" :key="idx">{{ note }}</li>
          </ul>
        </div>
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
  // background-color: #ffffff;
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

.release-notes-card {
  // border: 1px solid #ddd;
  // border-radius: 8px;
  padding: 10px;
  margin: 16px 0;
  // box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  // background-color: #fff;
}
.release-notes-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
  margin-bottom: 16px;
}
.version {
  font-size: 1.5em;
  font-weight: bold;
}
.date-badge {
  background-color: #007bff;
  color: #fff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.9em;
}
.notes-list {
  list-style: none;
  padding: 0;
}
.notes-list li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}
.notes-list li:last-child {
  border-bottom: none;
}
</style>
