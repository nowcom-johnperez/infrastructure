<template>
    <div class="tabs">
        <button v-for="(tab, index) in list" :key="index" class="tab" :class="{ 'active': current === index, 'disabled': tab.disabled }" :disabled="tab.disabled" @click="!tab.disabled && setActive(index)" v-tooltip="tab.disabled ? 'Coming soon' : ''">{{ tab.label }}</button>
    </div>
</template>

<script>
export default {
    name: 'Tabs',
    props: {
        list: {
            type: Array,
            required: true,
            // Each tab should be an object with `label` and optional `disabled` properties.
            validator(value) {
                return value.every(tab => typeof tab.label === 'string' && (tab.disabled === undefined || typeof tab.disabled === 'boolean'));
            }
        },
        current: {
            type: Number,
            required: true
        }
    },
    methods: {
        setActive(index) {
            this.$emit('set-active', index)
        }
    }
}
</script>