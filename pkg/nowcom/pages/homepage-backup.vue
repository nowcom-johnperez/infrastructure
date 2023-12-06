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
    <!-- 
    <div>
      <Tabs :tabs="tabs" />
    </div> -->

  </div>
</template>


<script>
import ListNamespace from '@shell/pages/c/_cluster/_product/namespaces.vue';
import Home from '@shell/pages/home.vue';

import axios from 'axios';
import { BASE_URL, VLAN_LIST_URL } from '../config/api.ts';
import { CAPI, CATALOG, type } from '@shell/config/types';
import Tabs from "../components/Tabs.vue";

export default {
    name: 'HomePageBackup',
    components: {
      Tabs,
      Home,
      ListNamespace
    },
    data() {
      return {
        isLoading: false,
        tabs: [
        { label: "VM", content: "VM" },
        { label: "Storage", content: "Storage" },
        { label: "Network", content: "Network" },
      ],
      };
    },
    methods: {
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

</style>
