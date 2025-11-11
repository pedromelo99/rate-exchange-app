<template>
    <button class="dark-mode-toggle" @click="toggleDarkMode" :title="isDarkMode ? 'Modo claro' : 'Modo escuro'"
        :aria-label="isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'">
        <span v-if="isDarkMode" class="toggle-icon">☀️</span>
        <span v-else class="toggle-icon">🌙</span>
    </button>
</template>

<script>
const DARK_MODE_KEY = 'darkMode';

export default {
    name: 'DarkModeToggle',
    emits: ['toggle'],
    data() {
        return {
            isDarkMode: false,
        };
    },
    mounted() {
        this.loadDarkModePreference();
    },
    methods: {
        loadDarkModePreference() {
            const saved = localStorage.getItem(DARK_MODE_KEY);

            if (saved !== null) {
                this.isDarkMode = saved === 'true';
            } else {
                this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }

            this.applyDarkMode();
        },
        toggleDarkMode() {
            this.isDarkMode = !this.isDarkMode;
            localStorage.setItem(DARK_MODE_KEY, String(this.isDarkMode));
            this.applyDarkMode();
            this.$emit('toggle', this.isDarkMode);
        },
        applyDarkMode() {
            const html = document.documentElement;

            if (this.isDarkMode) {
                html.setAttribute('data-bs-theme', 'dark');
                html.style.setProperty('--bg-color', '#1a1a1a');
                html.style.setProperty('--text-color', '#ffffff');
                html.style.setProperty('--border-color', '#333333');
            } else {
                html.removeAttribute('data-bs-theme');
                html.style.setProperty('--bg-color', '#ffffff');
                html.style.setProperty('--text-color', '#000000');
                html.style.setProperty('--border-color', '#cccccc');
            }
        },
    },
};
</script>

<style scoped>
.dark-mode-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    background: none;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    font-size: 20px;
    transition: all 0.3s ease;
    color: #666;
}

.dark-mode-toggle:hover {
    background: #f0f0f0;
    border-color: #999;
    transform: scale(1.05);
}

.dark-mode-toggle:active {
    transform: scale(0.95);
    animation: pulse 0.3s ease-out;
}

.toggle-icon {
    display: inline-block;
    animation: rotate 0.3s ease;
}

@keyframes rotate {
    from {
        transform: rotate(-180deg) scale(0.8);
        opacity: 0;
    }

    to {
        transform: rotate(0) scale(1);
        opacity: 1;
    }
}

@keyframes pulse {
    0%, 100% {
        box-shadow: 0 0 0 0;
    }

    50% {
        box-shadow: 0 0 0 4px rgba(100, 150, 200, 0.2);
    }
}

/* Modo escuro */
:global([data-bs-theme='dark']) .dark-mode-toggle {
    border-color: #444444;
    color: #b0b0b0;
    background: transparent;
}

:global([data-bs-theme='dark']) .dark-mode-toggle:hover {
    background: #2a2a2a;
    border-color: #555555;
    color: #e0e0e0;
}

:global([data-bs-theme='dark']) .dark-mode-toggle:active {
    background: #1a1a1a;
}
</style>
