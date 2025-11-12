<template>
    <div class="conversion-history-container" :class="{ 'bg-dark text-white': isDarkMode }">
        <div class="history-header">
            <h3>📊 Histórico de Conversões</h3>
            <div class="history-controls">
                <button class="btn btn-sm btn-outline-secondary" @click="toggleExpanded"
                    :title="expanded ? 'Recolher' : 'Expandir'">
                    {{ expanded ? '▼' : '▶' }} {{ conversions.length }} conversões
                </button>
            </div>
        </div>

        <transition name="expand">
            <div v-if="expanded" class="history-content">
                <!-- Sem histórico -->
                <div v-if="conversions.length === 0" class="empty-state">
                    <p>Nenhuma conversão realizada ainda.</p>
                    <small>Suas conversões aparecerão aqui.</small>
                </div>

                <!-- Lista de conversões -->
                <div v-else class="conversions-list">
                    <!-- Controles -->
                    <div class="list-controls">
                        <button class="btn btn-sm btn-outline-primary" @click="exportData"
                            :disabled="conversions.length === 0">
                            📥 Exportar
                        </button>
                        <button class="btn btn-sm btn-outline-danger" @click="clearHistory"
                            :disabled="conversions.length === 0">
                            🗑️ Limpar
                        </button>
                    </div>

                    <!-- Item de conversão -->
                    <div v-for="conversion in paginatedConversions" :key="conversion.id" class="conversion-item">
                        <div class="item-main">
                            <div class="conversion-arrow">
                                <span class="amount-from">{{ formatAmount(conversion.amount) }}</span>
                                <span class="currency-from">{{ conversion.fromCurrency }}</span>
                                <span class="arrow">→</span>
                                <span class="amount-to">{{ formatAmount(conversion.convertedAmount) }}</span>
                                <span class="currency-to">{{ conversion.toCurrency }}</span>
                            </div>
                            <div class="item-info">
                                <small class="rate">Taxa: 1 {{ conversion.fromCurrency }} =
                                    {{ formatAmount(conversion.exchangeRate) }} {{ conversion.toCurrency }}</small>
                                <br />
                                <small class="date">{{ conversion.date }}</small>
                            </div>
                        </div>
                        <button class="btn-delete" @click="removeConversion(conversion.id)" title="Remover">
                            ✕
                        </button>
                    </div>

                    <!-- Paginação -->
                    <div v-if="totalPages > 1" class="pagination">
                        <button :disabled="currentPage === 1" @click="currentPage--"
                            class="btn btn-sm btn-outline-secondary">
                            ← Anterior
                        </button>
                        <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
                        <button :disabled="currentPage === totalPages" @click="currentPage++"
                            class="btn btn-sm btn-outline-secondary">
                            Próxima →
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
const ITEMS_PER_PAGE = 5;

export default {
    name: 'ConversionHistory',
    props: {
        conversions: {
            type: Array,
            required: true,
            default: () => [],
        },
        isDarkMode: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['delete-conversion', 'clear-history', 'export'],
    data() {
        return {
            expanded: false,
            currentPage: 1,
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.conversions.length / ITEMS_PER_PAGE);
        },
        paginatedConversions() {
            const start = (this.currentPage - 1) * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            return this.conversions.slice(start, end);
        },
    },
    watch: {
        expanded() {
            this.currentPage = 1;
        },
    },
    methods: {
        toggleExpanded() {
            this.expanded = !this.expanded;
        },
        removeConversion(id) {
            this.$emit('delete-conversion', id);
        },
        clearHistory() {
            if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
                this.$emit('clear-history');
                this.currentPage = 1;
            }
        },
        exportData() {
            this.$emit('export');
        },
        formatAmount(value) {
            return new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
            }).format(value);
        },
    },
};
</script>

<style scoped>
.conversion-history-container {
    margin-top: 24px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #dee2e6;
}

.history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.history-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #212529;
}

.history-controls {
    display: flex;
    gap: 8px;
}

.history-content {
    animation: slideDown 0.3s ease-out;
}

.empty-state {
    text-align: center;
    padding: 24px;
    color: #6c757d;
}

.empty-state p {
    margin-bottom: 8px;
    font-weight: 500;
}

.conversions-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.list-controls {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #dee2e6;
}

.conversion-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 12px;
    background: white;
    border-radius: 6px;
    border-left: 3px solid #0d6efd;
    transition: box-shadow 0.2s;

    &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
}

.item-main {
    flex: 1;
}

.conversion-arrow {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 6px;
    font-weight: 500;
    flex-wrap: wrap;
}

.amount-from,
.amount-to {
    font-weight: 600;
    color: #212529;
}

.currency-from,
.currency-to {
    font-size: 12px;
    background: #f0f0f0;
    padding: 2px 6px;
    border-radius: 3px;
    color: #495057;
}

.arrow {
    margin: 0 4px;
    color: #6c757d;
}

.item-info {
    font-size: 12px;
    color: #6c757d;
}

.rate {
    display: inline-block;
    color: #0d6efd;
}

.date {
    display: inline-block;
    margin-top: 4px;
    color: #999;
}

.btn-delete {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    margin-left: 12px;
    padding: 0;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    color: #721c24;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;
    flex-shrink: 0;

    &:hover {
        background: #f5c6cb;
        border-color: #f1b0b7;
    }

    &:active {
        transform: scale(0.95);
    }
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #dee2e6;
}

.page-info {
    font-size: 14px;
    color: #6c757d;
    font-weight: 500;
}

/* Animações */
.expand-enter-active,
.expand-leave-active {
    transition: all 0.3s ease;
}

.expand-enter-from {
    max-height: 0;
    opacity: 0;
}

.expand-leave-to {
    max-height: 0;
    opacity: 0;
}

