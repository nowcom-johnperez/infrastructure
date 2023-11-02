<template>
  <div>
    <h1>Route Tables</h1>

    <!-- Main Route Table Button -->
    <button class="custom-button custom-button-main" @click="viewRouteTable(1)">Main Route Table</button>

    <!-- Custom Route Table Button -->
    <button class="custom-button custom-button-list" @click="viewRouteTable(2)">Custom Route Table</button>

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

.custom-button-main {
  background-color: #17a2b8; /* Change the style for the Main Route Table button */
}

.custom-button-list {
  background-color: #343a40; /* Change the style for the Custom Route Table button */
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
