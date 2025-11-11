<template>
    <div class="notifications-container">
        <transition-group name="notification" tag="div">
            <div v-for="notification in notifications" :key="notification.id"
                :class="['notification', `notification-${notification.type}`]"
                :aria-live="notification.type === 'error' ? 'assertive' : 'polite'">
                <div class="notification-content">
                    <span class="notification-icon">
                        <i :class="getIconClass(notification.type)"></i>
                    </span>
                    <span class="notification-message">{{ notification.message }}</span>
                    <button class="notification-close" @click="onClose(notification.id)"
                        aria-label="Fechar notificação">
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

@keyframes shake {
    0%, 100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-5px);
    }

    75% {
        transform: translateX(5px);
    }
}

@keyframes pulse {
    0%, 100% {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    50% {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    }
}

.notification {
    animation: slideIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55), pulse 0.5s ease-out;
}

.notification-close {
    transition: all 0.2s ease;
}

.notification-close:active {
    animation: shake 0.3s ease-out;
}
@media (max-width: 768px) {
    .notifications-container {
        top: 10px;
        right: 10px;
        max-width: 350px;
    }

    .notification {
        font-size: 13px;
        padding: 12px 14px;
    }
}

@media (max-width: 576px) {
    .notifications-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
    }

    .notification {
        font-size: 12px;
        padding: 10px 12px;
        border-radius: 6px;
    }

    .notification-icon {
        font-size: 16px;
    }

    .notification-message {
        font-size: 12px;
    }

    .notification-close {
        font-size: 20px;
        margin-left: 6px;
    }
}

@media (max-width: 360px) {
    .notification {
        font-size: 11px;
        padding: 8px 10px;
    }

    .notification-icon {
        font-size: 14px;
    }

    .notification-close {
        font-size: 18px;
    }
}

/* Modo escuro */
:global([data-bs-theme='dark']) .notification-success {
    background-color: #1e5631;
    color: #90ee90;
    border-left-color: #3a9d5d;
}

:global([data-bs-theme='dark']) .notification-error {
    background-color: #5f1e1e;
    color: #ff8888;
    border-left-color: #dc3545;
}

:global([data-bs-theme='dark']) .notification-warning {
    background-color: #5f4a1e;
    color: #ffdd66;
    border-left-color: #ffc107;
}

:global([data-bs-theme='dark']) .notification-info {
    background-color: #1e3a5f;
    color: #b3d9ff;
    border-left-color: #17a2b8;
}

:global([data-bs-theme='dark']) .notification-close {
    opacity: 0.6;
    transition: opacity 0.2s ease;
}

:global([data-bs-theme='dark']) .notification-close:hover {
    opacity: 1;
}
</style>
