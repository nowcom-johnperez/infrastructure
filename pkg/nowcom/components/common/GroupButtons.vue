<template>
    <div class="nav-button-container">
        <template v-for="b in list">
            <button v-if="b.type === 'button'" class="button" @click="buttonHandler(b.action)">
                <i v-if="b.icon" class="fa fa-lg mr-5 text-primary" :class="b.icon"></i>
                {{ b.label }}
            </button>
            <div v-else class="dropdown">
                <button class="button">
                    <i v-if="b.icon" class="fa fa-lg mr-5 text-primary" :class="b.icon"></i> 
                    {{ b.label }}
                </button>
                <div class="dropdown-content">
                    <a v-for="link in b.links" :key="link.label" :href="link.href">
                        <i v-if="link.icon" class="fa fa-lg mr-5 text-primary" :class="link.icon"></i> 
                        {{ link.label }}
                    </a>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'GroupButtons',
    props: {
        list: {
            type: Array,
            required: true
        }
    },
    methods: {
        buttonHandler (action) {
            this.$emit('action', action);
        }
    }
}
</script>

<style scoped>
.nav-button-container {
display: inline-block;
border-bottom: 1px solid #6d6d6d;
padding: 1px
}

.button {
display: inline-block;
padding: 0 10px;
border: none;
background-color: transparent;
cursor: pointer;
margin-right: 5px;
border-radius: 0;
}

.button:hover {
background-color: #d1d1d1;
}

.dropdown {
position: relative;
display: inline-block;
}

.dropdown-content {
display: none;
position: absolute;
background-color: #f9f9f9;
min-width: 120px;
z-index: 1;
}

.dropdown-content a {
color: black;
padding: 12px 16px;
text-decoration: none;
display: block;
}

.dropdown-content a:hover {
background-color: #ddd;
}

.dropdown:hover .dropdown-content {
display: block;
}
</style>