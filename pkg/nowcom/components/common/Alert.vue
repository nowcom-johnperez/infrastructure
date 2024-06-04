<template>
    <div class="alert" :class="[variant]">
        <span class="alert-close" @click="close">&times;</span> 
        <strong><i class="fa fa-lg mr-10" :class="icon"></i></strong> <slot>This is a default message.</slot>
    </div>
</template>

<script>
export default {
    name: 'Alert',
    props: {
        variant: {
            type: String,
            default: 'default'
        }
    },
    computed: {
        icon () {
            switch (this.variant) {
                case 'success':
                    return 'fa-thumbs-up';
                case 'warning':
                    return 'fa-exclamation-triangle';
                case 'error':
                    return 'fa-exclamation'
                default:
                    return ''
            }
        }
    },
    methods: {
        close() {
            this.$emit('close')
        }
    }
}
</script>

<style scoped>
.alert {
  padding: 20px;
  background-color: #dddddd;
  color: white;
}

.error {
    background-color: #dc3545;
}

.success {
    background-color: #28a745;
}

.warning {
    background-color: #bebb00d0;
}

.alert-close {
  margin-left: 15px;
  color: white;
  font-weight: bold;
  float: right;
  font-size: 22px;
  line-height: 20px;
  cursor: pointer;
  transition: 0.3s;
}

.alert-close:hover {
  color: black;
}
</style>