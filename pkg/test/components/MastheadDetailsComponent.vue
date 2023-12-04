<script>
import Banner from '@components/Banner/Banner.vue';

export default {
  name:       'MastheadDetailsComponent',
  components: { Banner },
  data() {
    return { key: 'asdasd' };
  }
};
</script>

<template>
  <div>
    <Banner
      color="primary"
    >
      Nowcom Masthead
    </Banner>
  </div>
</template>

<style lang="scss" scoped>

</style>
