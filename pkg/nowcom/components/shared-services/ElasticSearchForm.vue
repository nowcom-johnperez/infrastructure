<template>
  <div class="custom-service-form">
    <div class="input-container">
      <label for="networkType">Environment <span class="text-danger">*</span></label>
      <Select :options="envList" v-model="internalForm.environment" class="mt-10"/>
    </div>

    <div class="input-container">
      <label for="name">Name</label>
      <input type="text" class="mt-10" name="name" v-model="internalForm.name" placeholder="ElasticSearch Name" required />
      <span class="info-icon" v-clean-tooltip="'ElasticSearch name'">
        <i class="fa fa-info-circle" aria-hidden="true"></i>
      </span>
    </div>

    <div class="input-container">
      <label for="networkHost">Network Host</label>
      <input type="text" class="mt-10" name="networkHost" v-model="internalForm.networkHost" placeholder="0.0.0.0" required />
    </div>

    <div class="input-container">
      <label for="httpPort">HTTP Port</label>
      <input type="text" class="mt-10" name="httpPort" v-model="internalForm.httpPort" placeholder="9200" required />
    </div>

    <div class="input-container">
      <label for="transportPort">Transport Port</label>
      <input type="text" class="mt-10" name="transportPort" v-model="internalForm.transportPort" placeholder="9300" required />
    </div>

    <div class="input-container">
      <label for="indexingShards">Indexing Shards</label>
      <input type="text" class="mt-10" name="indexingShards" v-model="internalForm.indexing.shards" placeholder="5" required />
    </div>

    <div class="input-container">
      <label for="indexingReplicas">Indexing Replicas</label>
      <input type="text" class="mt-10" name="indexingReplicas" v-model="internalForm.indexing.replicas" placeholder="1" required />
    </div>
  </div>
</template>

<script>
import Select from '@shell/components/form/Select.vue';
export default {
  name: 'ElasticSearchForm',
  props: {
    value: {
      type: Object,
      required: true
    },
    environments: {
      type: Array,
      required: true
    }
  },
  components: {
    Select
  },
  data() {
    return {
      internalForm: this.value,
    }
  },
  computed: {
    envList () {
      return this.environments.map((env) => env.name)
    }
  },
  watch: {
    internalForm: {
      handler(val) {
        this.$emit('input', val);
      },
      deep: true
    },
    value: {
      handler(newVal) {
        this.internalForm = newVal;
      },
      deep: true
    }
  },
}
</script>

<style lang="scss" scoped>
.custom-service-form {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  gap: 20px;
  padding: 20px;
}

.input-container {
  display: flex;
  flex-direction: column;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

label {
  margin-bottom: 5px;
}

.info-icon {
  margin-left: 10px;
}

@media (max-width: 768px) {
  .custom-service-form {
    grid-template-columns: 1fr;
  }
}
</style>
