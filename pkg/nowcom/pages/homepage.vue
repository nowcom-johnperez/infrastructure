<script>
import axios from 'axios';
import { BASE_URL, VLAN_LIST_URL } from '../config/api.ts';
import { CAPI, CATALOG, type } from '@shell/config/types';
  
export default {
    name: 'HomePage',
    data() {
      return {
      };
    },
    methods: {
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
      .then(CLUSTER => {
        console.log(CLUSTER)
        // Iterate over the array and print the name and ID of each object
        CLUSTER.forEach(cluster => {
          console.log('ID:', cluster.id);
          console.log('Kind:', cluster.kind);
        });
      })
      .catch(error => {
        // Handle any errors here
        console.error('Error fetching data:', error);
      });
      this.testAPI();
    },
  };
</script>

<template>
  <div>
    <img src="../assets/img/nowcom.jpeg" />
    <h1 align=center>Home Page</h1>
  </div>
</template>

<style lang="scss" scoped>

</style>
