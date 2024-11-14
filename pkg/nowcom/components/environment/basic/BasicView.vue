<template>
  <div class="details-table">
    <div class="basic-grid">
      <div>
        <div class="row-detail">
          <div class="row-label">Name</div>
          <div class="row-val">{{ currentObj.name }}</div>
        </div>

        <div class="row-detail">
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
        </div>

        <div class="row-detail">
          <div class="row-label">Firewall Policy</div>
          <div class="row-val">{{ currentObj.firewallPolicy }}</div>
        </div>

        <div class="row-detail">
          <div class="row-label">Github</div>
          <div class="row-val">{{ currentObj.github || 'not available' }}</div>
        </div>

        <div class="row-detail">
          <div class="row-label">Status</div>
          <div class="row-val">
            <BadgeState
              :label="currentObj.status"
              :color="badgeColor"
            />
          </div>
        </div>

      </div>
      
      <div>
        <div class="row-detail">
          <div class="row-label">Size</div>
          <div class="row-val">{{ currentObj.size.toUpperCase() }}</div>
        </div>

        <div class="row-detail">
          <div class="row-label">Role</div>
          <div class="row-val">{{ getSizeInfo.master.role }}</div>
        </div>

        <div class="row-detail">
          <div class="row-label">CPU</div>
          <div class="row-val">{{ getSizeInfo.master.cpu }}</div>
        </div>

        <div class="row-detail">
          <div class="row-label">RAM</div>
          <div class="row-val">{{ getSizeInfo.master.memory }}G</div>
        </div>

        <div class="row-detail">
          <div class="row-label">Machines</div>
          <div class="row-val">{{ getSizeInfo.master.machineCount }}</div>
        </div>

        <template v-if="getSizeInfo.worker">
          <hr>
          <div class="row-detail">
            <div class="row-label">Role</div>
            <div class="row-val">{{ getSizeInfo.worker.role }}</div>
          </div>
          <div class="row-detail">
            <div class="row-label">CPU</div>
            <div class="row-val">{{ getSizeInfo.worker.cpu }}</div>
          </div>
          <div class="row-detail">
            <div class="row-label">RAM</div>
            <div class="row-val">{{ getSizeInfo.worker.memory }}G</div>
          </div>
          <div class="row-detail">
            <div class="row-label">Machines</div>
            <div class="row-val">{{ getSizeInfo.worker.machineCount }}</div>
          </div>
        </template>
      </div>
    </div>
    <hr>

    <h1 class="text-2xl mt-10">Features</h1>
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
import { getBadgeColor } from '../../../services/helpers/environment';
import { ENVIRONMENT_SIZES } from '../../../config/constants';
import { BadgeState } from '@components/BadgeState';
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
      sizeList
    }
  },
  components: {
    BadgeState,
  },
  computed: {
    badgeColor () {
      return getBadgeColor(this.currentObj.status, true)
    },
    getSizeInfo () {
      const size = this.sizeList.find((s) => s.size.toLocaleLowerCase() === this.currentObj.size)
      return size
    }
  }
}
</script>