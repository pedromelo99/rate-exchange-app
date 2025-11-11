/**
 * @file exchangeService.js
 * @description Serviço para chamadas à API de câmbio com caching e retry logic
 */

import axios from 'axios';

// API Base URL - Frankfurter (API pública e gratuita)
const API_BASE_URL = 'https://api.frankfurter.app';

// Constantes de cache
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 segundo

/**
 * Cache em memória para taxas de câmbio
 */
class ExchangeCache {
    constructor() {
        this.cache = new Map();
    }

    get(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;

        if (Date.now() > cached.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    set(key, data, duration = CACHE_DURATION) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            expiresAt: Date.now() + duration,
        });
    }

    clear() {
        this.cache.clear();
    }
}

const cache = new ExchangeCache();

/**
 * Serviço para chamadas à API de câmbio
 */
class ExchangeService {
    /**
     * Busca a lista de moedas disponíveis
     */
    static async getCurrencies() {
        const cacheKey = 'currencies';
        const cached = cache.get(cacheKey);

        if (cached) {
            return cached;
        }

        try {
            const response = await this.axiosWithRetry(
                `${API_BASE_URL}/currencies`
            );

            const currencies = response.data;

            // Cache por 24 horas já que a lista muda raramente
            cache.set(cacheKey, currencies, 24 * 60 * 60 * 1000);

            return currencies;
        } catch (error) {
            console.error('Erro ao buscar moedas:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Busca a taxa de câmbio entre duas moedas
     */
    static async getExchangeRate(from, to) {
        const cacheKey = `rate_${from}_${to}`;
        const cached = cache.get(cacheKey);

        if (cached) {
            return cached;
        }

        try {
            const response = await this.axiosWithRetry(
                `${API_BASE_URL}/latest?from=${from}&to=${to}`
            );

            const rate = response.data.rates[to];

            const exchangeRate = {
                from,
                to,
                rate,
                timestamp: Date.now(),
            };

            cache.set(cacheKey, exchangeRate);

            return exchangeRate;
        } catch (error) {
            console.error('Erro ao buscar taxa de câmbio:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Busca dados históricos de taxas de câmbio
     */
    static async getHistoricalRates(from, to, days = 7) {
        const cacheKey = `history_${from}_${to}_${days}`;
        const cached = cache.get(cacheKey);

        if (cached) {
            return cached;
        }

        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const startDateStr = startDate.toISOString().split('T')[0];
            const endDateStr = endDate.toISOString().split('T')[0];

            const response = await this.axiosWithRetry(
                `${API_BASE_URL}/${startDateStr}..${endDateStr}?from=${from}&to=${to}`
            );

            const rates = response.data.rates;

            // Cache por 1 hora
            cache.set(cacheKey, rates, 60 * 60 * 1000);

            return rates;
        } catch (error) {
            console.error('Erro ao buscar histórico:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Converte um valor de uma moeda para outra
     */
    static async convertCurrency(amount, from, to) {
        const rate = await this.getExchangeRate(from, to);
        return amount * rate.rate;
    }

    /**
     * Faz requisição axios com retry automático
     */
    static async axiosWithRetry(url, retries = 0) {
        try {
            return await axios.get(url, {
                timeout: 10000,
            });
        } catch (error) {
            // Se é erro de rede e ainda temos retries, tenta novamente
            if (retries < MAX_RETRIES && this.isRetryableError(error)) {
                await new Promise(resolve =>
                    setTimeout(resolve, RETRY_DELAY * (retries + 1))
                );
                return this.axiosWithRetry(url, retries + 1);
            }

            throw error;
        }
    }

    /**
     * Verifica se o erro é retentável
     */
    static isRetryableError(error) {
        if (!error.response) {
            // Erro de rede
            return true;
        }

        // Retry em status 5xx
        const status = error.response.status;
        return status >= 500 || status === 429; // 429 = Too Many Requests
    }

    /**
     * Manipula erros da API
     */
    static handleError(error) {
        if (error.response) {
            return {
                message: error.response.data?.error || 'Erro ao acessar API',
                code: `HTTP_${error.response.status}`,
                details: error.response.data,
            };
        }

        if (error.request) {
            return {
                message: 'Sem resposta do servidor. Verifique sua conexão.',
                code: 'NO_RESPONSE',
            };
        }

        return {
            message: error.message || 'Erro desconhecido',
            code: 'UNKNOWN_ERROR',
        };
    }

    /**
     * Limpa o cache
     */
    static clearCache() {
        cache.clear();
    }
}

export default ExchangeService;
