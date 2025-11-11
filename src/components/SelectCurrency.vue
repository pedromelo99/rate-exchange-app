<template>
    <div class="select-currency-wrapper">
        <!-- Input com busca -->
        <div class="select-currency-input-group">
            <input v-model="searchQuery" type="text" class="select-currency-input" :placeholder="placeholder"
                @focus="isOpen = true" @blur="closeDropdown" @keydown.escape="isOpen = false"
                @keydown.arrow-down="selectNextOption" @keydown.arrow-up="selectPreviousOption"
                @keydown.enter="selectCurrentOption" />
            <span class="select-currency-icon">🔽</span>
        </div>

        <!-- Dropdown -->
        <transition name="dropdown">
            <div v-if="isOpen" class="select-currency-dropdown">
                <!-- Empty state -->
                <div v-if="filteredCurrencies.length === 0" class="select-currency-empty">
                    Nenhuma moeda encontrada
                </div>

                <!-- Lista de moedas -->
                <div v-else class="select-currency-list">
                    <button v-for="(currency, index) in filteredCurrencies" :key="currency.code"
                        :class="['select-currency-option', { active: index === highlightedIndex, selected: currency.code === modelValue }]"
                        @click="selectCurrency(currency.code)" @mouseenter="highlightedIndex = index">
                        <span class="currency-code">{{ currency.code }}</span>
                        <span class="currency-name">{{ currency.name }}</span>
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'SelectCurrency',
    props: {
        modelValue: {
            type: String,
            required: true,
        },
        currencies: {
            type: Object,
            required: true,
            default: () => ({}),
        },
        placeholder: {
            type: String,
            default: 'Selecionar moeda...',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            searchQuery: '',
            isOpen: false,
            highlightedIndex: 0,
        };
    },
    computed: {
        /**
         * Formata as moedas para exibição
         */
        formattedCurrencies() {
            return Object.entries(this.currencies).map(([code, name]) => ({
                code,
                name,
            }));
        },

        /**
         * Filtra moedas baseado na busca
         */
        filteredCurrencies() {
            if (!this.searchQuery) {
                return this.formattedCurrencies;
            }

            const query = this.searchQuery.toLowerCase();
            return this.formattedCurrencies.filter(
                currency =>
                    currency.code.toLowerCase().includes(query) ||
                    currency.name.toLowerCase().includes(query)
            );
        },

        /**
         * Texto do botão selecionado
         */
        selectedText() {
            const currency = this.formattedCurrencies.find(c => c.code === this.modelValue);
            return currency ? `${currency.code} - ${currency.name}` : this.modelValue;
        },
    },
    watch: {
        /**
         * Reset ao abrir dropdown
         */
        isOpen(newVal) {
            if (newVal) {
                this.highlightedIndex = 0;
                this.searchQuery = '';
            }
        },
    },
    methods: {
        /**
         * Seleciona uma moeda
         */
        selectCurrency(code) {
            this.$emit('update:modelValue', code);
            this.isOpen = false;
            this.searchQuery = '';
        },

        /**
         * Seleciona a opção destacada
         */
        selectCurrentOption() {
            if (this.filteredCurrencies.length > 0) {
                const selectedCode = this.filteredCurrencies[this.highlightedIndex].code;
                this.selectCurrency(selectedCode);
            }
        },

        /**
         * Seleciona próxima opção
         */
        selectNextOption() {
            if (!this.isOpen) {
                this.isOpen = true;
            } else if (this.highlightedIndex < this.filteredCurrencies.length - 1) {
                this.highlightedIndex++;
            }
        },

        /**
         * Seleciona opção anterior
         */
        selectPreviousOption() {
            if (this.isOpen && this.highlightedIndex > 0) {
                this.highlightedIndex--;
            }
        },

        /**
         * Fecha o dropdown
         */
        closeDropdown() {
            setTimeout(() => {
                this.isOpen = false;
            }, 200);
        },
    },
};
</script>