.expand-move {
    transition: transform 0.3s ease;
}

@keyframes slideDown {
    from {
        max-height: 0;
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        max-height: 500px;
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes itemSlide {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes pulse {

    0%,
    100% {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    50% {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
}

.history-content {
    animation: slideDown 0.3s ease-out;
}

.conversion-item {
    animation: itemSlide 0.3s ease-out backwards;
    transition: all 0.3s ease;
}

.conversion-item:hover {
    animation: pulse 1s ease-in-out infinite;
}

.btn-delete {
    transition: all 0.2s ease;
}

.btn-delete:hover {
    transform: scale(1.1);
    animation: pulse 0.4s ease-out;
}

/* Responsivo */
@media (max-width: 768px) {
    .conversion-history-container {
        margin-top: 16px;
        padding: 12px;
    }

    .history-header {
        flex-direction: column;
        gap: 10px;
    }

    .history-header h3 {
        font-size: 16px;
    }

    .conversion-item {
        padding: 10px;
        border-radius: 4px;
    }

    .conversion-arrow {
        font-size: 13px;
    }

    .item-info {
        font-size: 11px;
    }

    .pagination {
        gap: 8px;
    }

    .page-info {
        font-size: 12px;
    }
}

@media (max-width: 576px) {
    .conversion-history-container {
        margin-top: 12px;
        padding: 10px;
        border-radius: 6px;
    }

    .history-header h3 {
        font-size: 14px;
        margin: 0;
    }

    .history-controls button {
        font-size: 11px;
        padding: 6px 10px;
    }

    .list-controls {
        flex-direction: column;
        gap: 6px;
        margin-bottom: 10px;
    }

    .list-controls button {
        font-size: 12px;
        padding: 6px 12px;
        width: 100%;
    }

    .conversion-item {
        flex-direction: column;
        padding: 8px;
    }

    .btn-delete {
        margin-left: 0;
        margin-top: 8px;
        width: 28px;
        height: 28px;
    }

    .conversion-arrow {
        font-size: 12px;
        gap: 2px;
        margin-bottom: 4px;
        flex-wrap: wrap;
    }

    .amount-from,
    .amount-to {
        font-size: 13px;
    }

    .currency-from,
    .currency-to {
        font-size: 10px;
        padding: 1px 4px;
    }

    .item-info {
        font-size: 10px;
    }

    .rate,
    .date {
        display: block;
        margin-top: 2px;
    }

    .pagination {
        flex-wrap: wrap;
        justify-content: center;
        gap: 6px;
        margin-top: 10px;
    }

    .pagination button {
        font-size: 11px;
        padding: 4px 10px;
    }

    .page-info {
        font-size: 11px;
        width: 100%;
    }

    .empty-state {
        padding: 16px;
    }

    .empty-state p {
        font-size: 13px;
        margin-bottom: 6px;
    }

    .empty-state small {
        font-size: 11px;
    }
}

@media (max-width: 360px) {
    .conversion-history-container {
        padding: 8px;
        margin-top: 8px;
    }

    .history-header h3 {
        font-size: 12px;
    }

    .conversion-arrow {
        font-size: 11px;
    }

    .list-controls button {
        font-size: 11px;
        padding: 5px 10px;
    }
}

/* Modo escuro */
.conversion-history-container.bg-dark {
    background-color: #252d45 !important;
    border-color: #3d4566 !important;
}

.conversion-history-container.bg-dark .history-header h3 {
    color: #ffffff !important;
}

.conversion-history-container.bg-dark .history-header {
    border-color: #3d4566 !important;
}

.conversion-history-container.bg-dark .list-controls {
    border-bottom-color: #3d4566 !important;
}

.conversion-history-container.bg-dark .conversion-item {
    background-color: #1e2637 !important;
    border-left-color: #3a9d5d !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
}

.conversion-history-container.bg-dark .amount-from,
.conversion-history-container.bg-dark .amount-to {
    color: #ffffff !important;
}

.conversion-history-container.bg-dark .currency-from,
.conversion-history-container.bg-dark .currency-to {
    background-color: #333333 !important;
    color: #b0b0b0 !important;
}

.conversion-history-container.bg-dark .arrow {
    color: #888888 !important;
}

.conversion-history-container.bg-dark .item-info {
    color: #b0b0b0 !important;
}

.conversion-history-container.bg-dark .rate {
    color: #6db3f2 !important;
}

.conversion-history-container.bg-dark .date {
    color: #888888 !important;
}

.conversion-history-container.bg-dark .btn-delete {
    background-color: #5f1e1e !important;
    border-color: #8f2a2a !important;
    color: #ff8888 !important;
}

.conversion-history-container.bg-dark .btn-delete:hover {
    background-color: #8f2a2a !important;
    border-color: #b83a3a !important;
}

.conversion-history-container.bg-dark .pagination {
    border-top-color: #3d4566 !important;
}

.conversion-history-container.bg-dark .page-info {
    color: #b0b0b0 !important;
}

.conversion-history-container.bg-dark .empty-state {
    color: #888888 !important;
}

.conversion-history-container.bg-dark .empty-state p {
    color: #b0b0b0 !important;
}

.conversion-history-container.bg-dark .btn-outline-secondary,
.conversion-history-container.bg-dark .btn-outline-primary,
.conversion-history-container.bg-dark .btn-outline-danger {
    border-color: #3d4566 !important;
    color: #f0f0f0 !important;
}

.conversion-history-container.bg-dark .btn-outline-secondary:hover,
.conversion-history-container.bg-dark .btn-outline-primary:hover,
.conversion-history-container.bg-dark .btn-outline-danger:hover {
    background-color: #3d4566 !important;
    border-color: #5d6d8e !important;
    color: #ffffff !important;
}
</style>
