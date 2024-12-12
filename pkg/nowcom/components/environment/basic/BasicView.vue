<template>
  <div class="details-table">
    <div class="basic-grid">
      <div>
        <h1 class="text-2xl mt-10 text-primary">Environment Specs</h1>
        <div class="row-detail">
          <div class="row-label">Name</div>
          <div class="row-val">{{ currentObj.spec.environmentName }}</div>
        </div>

        <!-- <div class="row-detail">
          <div class="row-label">Namespace</div>
          <div class="row-val">{{ currentObj.metadata?.annotations?.[`${BREACHER_API}/namespace`] || '' }}</div>
        </div> -->
        <!-- <div class="row-detail">
          <div class="row-label">Kubernetes</div>
          <div class="row-val">rke2 version</div>
        </div>

        <div class="row-detail">
          <div class="row-label">Harvester Cluster</div>
          <div class="row-val">els-cybraindev01</div>
        </div>

        <div class="row-detail">
          <div class="row-label">OS</div>
          <div class="row-val">linux (ubuntu 22.04)</div>
        </div> -->

        <div class="row-detail">
          <div class="row-label">Network Type</div>
          <div class="row-val">{{ currentObj.spec.networkType }}</div>
        </div>

        <div class="row-detail">
          <div class="row-label">Network Policy</div>
          <div class="row-val">{{ currentObj.spec.networkPolicy }}</div>
        </div>

        <!-- <div class="row-detail">
          <div class="row-label">DNS</div>
          <div class="row-val">{{ currentObj.dns }}</div>
        </div> -->

        <div class="row-detail">
          <div class="row-label">Github</div>
          <div class="row-val">{{ currentObj.github || 'not available' }}</div>
        </div>

        <!-- <div class="row-detail">
          <div class="row-label">Status</div>
          <div class="row-val">
            <BadgeState
              :label="currentObj.status"
              :color="badgeColor"
            />
          </div>
        </div> -->

      </div>
      
      <div>
        <h1 class="text-2xl mt-10 text-primary">Node Information</h1>
        <div class="row-detail">
          <div class="row-label">Size</div>
          <div class="row-val">{{ currentObj.spec.clusterSize.toUpperCase() }}</div>
        </div>

        <div>
          <NodeInfo :node="getSizeInfo.master" />
          <NodeInfo v-if="getSizeInfo.worker" class="mt-10" :node="getSizeInfo.worker" />
        </div>


        <h1 class="text-2xl mt-20 text-primary">Additional Information</h1>
        <div class="row-detail">
          <div class="row-label">Organization Name</div>
          <div class="row-val">{{ currentObj.metadata?.annotations?.[`${BREACHER_API}/org`] }}</div>
        </div>

        <div class="row-detail">
          <div class="row-label">Team Name</div>
          <div class="row-val">{{ currentObj.metadata?.annotations?.[`${BREACHER_API}/team`] }}</div>
        </div>
      </div>
    </div>
    <hr>

    <h1 class="text-2xl mt-10 text-primary">Features</h1>
    <div class="basic-grid">
      <div>
        <div class="row-detail">
          <div class="row-label">Keyvault</div>
          <div class="row-val">Enabled</div>
        </div>

        <div class="row-detail">
          <div class="row-label">Github</div>
          <div class="row-val">Enabled</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getConfig } from '../../../config/api';
import { getBadgeColor } from '../../../services/helpers/environment';
import { ENVIRONMENT_SIZES } from '../../../config/constants';
import { BadgeState } from '@components/BadgeState';
import NodeInfo from '../NodeInfo.vue';
const { BREACHER_API } = getConfig()
export default {
  name: 'BasicView',
  props: {
    currentObj: {
      type: Object,
      required: true
    }
  },
  data() {
    const sizeList = ENVIRONMENT_SIZES
    return {
      sizeList,
      BREACHER_API
    }
  },
  components: {
    BadgeState,
    NodeInfo
  },
  computed: {
    badgeColor () {
      return getBadgeColor(this.currentObj.status, true)
    },
    getSizeInfo () {
      const size = this.sizeList.find((s) => s.size.toLocaleLowerCase() === this.currentObj.spec.clusterSize)
      return size
    }
  }
}
</script>