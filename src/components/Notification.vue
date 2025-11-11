<template>
  <div class="notifications-container">
    <transition-group name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification', `notification-${notification.type}`]"
        :aria-live="notification.type === 'error' ? 'assertive' : 'polite'"
      >
        <div class="notification-content">
          <span class="notification-icon">
            <i :class="getIconClass(notification.type)"></i>
          </span>
          <span class="notification-message">{{ notification.message }}</span>
          <button
            class="notification-close"
            @click="onClose(notification.id)"
            aria-label="Fechar notificação"
          >
            ×
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'NotificationComponent',
  props: {
    notifications: {
      type: Array,
      required: true,
    },
  },
  emits: ['close'],
  methods: {
    getIconClass(type) {
      const icons = {
        success: 'bi bi-check-circle-fill',
        error: 'bi bi-exclamation-circle-fill',
        warning: 'bi bi-exclamation-triangle-fill',
        info: 'bi bi-info-circle-fill',
      };
      return icons[type] || 'bi bi-info-circle';
    },
    onClose(id) {
      this.$emit('close', id);
    },
  },
};
</script>

<style scoped>
.notifications-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
  pointer-events: none;
}

.notification {
  display: flex;
  align-items: flex-start;
  padding: 14px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  line-height: 1.4;
  animation: slideIn 0.3s ease-out;
  pointer-events: all;

  @media (max-width: 576px) {
    max-width: 90vw;
    right: auto;
    left: 10px;
  }
}

.notification-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 18px;
  margin-top: 1px;
}

.notification-message {
  flex: 1;
  word-break: break-word;
}

.notification-close {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
  padding: 0;
  margin-left: 8px;
  opacity: 0.7;
  transition: opacity 0.2s;
  flex-shrink: 0;

  &:hover {
    opacity: 1;
  }

  &:active {
    opacity: 0.5;
  }
}

/* Variações de tipo */
.notification-success {
  background-color: #d4edda;
  color: #155724;
  border-left: 4px solid #28a745;
}

.notification-error {
  background-color: #f8d7da;
  color: #721c24;
  border-left: 4px solid #dc3545;
}

.notification-warning {
  background-color: #fff3cd;
  color: #856404;
  border-left: 4px solid #ffc107;
}

.notification-info {
  background-color: #d1ecf1;
  color: #0c5460;
  border-left: 4px solid #17a2b8;
}

/* Animações */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  transform: translateX(400px);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(400px);
  opacity: 0;
}

.notification-move {
  transition: transform 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
