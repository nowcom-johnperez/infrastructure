<template>
  <div class="details-table">
    <div class="row-detail">
      <div class="row-label">Name</div>
      <div class="row-val">env1.stallions.kv</div>
    </div>
    
    <div class="row-detail">
      <div class="row-label">Linked SPN</div>
      <div class="row-val">env1.stallions.spn</div>
    </div>
    
    <div class="row-detail">
      <div class="row-label">Resource Group</div>
      <div class="row-val">trident-forge</div>
    </div>

    <!-- table -->
    <KeyvaultTable />
  </div>
</template>

<script>
import KeyvaultTable from './KeyvaultTable.vue';
export default {
  name: 'EnvironmentKeyvaultView',
  props: {
    currentObj: {
      type: Object,
      required: true
    }
  },
  components: {
    KeyvaultTable
  }
}
</script>