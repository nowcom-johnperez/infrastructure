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
              <EnvironmentActions :is-grid-view="true" :search-query="searchQuery" @set-view="(view) => viewState = view">
                <template #header>
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
              </EnvironmentActions>
              
              <EnvironmentListView v-if="viewState === 'list'" :list="environmentList" />
              <EnvironmentGridView v-if="viewState === 'grid'" :list="environmentList" />
              <ModalStatus v-if="statusModalState" header-label="Status" :saving-modal-state="statusModalState" :status="selectedEnv?.state" @onClose="closeModalState" />
            </div>
          </div>
        </div>

      </div>
    </IndentedPanel>
  </div>
</template>

<script>
import IndentedPanel from '@shell/components/IndentedPanel';
import { BadgeState } from '@components/BadgeState';
import { mapState } from 'vuex';
import { EventBus } from '../../config/event-bus';
import ModalStatus from '../environment/Modal-Status.vue';
import EnvironmentActions from '../environment/EnvironmentActions.vue';
import EnvironmentGridView from '../environment/EnvironmentGridView.vue';
import EnvironmentListView from '../environment/EnvironmentListView.vue';

export default {
  name:       'Environments',
  components: {
    IndentedPanel,
    BadgeState,
    ModalStatus,
    EnvironmentActions,
    EnvironmentGridView,
    EnvironmentListView
  },

  data() {
    return {
      statusModalState: false,
      selectedEnv: null,
      searchQuery: '',
      viewState: 'grid',
      environmentList: [
        {
          status: 'Done',
          name: 'Prod-trident',
          size: 'Large',
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
  },

  methods: {
    closeModalState() {
      this.statusModalState = false
      this.selectedEnv = null
    },
    openModalStatus(env) {
      this.selectedEnv = env
      this.statusModalState = true
    }
  },
  mounted() {
    EventBus.$on('env-modal-status', this.openModalStatus)
  },
  beforeDestroy() {
    EventBus.$off('env-modal-status')
  }
};

</script>

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