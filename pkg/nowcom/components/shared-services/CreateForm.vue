<template>
  <form @submit.prevent="submitForm">
    <div class="shared-services-form-container">
      <div class="mt-5">
        <CardImgSelect :options="listing" @onSelect="(name) => selected.service = name" class="mt-5" :current="selected.service" />
      </div>

      <div class="mt-15 pl-25">
        <ElasticSearchForm v-if="selected.service === 'Elasticsearch'" :environments="environments" v-model="formData.elasticsearch" />
        <RedisForm v-if="selected.service === 'Redis'" :environments="environments" v-model="formData.redis" />
        <DatabaseForm v-if="selected.service === 'Database'" :environments="environments" v-model="formData.database" />
      </div>
    </div>

    <div class="footer">
      <div class="form-column-bottom">
        <button type="submit" class="btn role-primary ml-10" @click="createSharedService">
          Create
        </button>
        <button type="button" class="btn role-secondary ml-10" @click="closeEnv">
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import Select from '@shell/components/form/Select.vue';
import CardImgSelect from '../common/CardImgSelection.vue';
import ElasticSearchForm from './ElasticSearchForm.vue';
import RedisForm from './RedisForm.vue';
import DatabaseForm from './DatabaseForm.vue';
import { HOME, PRODUCT_NAME, SHARED_SERVICES_LISTING, ENVIRONMENT_DATA } from '../../config/constants';
export default {
  name: 'SharedServicesCreateForm',
  components: {
    Select,
    CardImgSelect,
    ElasticSearchForm,
    RedisForm,
    DatabaseForm
  },
  data() {
    const listing = SHARED_SERVICES_LISTING;
    const environments = ENVIRONMENT_DATA;
    return {
      selected: {
        service: '',
      },
      formData: {
        elasticsearch: {
          name: '',
          environment: '',
          networkHost: '0.0.0.0',
          httpPort: 9200,
          transportPort: 9300,
          security: {
            enabled: true,
            transportSSL: true,
            httpSSL: true
          },
          indexing: {
            shards: 5,
            replicas: 1
          }
        },
        redis: {
          name: '',
          environment: '',
        },
        database: {
          name: '',
          environment: '',
          host: '',
          username: '',
          password: ''
        }
      },
      listing,
      environments,
    }
  },
  methods: {
    createSharedService () {
      this.savingModalState = true

      setTimeout(() => {
        this.saving.cluster = true
        this.saving.networks = true
      }, 1500)
    },
    closeEnv() {
      this.$router.push({
        name: `${PRODUCT_NAME}-c-cluster-${HOME}`,
      })
    },
    submitForm() {
      console.log(`ofrm`, this.formData)
    }
  },
}
</script>

<style lang="scss" scoped>
  .input-container {
    width: 470px !important
  }

  // .shared-services-form-container {
  //   display: flex;
  // }

  /* Add this style to position the buttons at the bottom */
  .footer {
    position: fixed;
    bottom: 0;
    border-top: 2px solid #9c9393;
    width: 80%;
    padding: 20px 0;
    background-color: #fff;
  }

  .theme-dark .footer {
    background-color: #1b1c21;
  }

  .form-column-bottom {
    display: flex;
    justify-content: start;
  }
</style>