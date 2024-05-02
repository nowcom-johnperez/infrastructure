<template>
    <div class="universal-table">
        <div class="">
            <input v-if="filters && Object.keys(filters).length > 0" v-model="filters.name.value" class="search" placeholder="Search" />
        </div>
        
        <div class="mt-10">
            <v-table
                :data="items"
                :current-page.sync="currentPage"
                :page-size="5"
                :filters="filters"
                @totalPagesChanged="totalPages = $event"
            >
                <thead slot="head">
                    <template v-for="header in headers">
                        <th v-if="!header.sortable">{{ header.title }}</th>
                        <v-th v-else :sort-key="header.sort">{{ header.title }}</v-th>
                    </template>
                </thead>
                <tbody slot="body" slot-scope="{displayData}">
                    <template v-if="displayData.length > 0">
                        <tr v-for="row in displayData" :key="row.name">
                            <template v-for="h in headers">
                                <td v-if="h.value.toLowerCase() !== 'action' && !h.main" >{{ row[h.value] }}</td>
                                <td v-else-if="h.value.toLowerCase() !== 'action' && h.main">
                                    <a @click.prevent="itemClick(row)">{{ row[h.value] }}</a>
                                </td>
                                <td v-else width="30">
                                    <cButton label="Delete" class="delete-button" @click="actionClick(row)" />
                                </td>
                            </template>
                        </tr>
                    </template>
                    <tr v-else>
                        <td :colspan="headers.length + 1" class="text-center">{{ noDataPlaceholder }}</td>
                    </tr>
                </tbody>
            </v-table>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import SmartTable from 'vuejs-smart-table';
import cButton from '../components/common/Button'
Vue.use(SmartTable);

export default {
    name: 'UniversalTable',
    components: {
        cButton
    },
    props: {
        headers: {
            type: Array,
            required: true
        },
        items: {
            type: Array,
            required: true
        },
        filters: {
            type: Object,
            default: () => {}
        },
        noDataPlaceholder: {
            type: String,
            default: "No items available",
        }
    },
    data() {
        return {
            currentPage: 1,
            totalPages: 0,
        }
    },
    methods: {
        itemClick (row) {
            this.$emit('item-click', row);
        },
        actionClick (row) {
            this.$emit('action-click', row);
        }
    },
    mounted() {
        console.log(`headers`, this.headers)
    }
}
</script>

<style scoped>
.universal-table {
    display: flex;
    flex-direction: column;
}
.text-center {
    align-items: center;
}

.search {
  text-align: left;
  width: 250px;
  /* Adjust the width as needed */
  /* Other styles as needed */
}

table {
  width: 100%;
  border-collapse: collapse;
  /* margin-top: 10px; */
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #297db4;
}

/* Override styles for the pagination list */
.smart-pagination .pagination {
    list-style-type: none;
    /* Remove bullet points */
    padding: 0;
    /* Remove default padding */
}

/* Override styles for the pagination items */
.smart-pagination .pagination li {
    display: inline-block;
    /* Display pagination items inline */
    margin-right: 5px;
    /* Add margin between pagination items */
}

/* Override styles for the pagination links */
.smart-pagination .pagination li a {
    /* Add your custom styles for the pagination links */
}

/* Override styles for the active pagination link */
.smart-pagination .pagination li.active a {
    /* Add your custom styles for the active pagination link */
}
</style>