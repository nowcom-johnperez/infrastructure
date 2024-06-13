<template>
  <div>
    <h3 class="mt-20">
      Labels
      <i class="fa fa-info-circle ml-5" v-clean-tooltip="tooltipLabels" aria-hidden="true"></i>
    </h3>
    <div>
      <div class="row" style="align-items: center;">
        <div>
          <label for="key">Key</label>
          <input type="text" name="key" v-model="tags.key" placeholder="Key"/>
        </div>
        <div class="ml-5 mr-5">
          <label for="value">Value</label>
          <input type="text" name="value" v-model="tags.value" placeholder="Value" @keydown.enter="addTag"/>
        </div>
        <div class="mt-15">
          <cButton class="cbtn btn-light" @click="addTag">
            <i class="fa fa-plus mr-5"></i>
            Add Label
          </cButton>
        </div>
      </div>
    </div>
    <Tag v-for="(tag, index) in tags.items" :key="index" :show-delete="showTagDelete(tag.key)" @delete="removeTag(index)" class="mt-10">{{ `${tag.key}:${tag.value}` }}</Tag>
  </div>
</template>

<script>
import Tag from '../components/common/Tag'
import cButton from '../components/common/Button'
export default {
  name: 'LabelsForm',
  components: {
    Tag,
    cButton
  },
  data() {
    return {
      tags: {
        items: [],
        key: "",
        value: ""
      },
    }
  },
  computed: {
    tooltipLabels() {
      return {
        content: `Labels accepts key:value pair and only allows alphanumeric characters, dashes (-), and dots (.).`,
        hideOnTargetClick: false
      }
    },
  },
  methods: {
    showTagDelete(tag) {
      return !['packetlifter.dev/owner', 'packetlifter.dev/created'].some((text) => tag.includes(text))
    },
    addTag() {
      const trimmedKey = this.tags.key.trim();
      const trimmedValue = this.tags.value.trim();
      if (trimmedKey && trimmedValue) {
        // this.tags.items.push(`${trimmedKey}:${trimmedValue}`);
        this.tags.items.push({
          key: trimmedKey,
          value: trimmedValue
        });
        this.tags.key = ""; // Clear the input field after adding a tag
        this.tags.value = ""; // Clear the input field after adding a tag
      }
    },
    removeTag(index) {
      this.tags.items.splice(index, 1);
    },
  }
}
</script>