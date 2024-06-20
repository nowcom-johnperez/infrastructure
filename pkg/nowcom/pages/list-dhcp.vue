<template>
  <div class="base">
    <h1 class="text-label">DHCP</h1>
    <div class="mt-10 mb-10" v-if="response.show">
      <Alert :variant="response.variant" @close="response.show = false">{{ response.message }}</Alert>
    </div>

    <div class="form-row mt-10">
      <div class="form-column">
        <SortableTable 
          :headers="table.headers" 
          :rows="table.items" 
          :paging="true" 
          :rowActionsWidth="10" 
          :rows-per-page="5" 
          keyField="name" 
          :loading="table.loading"
          >
          <!-- <template #cell:name="{row}">
            <a href="#" @click.prevent="openSidebar(row)">{{ row.name }}</a>
          </template> -->
          <template #row-actions="row">
            <span>-</span>
            <!-- <cButton class="cbtn btn-primary" @click="openModal(row.row)" :disabled="loading">
              <span class="fa fa-trash fa-lg mr-5"></span> Delete
            </cButton> -->
          </template>
        </SortableTable>
        </br> </br>
      </div>
    </div>
  </div>
</template>

<script>
import SortableTable from '@shell/components/ResourceTable.vue'
import Alert from '../components/common/Alert'
import { DHCP_HEADERS, PLACEHOLDER_DATA } from '../config/table'
import { dhcpService } from '../services/api/dhcp';
export default {
  name: 'DHCPListing',
  components: {
    SortableTable,
    Alert
  },
  data() {
    return {
      table: {
        headers: [],
        items: [],
        loading: false,
      },
      response: {
        show: false,
        message: '',
        variant: 'error'
      }
    }
  },
  methods: {
    getUtilization (row) {
      return Math.round((row.used / row.available) * 100)
    },
    async fetchData() {
      this.table.loading = true
      try {
        const response = await dhcpService.getAll()
        // const response = PLACEHOLDER_DATA.items;

        this.table.items = response.map((d) => {
          return {
            name: d.metadata.name,
            subnet: d.spec.ipv4Config.cidr,
            available: `${d.status.ipv4.used }/${d.status.ipv4.available}`,
            utilization: this.getUtilization(d.status.ipv4) + " %"
          }
        })
      } catch (err) {
        this.response = {
          show: true,
          message: 'Fetching DHCP Data: Oops! Something went wrong!',
          variant: 'error'
        }
      } finally {
        this.table.loading = false
      }
    },
  },
  mounted() {
    this.table.headers = DHCP_HEADERS;
    this.fetchData()
  }
}
</script>