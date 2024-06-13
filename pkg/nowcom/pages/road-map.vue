<template>
  <div>
    <div class="timeline-container mt-10">
      <h2>Timeline</h2>
      <Timeline />
    </div>

    <div class="release-notes-container mt-10">
      <h2>Release Notes</h2>
      <div v-if="releaseNotes.items.length > 0" class="mt-10">
        <ul class="release-notes-list">
          <li v-for="v in releaseNotes.items" :key="v.name" class="release-note-item mt-10">
            <h4>{{ v.name }}</h4>
            <ul v-if="v.list.length > 0" class="version-list">
              <li v-for="item in v.list" :key="item.version" class="version-item">
                <span class="link" @click="selectVersion(item)">{{ item.version }}</span>
              </li>
            </ul>
          </li>
        </ul>
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
import { RELEASE_NOTES } from '../config/release-notes'
export default {
  name: 'ReleasePage',
  components: {
    Timeline,
    Modal,
    cButton
  },
  data() {
    return {
      releaseNotes: {
        showModal: false,
        selected: null,
        items: []
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
    console.log(`RELEASE`, RELEASE_NOTES);
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
