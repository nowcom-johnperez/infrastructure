<template>
  <div class="node-presentation">
    <div class="role">
      {{ node.role }}
    </div>
    <div class="usage">
      <Bar :percentage="100" :primary-color="'--primary'" />
      <span>
        <span v-if="showUsage">{{node.nodeCount}} / </span>{{ node.nodeCount }}</span>
    </div>
    <div class="resources">
      <span class="label">CPU / Memory</span>
      <span>{{ node.cpu }} / {{ node.memory }}G</span>
    </div>
  </div>
</template>

<script>
import Bar from '@shell/components/graph/Bar';
export default {
  name: 'NodeInfo',
  props: {
    node: {
      type: Object,
      required: true
    },
    showUsage: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Bar
  }
}
</script>


<style lang="scss" scoped>
  .node-presentation {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 1rem;
    align-items: center;
    text-align: center;

    .role {
      font-weight: bold;
      font-size: small;
    }

    .usage {
      display: flex;
      flex-direction: column;
      align-items: center;

      span {
        margin-top: 0.5rem;
        font-size: 0.9rem;
      }
    }

    .resources {
      display: flex;
      flex-direction: column;
      align-items: center;

      .label {
        font-size: 0.8rem;
        color: gray;
        margin-bottom: 0.3rem;
      }
    }
  }
</style>