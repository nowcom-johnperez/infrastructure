<template>
  <div class="card-select-container">
    <div 
      v-for="option in options" 
      :key="option.name" 
      :class="['card-select', { 'active': selected === option.name }]"
      @click="selectOption(option.name)"
    >
      <div class="left-card-select">
        <i :class="`fa fa-3x ${option.icon}`"></i>
      </div>
      <div class="right-card-select">
        <h3>{{ option.name }}</h3>
        <p>{{ option.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardImgSelect',
  props: {
    options: {
      type: Array,
      default: () => []
    },
    current: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selected: null
    }
  },
  mounted() {
    if (this.current) {
      this.selected = this.current;
    }
  },
  methods: {
    selectOption(opt) {
      this.selected = opt;
      this.$emit('onSelect', opt);
    }
  }
}
</script>

<style scoped>
.card-select-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: nowrap;
  gap: 1rem;
  padding: 10px;
  overflow-x: auto;
}

.card-select {
  display: flex;
  align-items: center;
  border: 2px solid #ccc;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: left;
  width: 400px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.left-card-select {
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.right-card-select h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.card-select.active {
  border-color: #007bff;
  box-shadow: 0 8px 16px rgba(0, 123, 255, 0.3);
  transform: scale(1.05);
}

.card-select:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .card-select-container {
    flex-direction: column;
    align-items: center;
  }
}
</style>
