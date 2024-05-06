<template>
    <div class="tag">
        <slot></slot>
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
  display: inline-block;
  background-color: #e0e0e0;
  color: #333;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 8px;
}

.delete-tag {
    background-color: transparent;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 1.5rem;
    margin-left: 4px;
    width: 10px;
}

.delete-tag:hover {
  color: #f00;
}

.delete-tag:focus {
    border: none;
    box-shadow: none;
}
</style>