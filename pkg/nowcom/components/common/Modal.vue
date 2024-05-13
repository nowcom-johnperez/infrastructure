<template>
    <div class="modal-overlay">
      <div class="modal">
        <!-- Modal content -->
        <div>
            <slot name="content"></slot>
        </div>

        <!-- Buttons container with flex layout -->
        <div class="button-container">
            <slot name="footer"></slot>
        </div>
      </div>
    </div>
</template>

<script>
export default {
    name: 'Modal'
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 11;
}

.modal {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.button-container {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 20px;
  /* Add margin for spacing */
}

.theme-dark {
  .modal {
    background: #27292e;
  }
}
</style>