<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="$emit('close')">
      <div class="modal-window">
        <div class="modal-content">
          <slot />
        </div>
        <footer class="modal-footer">
          <slot name="footer">
            <button @click="$emit('close')">Close</button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<style scoped>
div.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  min-width: 350px;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

div.modal-window {
  width: 50%;
  min-width: 350px;
  max-width: 380px;
  min-height: 35%;
  height: 30%;
  background: #fff;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 35%;
  box-shadow: 15px 15px 5px 2px rgba(0, 0, 0, 0.664);
}

div.modal-content {
  padding: 10px 20px;
}

footer.modal-footer {
  background: #ccc;
  max-width: 380px;
  padding: 10px 0;
  text-align: right;
  position: fixed;
  display: flex;
  justify-content: center;
  width: 50%;
  min-width: 350px;
  bottom: 32.5%;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

/* 오버레이 트랜지션 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  /* 오버레이에 포함되어 있는 모달 윈도의 트랜지션 */
  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

/* 딜레이가 적용된 모달 윈도가 제거된 후에 오버레이가 사라짐 */
.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>
