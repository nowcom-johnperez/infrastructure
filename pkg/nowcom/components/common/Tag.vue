<template>
    <div class="tag">
        <span class="tag-content">
            <slot></slot>
        </span>
        <button v-if="showDelete" class="delete-tag" @click="$emit('delete')">&times;</button>
    </div>
</template>

<script>
export default {
    name: 'Tag',
    props: {
        showDelete: {
            type: Boolean,
            default: false
        },
    }
}
</script>

<style scoped>
.tag {
    display: inline-flex;
    align-items: center;
    border: 2px solid #0056b3; /* Rancher blue color */
    color: #0056b3; /* Rancher blue color for text */
    padding: 0 8px;
    border-radius: 4px;
    margin-right: 8px;
    height: 40px;
}

.tag-content {
    display: flex;
    align-items: center;
}

.delete-tag {
    background-color: transparent;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 1.5rem;
    margin-left: 4px;
    align-items: center;
    padding: 0;
}

.delete-tag:hover {
    color: #f00;
}

.delete-tag:focus {
    border: none;
    box-shadow: none;
}
</style>