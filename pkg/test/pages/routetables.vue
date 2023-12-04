<template>
  <div>
    <h1>Route Tables</h1>

  <!-- Your other content here -->

      <!-- Grid for Buttons -->
      <div class="button-grid">
        <div class="button-column">
          <!-- Main Route Table Button -->
          <button class="custom-button custom-button-main custom-button-small" @click="viewRouteTable(1)">Main Route Table</button>
        </div>

        <div class="button-column">
          <!-- Custom Route Table Button -->
          <button class="custom-button custom-button-list custom-button-small" @click="viewRouteTable(2)">Custom Route Table</button>
        </div>

        <!-- You can add more buttons here within additional button-columns -->
      </div>

    <!-- Display Selected Route Table -->
    <div v-if="selectedRouteTable">
      <h2>Route Table: {{ selectedRouteTable.name }}</h2>

      <!-- List of Routes -->
      <ul>
        <li v-for="route in selectedRouteTable.routes" :key="route.id">
          <div>
            Destination: {{ route.destinationCidr }} &nbsp;&nbsp; Target: {{ route.target }}
            <button class="custom-button" @click="editRoute(route.id)">Edit</button>
            <button class="custom-button delete-button" @click="deleteRoute(route.id)">Delete</button>
          </div>
          <br>
        </li>
      </ul>

      <!-- Add New Route -->
      <button class="custom-button" @click="addRoute">Add Route</button>
    </div>

    <!-- Edit Route Modal -->
    <div v-if="editingRoute">
      <h3>Edit Route</h3>
      <div class="input-container">
        <input v-model="editedRoute.destinationCidr" placeholder="Destination CIDR" />
      </div>
      <div class="input-container">
        <input v-model="editedRoute.target" placeholder="Target" />
      </div>
      <button class="custom-button" @click="saveRoute">Save</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routeTables: [
        { id: 1, name: 'Main Route Table', routes: [] },
        { id: 2, name: 'Custom Route Table', routes: [] },
      ],
      selectedRouteTable: null,
      editingRoute: null,
      editedRoute: { destinationCidr: '', target: '' },
    };
  },
  methods: {
    viewRouteTable(routeTableId) {
      this.selectedRouteTable = this.routeTables.find((table) => table.id === routeTableId);
    },
    editRoute(routeId) {
      this.editingRoute = this.selectedRouteTable.routes.find((route) => route.id === routeId);
      this.editedRoute = { ...this.editingRoute };
    },
    saveRoute() {
      this.editingRoute.destinationCidr = this.editedRoute.destinationCidr;
      this.editingRoute.target = this.editedRoute.target;
      this.editingRoute = null;
    },
    deleteRoute(routeId) {
      const index = this.selectedRouteTable.routes.findIndex((route) => route.id === routeId);
      this.selectedRouteTable.routes.splice(index, 1);
    },
    addRoute() {
      this.selectedRouteTable.routes.push({
        id: this.selectedRouteTable.routes.length + 1,
        destinationCidr: '',
        target: '',
      });
    },
  },
};
</script>

<style scoped>
/* Your CSS styles for the custom buttons and input containers go here */
.custom-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px; /* Added padding to the buttons */
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}

/* Your existing CSS styles */

/* Grid for Buttons */
.button-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Creates four equal columns */
  grid-gap: 10px; /* Adjust the gap between columns as needed */
}

/* Button Column */
.button-column {
  flex: 1;
}

/* Your existing CSS styles */

/* Custom class for smaller buttons */
.custom-button-small {
  padding: 5px 10px; /* Adjust the padding to make the button smaller */
  font-size: 12px; /* Adjust the font size to make the text smaller */
  /* Add any other styles you want to customize the smaller buttons */
}

.delete-button {
  background-color: #dc3545;
}

.custom-button:hover, .delete-button:hover {
  background-color: #0056b3;
}

.input-container {
  margin: 10px 0; /* Added margin for padding to the input containers */
}
</style>
