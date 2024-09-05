<template>
  <div class="card-select-container">
    <div 
      v-for="option in options" 
      :key="option.size" 
      :class="['card-select', { 'active': selected === option.size }]"
      @click="selectOption(option.size)"
    >
      <h3>{{ option.size }}</h3>
      <ul>
        <li v-for="(desc, index) in option.description" :key="index">
          <i class="fa fa-check"></i> {{ desc }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardSelect',
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
      this.selected = this.current
    }
  },
  methods: {
    selectOption (opt) {
      this.selected = opt
      this.$emit('onSelect', opt)
    }
  }
}
</script>

<style scoped>
.card-select-container {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  padding: 10px;
}

.card-select {
  border: 2px solid #ccc;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  width: 200px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;

  h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  ul {
    padding-left: 0;
  }

  li {
    list-style: none; /* Remove the default bullet */
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;

    i {
      color: #28a745; /* Green color for the checkmark */
      margin-right: 0.5rem;
    }
  }


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
