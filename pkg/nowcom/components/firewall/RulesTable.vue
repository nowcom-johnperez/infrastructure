<template>
  <SortableTable :headers="headers" :rows="items" :rowActionsWidth="10" :rows-per-page="5" keyField="name" defaultSortBy="priority" defaultSortOrder="asc">
    <template #header-left>
      <div class="row table-heading" style="justify-items: center;">
        <cButton class="cbtn btn-light block mr-10 ml-10" @click="onCreateClick">
          <span class="fa fa-plus fa-lg mr-5"></span> Create
        </cButton>
      </div>
    </template>
    <template #cell:name="{row}">
      <a v-if="row.priority <= 999" href="#" @click.prevent="onRowClick(row)">{{ row.name || row.longName }}</a>
      <span v-else>{{ row.name || row.longName }}</span>
    </template>
    <template #cell:application="{row}">
      <!-- <table class="inside-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Ports</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="app in row.application">
            <td>{{ app.name }}</td>
            <td>{{ app.ports.join(',') }}</td>
          </tr>
        </tbody>
      </table> -->
      <span v-for="app in row.application" :key="`${app.name}-${row.name}`" class="formatted-cell">{{ app.name }}: {{ app.ports.join(', ') }}</span>
    </template>
    <template #cell:action="{row}">
      <span>
        <i v-if="row.action === 'Allow'" class="fa fa-check mr-5" aria-hidden="true" style="color: green"></i>
        <i v-else class="fa fa-close mr-5" aria-hidden="true" style="color: red"></i>
        {{ row.action }}
      </span>
    </template>
    <template #row-actions="{row}">
      <cButton class="cbtn btn-primary" :disabled="row.priority > 999" @click="onDeleteClick(row)">
        <span class="fa fa-trash fa-lg mr-5"></span>
        <span v-if="row.priority > 999" v-clean-tooltip="unavailableTooltipButton">Delete</span>
        <span v-else>Delete</span>
      </cButton>
    </template>
  </SortableTable>
</template>

<script>
import { RULES_HEADERS } from '../../config/table'
import SortableTable from '@shell/components/ResourceTable.vue'
import SideBar from '../Sidebar'
import cButton from '../common/Button'
export default {
  name: 'RulesTable',
  props: {
    vnetId: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  },
  components: {
    SortableTable,
    SideBar,
    cButton,
  },
  data() {
    return {
      headers: []
    }
  },
  computed: {
    unavailableTooltipButton() {
      return {
        content: 'Default security rules cannot be deleted',
        hideOnTargetClick: false,
      }
    },
  },
  methods: {
    onCreateClick () {
      this.$emit('onCreateClick', 'create')
    },
    onRowClick(row) {
      this.$emit('onRowClick', row)
    },
    onDeleteClick(row) {
      this.$emit('onDeleteClick', row)
    }
  },
  created() {
    this.headers = RULES_HEADERS;
  },
}
</script>

<style lang="scss" scoped>
.formatted-cell {
  white-space: pre-wrap;
  font-family: monospace;
  font-size: .9rem;
}
.inside-table {
  outline: 1px solid #f2f2f2;
  font-size: .9em;
  thead {
    tr {
      border-bottom: 1px solid #DCDEE7;
      background-color: #F4F5FA;
    }

    th {
      padding: 10px 20px;
    }
  }

  tbody {
    tr {
      border: 1px solid #f2f2f2;
    }

    td {
      padding: 10px 20px;
      text-align: center;
    }
  }
}
</style>