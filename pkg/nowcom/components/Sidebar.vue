<template>
    <div :class="{ 'sidebar': isMain, 'sidebar-visible': isMain && sidebarVisible, 'add-subnet-sidebar': !isMain, 'add-subnet-sidebar-visible': !isMain && sidebarVisible }">
      <div :class="{ 'sidebar-content': isMain, 'add-subnet-sidebar-content': !isMain }">
        <slot></slot>
      </div>
    </div>
</template>

<script>
export default {
    name: "Sidebar",
    props: {
        sidebarVisible: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'main' // main or sub
        }
    },
    computed: {
        isMain() {
            return this.type === 'main'
        }
    }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 0;
  height: 100%;
  background-color: #736f6f;
  /* Set a default background color */
  overflow-x: hidden;
  transition: 0.5s;
  /* Adjust the duration of the animation */
}

.sidebar-content {
  padding: 20px;
  margin-top: 60px;
}

.sidebar-visible {
  width: 65%;
  /* Adjust the width of the sidebar */
}

.dark-theme .sidebar {
  background-color: #333;
  /* Dark theme background color */
  color: #fff;
  /* Dark theme text color */
}

/* Styles for the second sidebar */
.add-subnet-sidebar {
  position: fixed;
  top: 0;
  right: -40%;
  /* Initially off-screen */
  width: 40%;
  height: 100%;
  background-color: #9c9393;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  transition: right 0.3s ease-out;
  z-index: 2;
}

/* Make the second sidebar visible */
.add-subnet-sidebar.add-subnet-sidebar-visible {
  right: 0;
}

/* Your existing styles for the second sidebar content */
.add-subnet-sidebar-content {
  /* ... */
  margin-top: 60px;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  padding: 20px 10px 10px 10px;
  /* Add top and bottom padding */
}

.add-form-row {
  width: 300px;
  /* display: grid; */
  justify-content: center;
  align-items: center;
  /* Add this line for vertical alignment if needed */
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>