<style scoped>
.select-currency-wrapper {
    position: relative;
    width: 100%;
}

.select-currency-input-group {
    position: relative;
    display: flex;
    align-items: center;
}

.select-currency-input {
    width: 100%;
    padding: 10px 32px 10px 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
    background: white;
    color: #212529;
    transition: all 0.3s ease;
    cursor: pointer;
}

.select-currency-input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.select-currency-input:disabled {
    background: #e9ecef;
    opacity: 0.6;
    cursor: not-allowed;
}

.select-currency-icon {
    position: absolute;
    right: 10px;
    pointer-events: none;
    font-size: 12px;
    color: #999;
}

.select-currency-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 4px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    max-height: 300px;
    overflow-y: auto;
    animation: slideDown 0.2s ease-out;
}

.select-currency-empty {
    padding: 20px;
    text-align: center;
    color: #999;
    font-size: 13px;
}

.select-currency-list {
    display: flex;
    flex-direction: column;
}

.select-currency-option {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background: white;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;
    font-size: 14px;
}

.select-currency-option:hover {
    background: #f8f9fa;
}

.select-currency-option.active {
    background: #e7f3ff;
    border-left: 3px solid #007bff;
    padding-left: 13px;
}

.select-currency-option.selected {
    background: #e7f3ff;
    font-weight: 600;
    border-left: 3px solid #007bff;
    padding-left: 13px;
}

.currency-code {
    font-weight: 600;
    margin-right: 8px;
    min-width: 50px;
    color: #007bff;
}

.currency-name {
    color: #666;
    font-size: 12px;
    flex: 1;
}

/* Animações */
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.2s ease;
}

.dropdown-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Scrollbar personalizada */
.select-currency-dropdown::-webkit-scrollbar {
    width: 6px;
}

.select-currency-dropdown::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.select-currency-dropdown::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
}

.select-currency-dropdown::-webkit-scrollbar-thumb:hover {
    background: #999;
}

/* Modo escuro */
:global([data-bs-theme='dark']) .select-currency-input {
    background: #2a2a2a;
    border-color: #444444;
    color: #e0e0e0;
}

:global([data-bs-theme='dark']) .select-currency-input:focus {
    border-color: #6db3f2;
    box-shadow: 0 0 0 0.2rem rgba(109, 179, 242, 0.25);
}

:global([data-bs-theme='dark']) .select-currency-input:disabled {
    background: #1a1a1a;
}

:global([data-bs-theme='dark']) .select-currency-dropdown {
    background: #1e1e1e;
    border-color: #333333;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

:global([data-bs-theme='dark']) .select-currency-option {
    background: #1e1e1e;
    color: #e0e0e0;
}

:global([data-bs-theme='dark']) .select-currency-option:hover {
    background: #252525;
}

:global([data-bs-theme='dark']) .select-currency-option.active,
:global([data-bs-theme='dark']) .select-currency-option.selected {
    background: #2a4a6f;
    border-left-color: #6db3f2;
}

:global([data-bs-theme='dark']) .currency-code {
    color: #6db3f2;
}

:global([data-bs-theme='dark']) .currency-name {
    color: #b0b0b0;
}

:global([data-bs-theme='dark']) .select-currency-dropdown::-webkit-scrollbar-track {
    background: #252525;
}

:global([data-bs-theme='dark']) .select-currency-dropdown::-webkit-scrollbar-thumb {
    background: #444444;
}

:global([data-bs-theme='dark']) .select-currency-dropdown::-webkit-scrollbar-thumb:hover {
    background: #555555;
}

/* Responsivo */
@media (max-width: 576px) {
    .select-currency-input {
        font-size: 13px;
        padding: 8px 28px 8px 10px;
    }

    .select-currency-dropdown {
        max-height: 250px;
    }

    .select-currency-option {
        padding: 10px 12px;
        font-size: 13px;
    }

    .currency-code {
        min-width: 40px;
        margin-right: 6px;
    }

    .currency-name {
        font-size: 11px;
    }
}
</style>
