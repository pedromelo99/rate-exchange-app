/**
 * @file useExchangeCache.js
 * @description Composable para gerenciar cache de taxas de câmbio com reatividade
 */

import { ref, computed } from 'vue';
import ExchangeService from '../services/exchangeService';
import StorageService from '../services/storageService';

/**
 * Composable para gerenciar cache de câmbio
 */
export function useExchangeCache() {
  // Estado reativo
  const exchangeRate = ref(null);
  const convertedAmount = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const currencies = ref({});
  const conversions = ref([]);
  const notifications = ref([]);

  // Flags de controle
  const lastFetch = ref(0);
  const lastFrom = ref('');
  const lastTo = ref('');

  /**
   * Converte uma moeda
   */
  const convertCurrency = async (amount, from, to) => {
    // Validações
    if (!amount || amount <= 0) {
      convertedAmount.value = null;
      exchangeRate.value = null;
      return;
    }

    if (from === to) {
      convertedAmount.value = amount;
      exchangeRate.value = {
        from,
        to,
        rate: 1,
        timestamp: Date.now(),
      };
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const rate = await ExchangeService.getExchangeRate(from, to);
      exchangeRate.value = rate;
      convertedAmount.value = amount * rate.rate;
      lastFetch.value = Date.now();
      lastFrom.value = from;
      lastTo.value = to;

      // Salva a conversão no histórico
      const conversion = {
        id: `conv_${Date.now()}`,
        amount,
        fromCurrency: from,
        toCurrency: to,
        convertedAmount: convertedAmount.value,
        exchangeRate: rate.rate,
        timestamp: Date.now(),
        date: new Date().toLocaleString('pt-BR'),
      };

      StorageService.saveConversion(conversion);
      loadConversions();

      addNotification('Conversão realizada com sucesso', 'success', 2000);
    } catch (err) {
      error.value = err.message || 'Erro ao buscar taxa de câmbio';
      convertedAmount.value = null;
      exchangeRate.value = null;
      addNotification(error.value, 'error', 3000);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Carrega lista de moedas
   */
  const loadCurrencies = async () => {
    try {
      currencies.value = await ExchangeService.getCurrencies();
      if (Object.keys(currencies.value).length === 0) {
        throw new Error('Nenhuma moeda disponível');
      }
    } catch (err) {
      error.value = 'Erro ao carregar moedas. Usando lista padrão.';
      currencies.value = {
        USD: 'US Dollar',
        EUR: 'Euro',
        BRL: 'Brazilian Real',
        GBP: 'British Pound',
        JPY: 'Japanese Yen',
        CAD: 'Canadian Dollar',
        AUD: 'Australian Dollar',
        CHF: 'Swiss Franc',
        CNY: 'Chinese Yuan',
        INR: 'Indian Rupee',
      };
      console.error(err);
    }
  };

  /**
   * Carrega histórico de conversões
   */
  const loadConversions = () => {
    conversions.value = StorageService.getConversions();
  };

  /**
   * Limpa histórico de conversões
   */
  const clearConversions = () => {
    StorageService.clearConversions();
    conversions.value = [];
    addNotification('Histórico limpo', 'info', 2000);
  };

  /**
   * Remove uma conversão específica
   */
  const deleteConversion = (id) => {
    StorageService.deleteConversion(id);
    loadConversions();
    addNotification('Conversão removida', 'info', 2000);
  };

  /**
   * Exporta histórico como JSON
   */
  const exportConversions = () => {
    const data = JSON.stringify(conversions.value, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversoes_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification('Histórico exportado', 'success', 2000);
  };

  /**
   * Limpa cache de APIs
   */
  const clearCache = () => {
    ExchangeService.clearCache();
    addNotification('Cache limpo', 'info', 2000);
  };

  /**
   * Adiciona notificação
   */
  const addNotification = (message, type = 'info', duration = 3000) => {
    const notification = {
      id: `notif_${Date.now()}`,
      message,
      type,
      duration,
      timestamp: Date.now(),
    };

    notifications.value.push(notification);

    // Remove notificação após duration
    setTimeout(() => {
      notifications.value = notifications.value.filter(n => n.id !== notification.id);
    }, duration);
  };

  /**
   * Remove notificação
   */
  const removeNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id);
  };

  /**
   * Formata valor monetário
   */
  const formatAmount = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value);
  };

  /**
   * Computed: Conversões dos últimos 7 dias
   */
  const recentConversions = computed(() => {
    return conversions.value.slice(0, 10);
  });

  /**
   * Computed: Moedas mais usadas
   */
  const mostUsedCurrencies = computed(() => {
    const used = {};

    conversions.value.forEach(conv => {
      used[conv.fromCurrency] = (used[conv.fromCurrency] || 0) + 1;
      used[conv.toCurrency] = (used[conv.toCurrency] || 0) + 1;
    });

    return Object.entries(used)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([code]) => code);
  });

  return {
    // Estado
    exchangeRate,
    convertedAmount,
    isLoading,
    error,
    currencies,
    conversions,
    notifications,
    recentConversions,
    mostUsedCurrencies,

    // Métodos
    convertCurrency,
    loadCurrencies,
    loadConversions,
    clearConversions,
    deleteConversion,
    exportConversions,
    clearCache,
    addNotification,
    removeNotification,
    formatAmount,
  };
}

export default useExchangeCache;
