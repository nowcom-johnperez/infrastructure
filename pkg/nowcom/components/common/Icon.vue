<template>
    <font-awesome-icon :icon="icon" />
</template>
<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(far);
library.add(fas);

export default {
  name: 'Icon',
  components: {
    FontAwesomeIcon,
  },
  props: {
    icon: {
        type: String,
        required: true
    }
  }
};
</script>