<template>
    <div>
      <div class="tab-buttons">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          @click="changeTab(index)"
          :class="{ active: index === activeTab }"
        >
          {{ tab.label }}
        </button>
      </div>
      <div class="tab-content">
        <div v-for="(tab, index) in tabs" :key="index" v-if="index === activeTab">
          {{ tab.content }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      tabs: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        activeTab: 0,
      };
    },
    methods: {
      changeTab(index) {
        this.activeTab = index;
      },
    },
  };
  </script>
  
  <style scoped>
  .tab-buttons {
    display: flex;
    margin: 0 16px; /* Add margin to the buttons */
  }
  
  .tab-buttons button {
    padding: 5px 16px; /* Adjust padding for smaller buttons */
    border: none;
    background-color: #3b7498;
    cursor: pointer;
    margin-right: 8px; /* Add margin between buttons */
    border-radius: 4px; /* Add rounded corners */
  }
  
  .tab-buttons button.active {
    background-color: #cdd7e2;
    color: #3b7498;
  }
  
  .tab-content {
    padding: 20px;
  }
  </style>
  