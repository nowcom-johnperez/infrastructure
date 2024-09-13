<template>
  <div class="custom-service-form">
    <div class="input-container">
      <label for="networkType">Environment <span class="text-danger">*</span></label>
      <Select :options="envList" v-model="internalForm.environment" class="mt-10"/>
    </div>

    <div class="input-container">
      <label for="name">Name</label>
      <input type="text" class="mt-10" name="name" v-model="internalForm.name" placeholder="Host Name" required />
      <span class="info-icon" v-clean-tooltip="'Host name'">
        <i class="fa fa-info-circle" aria-hidden="true"></i>
      </span>
    </div>

    <div class="input-container">
      <label for="host">Host</label>
      <input type="text" class="mt-10" name="host" v-model="internalForm.host" placeholder="192.10.0.1" required />
      <span class="info-icon" v-clean-tooltip="'Host Address'">
        <i class="fa fa-info-circle" aria-hidden="true"></i>
      </span>
    </div>

    <div class="input-container">
      <label for="username">Username</label>
      <input type="text" class="mt-10" name="username" v-model="internalForm.username" placeholder="" required />
    </div>

    <div class="input-container">
      <label for="password">Password</label>
      <input type="text" class="mt-10" name="password" v-model="internalForm.password" placeholder="" required />
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
