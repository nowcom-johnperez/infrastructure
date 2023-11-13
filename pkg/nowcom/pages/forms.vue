<script>
import axios from 'axios';
import AsyncButton from '@shell/components/AsyncButton';
import { _CREATE } from '@shell/config/query-params';
import { exceptionToErrorsArray } from '@shell/utils/error';
import { NAMESPACE, NODE, NORMAN} from '@shell/config/types';
import Namespace from '@shell/models/namespace';

export default {
components: {
    AsyncButton,
    exceptionToErrorsArray,
  },
  data() {
    return {
      errors:           [],
      value:           { name: '' },
      submitted:       false,
      mode:            _CREATE
    };
  },
  methods:{
    async submit(buttonCb) {

        try {
            console.log("test NAMESPACE")
            //await this.$refs.changePassword.save();
            this.value = await this.$store.dispatch('management/create', {
                type: NAMESPACE,
                metadata: {
                    name: 'testing',
                },
                kind: "Namespace",
                apiVersion: "v1",
                status: {
                    phase: "Active"
                }
            });

            console.log(this.$store.getters['defaultNamespace'])

            console.log(this.value)
            //"type":"namespace","metadata":{"annotations":{"field.cattle.io/containerDefaultResourceLimit":"{}"},"name":"testing"},"disableOpenApiValidation":false}
            this.show(false);
            buttonCb(true);
        } catch (err) {
            buttonCb(false);
        }
        },
    async createNamespace(buttonCb) {
        // Function to get the CSRF token from the 'CSRF' cookie
        function getCsrfTokenFromCookie() {
            const csrfCookieName = 'CSRF'; // Replace with your actual CSRF cookie name
            const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${csrfCookieName}=`));

            if (cookieValue) {
            return cookieValue.split('=')[1];
            }

            // Return a default value or handle the case where the cookie is not found
            return 'default-csrf-token';
        }

        const payload = {
            type: 'namespace',
            metadata: {
            annotations: {
                'field.cattle.io/containerDefaultResourceLimit': '{}',
            },
            name: 'testing',
            },
            disableOpenApiValidation: false,
        };

        // Make the request using Axios with the 'X-Api-Csrf' header set to the 'CSRF' cookie value
        axios
            .post(`/v1/namespaces`, payload, {
            headers: {
                'Content-Type': 'application/json', // Set the Content-Type header
                'X-Api-Csrf': getCsrfTokenFromCookie(), // Include CSRF token in the headers
            },
            withCredentials: true, // Enable sending and receiving cookies
            })
            .then(response => {
            // Handle the response here
            console.log('Namespace created:', response.data);
            })
            .catch(error => {
            // Handle any errors here
            console.error('Error creating namespace:', error);
            });
    }


     

    // Other methods here
  }

};
</script>
<template>
<AsyncButton
  type="submit"
  mode="apply"
  class="btn bg-error ml-10"
  value="LOGIN"
  @click="createNamespace"
/>
</template>