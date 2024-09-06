<script>
import IndentedPanel from '@shell/components/IndentedPanel';
import SortableTable from '@shell/components/SortableTable';
import { BadgeState } from '@components/BadgeState';
import { mapState } from 'vuex';
import { CAPI } from '@shell/config/types';
import { BLANK_CLUSTER } from '@shell/store/store-types.js';
import { PRODUCT_NAME, ENVIRONMENT } from '../../config/constants';
import { ENVIRONMENT_HEADERS } from '../../config/table'
import ModalStatus from '../environment/Modal-Status.vue';

export default {
  name:       'Environments',
  components: {
    IndentedPanel,
    SortableTable,
    BadgeState,
    ModalStatus
  },

  data() {
    const headers = ENVIRONMENT_HEADERS
    return {
      headers,
      statusModalState: false,
      selectedEnv: null,
      environmentList: [
        {
          status: 'Done',
          name: 'Prod-trident',
          size: 'Large',
          nodes: 6,
          state: {
            networks: true,
            firewall: true,
            git: true,
            keyvaults: true,
            cluster: true,
            services: true,
            certDNS: true
          }
        },
        {
          status: 'Processing',
          name: 'Dev-trident',
          size: 'Medium',
          nodes: 2,
          state: {
            networks: true,
            firewall: true,
            git: true,
            keyvaults: false,
            cluster: true,
            services: false,
            certDNS: false
          }
        }
      ]
    }
  },

  computed: {
    ...mapState(['managementReady']),
    canCreateCluster() {
      const schema = this.$store.getters['management/schemaFor'](CAPI.RANCHER_CLUSTER);

      return !!schema?.collectionMethods.find((x) => x.toLowerCase() === 'post');
    },

    createLocation() {
      return {
        name:   `${PRODUCT_NAME}-c-cluster-${ENVIRONMENT}-create`,
        params: {
          product:  PRODUCT_NAME,
          cluster:  BLANK_CLUSTER,
        },
      };
    },
  },

  methods: {
    getBadgeColor (status) {
      let color = 'clickable ml-20 mr-20'

      if (status === 'Processing') {
        color += ' bg-info'
      } else if (status === 'Done') {
        color += ' bg-success'
      } else {
        color += ' bg-error'
      }

      return color;
    },
    closeModalState() {
      this.statusModalState = false
      this.selectedEnv = null
    },
    openModalStatus(env) {
      console.log(`test`, env)
      this.selectedEnv = env
      this.statusModalState = true
    }
  }
};

</script>
<template>
  <div
    v-if="managementReady"
    class="home-page"
  >
    <IndentedPanel class="mt-20 mb-20">

      <div class="row home-panels">
        <div class="col main-panel">
          <div class="row panel">
            <div
              class="col span-12"
            >
              <SortableTable
                :table-actions="false"
                :row-actions="false"
                key-field="id"
                :rows="environmentList"
                :headers="headers"
                :loading="!environmentList"
                :paging="true" 
                :rows-per-page="10" 
              >
                <template #header-left>
                  <div class="row table-heading">
                    <h2 class="mb-0">
                      Environments
                    </h2>
                    <BadgeState
                      v-if="environmentList"
                      :label="environmentList.length.toString()"
                      color="role-tertiary ml-20 mr-20"
                    />
                  </div>
                </template>
                <template
                  v-if="canCreateCluster"
                  #header-middle
                >
                  <div class="table-heading">
                    <router-link
                      to="#"
                      class="btn btn-sm role-secondary"
                      data-testid="cluster-delete-button"
                    >
                      {{ t('environment.delete') }}
                    </router-link>
                    <router-link
                      v-if="canCreateCluster"
                      :to="createLocation"
                      class="btn btn-sm role-primary"
                      data-testid="cluster-create-button"
                    >
                      {{ t('generic.create') }}
                    </router-link>
                  </div>
                </template>
                <template #col:status="{row}">
                  <td>
                    <span @click="openModalStatus(row)">
                      <BadgeState
                      :label="row.status"
                      :color="getBadgeColor(row.status)"
                      />
                    </span>
                    
                  </td>
                </template>
              </SortableTable>

              <ModalStatus v-if="statusModalState" header-label="Status" :saving-modal-state="statusModalState" :status="selectedEnv?.state" @onClose="closeModalState" />
            </div>
          </div>
        </div>

      </div>
    </IndentedPanel>
  </div>
</template>
<style lang='scss' scoped>
  .home-panels {
    display: flex;
    align-items: stretch;
    .col {
      margin: 0
    }
    .main-panel {
      flex: auto;
    }

    .side-panel {
      margin-left: 1.75%;
    }
  }

  .set-login-page, .whats-new {
    > ::v-deep .banner__content {
      display: flex;

      > div {
        flex: 1;
      }
      > a {
        align-self: flex-end;
      }
    }
  }

  .banner.set-login-page {
    border: 1px solid var(--border);
  }
  .table-heading {
    align-items: center;
    display: flex;
    height: 39px;

    & > a {
      margin-left: 10px;
    }
  }
  .panel:not(:first-child) {
    margin-top: 20px;
  }
  .getting-started {
    align-items: flex-end;
    display: flex;

    > span {
      flex: 1;
      margin-right: 20px;
    }
  }
  .getting-started-btn {
    display: contents;
    white-space: nowrap;
  }

  .list-cluster-name {
    align-items: center;
    display: flex;

    .conditions-alert-icon {
      color: var(--error);
      margin-left: 4px;
    }
  }

  // Hide the side-panel showing links when the screen is small
  @media screen and (max-width: 996px) {
    .side-panel {
      display: none;
    }
  }
</style>
<style lang="scss">
.home-page {
  .search {
    align-items: center;
    display: flex;

    > INPUT {
      background-color: transparent;
      height: 30px;
      padding: 8px;
    }
  }

  h2 {
    font-size: 16px;
  }
}
</style>