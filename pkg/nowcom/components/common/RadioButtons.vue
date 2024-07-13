<template>
  <div class="protocol-options">
    <p>{{ title }}</p>
    <label v-for="option in options" :key="option">
      <input
        type="radio"
        :name="name"
        :value="option"
        v-model="localSelectedProtocol"
        @change="emitChange"
      >
      {{ option }}
    </label>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Protocol'
    },
    options: {
      type: Array,
      required: true
    },
    value: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: 'protocol'
    }
  },
  data() {
    return {
      localSelectedProtocol: this.value
    };
  },
  watch: {
    value(newValue) {
      this.localSelectedProtocol = newValue;
    }
  },
  methods: {
    emitChange() {
      this.$emit('input', this.localSelectedProtocol);
    }
  }
};
</script>

<style scoped>
body {
    font-family: Arial, sans-serif;
}

.protocol-options {
    display: flex;
    flex-direction: column;
    max-width: 200px;
    /* margin: 20px; */
}

.protocol-options label {
    margin: 5px 10px;
}

.protocol-options input[type="radio"] {
    margin-right: 10px;
}
</style>
