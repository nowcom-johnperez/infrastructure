<template>
  <div>
    landing

    <code>{{ response }}</code>
  </div>
</template>

<script>
import {
  parseSi, formatSi, exponentNeeded, UNITS, createMemoryValues
} from '@shell/utils/units';
import { MANAGEMENT, USER, FLEET } from '@shell/config/types';
import { environmentService } from '../services/api';
import CopyToClipboardText from '@shell/components/CopyToClipboardText.vue'

export default {
  name: 'Landing',
  data() {
    return {
      response: []
    }
  },

  components: {
    CopyToClipboardText
  },

  fetch() {
    this.initData()
  },

  methods: {

    async initData() {
      const res = await this.$store.dispatch('management/findAll', { type: FLEET.GIT_REPO });
      this.response = res
    },
  }
}
</script>