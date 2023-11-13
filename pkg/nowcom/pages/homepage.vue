<template>
  <div>
    <img src="../assets/img/nowcom.jpeg" />
    <h1 align=center>Home Page</h1>

    <div>
      <Tabs :tabs="tabs" />
    </div>

  </div>
</template>


<script>
import axios from 'axios';
import { BASE_URL, VLAN_LIST_URL } from '../config/api.ts';
import { CAPI, CATALOG, type } from '@shell/config/types';
import Tabs from "../components/Tabs.vue";

export default {
    name: 'HomePage',
    components: {
      Tabs,
    },
    data() {
      return {
        tabs: [
        { label: "VM", content: "VM" },
        { label: "Storage", content: "Storage" },
        { label: "Network", content: "Network" },
      ],
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
    },
  };
</script>


<style lang="scss" scoped>

</style>
