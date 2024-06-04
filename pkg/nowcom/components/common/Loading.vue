<template>
    <div v-if="loading" class="spinner-modal">
        <div class="spinner-content">
            <!-- You can use an image or any other content for the spinner -->
            <img src="../../assets/img/loading.png" alt="Loading Spinner" class="spinner-image" />
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Loading',
        props: {
            loading: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style scoped>
.spinner-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  /* Semi-transparent black background for the modal effect */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  /* Make sure the spinner is on top of other elements */
}

.spinner-content {
  text-align: center;
}

.spinner-image {
  width: 100px;
  /* Adjust the size of your spinner image */
  height: 100px;
  animation: spin 2s linear infinite;
  /* Rotate the image indefinitely 
        /* You can add more styles to customize the appearance of your spinner image */
  border-radius: 50%;
  /* Make the image round */
}


@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>