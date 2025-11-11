<template>
  <button
    class="dark-mode-toggle"
    @click="toggleDarkMode"
    :title="isDarkMode ? 'Modo claro' : 'Modo escuro'"
    :aria-label="isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'"
  >
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

  &:hover {
    background: #f0f0f0;
    border-color: #999;
  }

  &:active {
    transform: scale(0.95);
  }
}

.toggle-icon {
  display: inline-block;
  animation: rotate 0.3s ease;
}

@keyframes rotate {
  from {
    transform: rotate(-180deg);
    opacity: 0;
  }
  to {
    transform: rotate(0);
    opacity: 1;
  }
}

/* Modo escuro */
:global([data-bs-theme='dark']) .dark-mode-toggle {
  border-color: #555;
  color: #aaa;

  &:hover {
    background: #333;
    border-color: #777;
  }
}
</style>
