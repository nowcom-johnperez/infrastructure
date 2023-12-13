<template>
  <div>
    <img src="../assets/img/nowcom.jpeg" width="500" height="200"/>
    <p>Nowcom Infrastructure </p>
    <!-- Spinner Modal -->
    <div v-if="isLoading" class="spinner-modal">
      <div class="spinner-content">
        <!-- You can use an image or any other content for the spinner -->
        <img src="../assets/img/loading.png" alt="Loading Spinner" class="spinner-image" />
      </div>
    </div>
    <!-- <ListNamespace ></ListNamespace> -->
   <!-- <Home></Home> -->
   <div></div>
  </br>
   <div>
    <!-- Tab buttons -->
    <div class="tab-buttons">
      <button @click="changeTab('tab1')" :class="{ 'active': currentTab === 'tab1' }">Basic</button>
      <button @click="changeTab('tab2')" :class="{ 'active': currentTab === 'tab2' }">IP Address</button>
      <button @click="changeTab('tab3')" :class="{ 'active': currentTab === 'tab3' }">Tags</button>
    </div>

    <!-- Tab content -->
    <div v-if="currentTab === 'tab1'">
      <h2>Basic</h2>
      <p>Basic</p>
    </div>

    <div v-if="currentTab === 'tab2'">
      <h2>IP Address</h2>
      <p>IP Address</p>
    </div>

    <div v-if="currentTab === 'tab3'">
      <h2>Tags</h2>
      <p>Tags</p>
    </div>
  </div>

  </div>
</template>


<script>
import ListNamespace from '@shell/pages/c/_cluster/_product/namespaces.vue';
import Home from '@shell/pages/home.vue';

import axios from 'axios';
import { BASE_URL, VLAN_LIST_URL } from '../config/api.ts';
import { CAPI, CATALOG, type, NODE, POD  } from '@shell/config/types';


export default {
    name: 'HomePage',
    components: {
      Home,
      ListNamespace
    },
    data() {
      return {
        isLoading: false,
        currentTab: 'tab1', // Initial tab
      };
    },
    methods: {
      changeTab(tabName) {
          this.currentTab = tabName;
      },
      showSpinner() {
        this.isLoading = true;
        // Hide the spinner after 5 seconds
        setTimeout(() => {
          this.hideSpinner();
        }, 3000);
      },

      hideSpinner() {
        this.isLoading = false;
      },

      testAPI() {
        // Define the request headers with the 'application/json' content type
        const headers = {
          'Content-Type': 'application/json',
           'Accept': 'application/json',
        };

        // Fetch the VLAN list from your API
        axios.get('/v1' ,{headers})
          .then(response => {
            this.test = response.data;
            console.log("test", this.test)
          })
          .catch(error => {
            console.error('Error fetching test:', error);
          });
      },
      
    },
    mounted() {
      this.$store.dispatch('management/findAll', { type: 'node'})
      .then(result => {
        console.log(result)
        // Iterate over the array and print the name and ID of each object
        result.forEach(cluster => {
          console.log('ID:', cluster.id);
          console.log('Kind:', cluster.kind);
        });
      })
      .catch(error => {
        // Handle any errors here
        console.error('Error fetching data:', error);
      });

      // this.$store.dispatch('management/create', { type: 'namespace', Name: "testing"})
      // .then(result => {
      //   console.log(result)
      //   // Iterate over the array and print the name and ID of each object
      //   result.forEach(cluster => {
      //     console.log('ID:', cluster.id);
      //     console.log('Kind:', cluster.kind);
      //   });
      // })
      // .catch(error => {
      //   // Handle any errors here
      //   console.error('Error fetching data:', error);
      // });
      this.testAPI();
      this.showSpinner();
    },
  };
</script>


<style lang="scss" scoped>
/* Your other styles */
.spinner-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent black background for the modal effect */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Make sure the spinner is on top of other elements */
}

.spinner-content {
  text-align: center;
}

.spinner-image {
  width: 100px; /* Adjust the size of your spinner image */
  height: 100px;
  animation: spin 2s linear infinite; /* Rotate the image indefinitely 
  /* You can add more styles to customize the appearance of your spinner image */
  border-radius: 50%; /* Make the image round */

}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Add your styling here */
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
  /* Style for tab content */
  h2 {
    color: #007bff;
  }

</style>
