<template>
  <div class="coming-soon">
    <div class="content">
      <img src="../../assets/img/404-error.jpg" alt="Under Construction" />
      <h1>{{ msg }}</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  props: {
    msg: {
      type: String,
      default: "404 Not Found!"
    }
  }
};
</script>

<style scoped>
.coming-soon {
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 100vh; */
}

.content {
  text-align: center;
}

h1 {
  font-size: 3rem;
  color: #333;
  margin-bottom: 20px;
}

img {
  max-width: 100%;
  height: auto;
}
</style>
