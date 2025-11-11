/**
 * @file formatNumber.js
 * @description Utilitário para formatação avançada de números com suporte a múltiplos locales
 */

/**
 * Configurações de formatação por locale
 */
const localeConfigs = {
    'pt-BR': {
        locale: 'pt-BR',
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
        groupSeparator: '.',
        decimalSeparator: ',',
    },
    'en-US': {
        locale: 'en-US',
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
        groupSeparator: ',',
        decimalSeparator: '.',
    },
    'es-ES': {
        locale: 'es-ES',
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
        groupSeparator: '.',
        decimalSeparator: ',',
    },
    'de-DE': {
        locale: 'de-DE',
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
        groupSeparator: '.',
        decimalSeparator: ',',
    },
    'fr-FR': {
        locale: 'fr-FR',
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
        groupSeparator: ' ',
        decimalSeparator: ',',
    },
};

/**
 * Formata um valor numérico com suporte a múltiplos locales
 * @param {number} value - Valor a ser formatado
 * @param {string} locale - Locale para formatação (pt-BR, en-US, etc)
 * @param {object} options - Opções customizadas
 * @returns {string} Valor formatado
 */
export function formatNumber(value, locale = 'pt-BR', options = {}) {
    if (value === null || value === undefined || isNaN(value)) {
        return '—';
    }

    const config = localeConfigs[locale] || localeConfigs['pt-BR'];
    const mergedOptions = {
        ...config,
        ...options,
    };

    try {
        return new Intl.NumberFormat(mergedOptions.locale, {
            style: mergedOptions.style,
            minimumFractionDigits: mergedOptions.minimumFractionDigits,
            maximumFractionDigits: mergedOptions.maximumFractionDigits,
            useGrouping: true,
        }).format(value);
    } catch (error) {
        console.error('Erro ao formatar número:', error);
        return String(value);
    }
}

/**
 * Formata um valor como moeda
 * @param {number} value - Valor a ser formatado
 * @param {string} currency - Código de moeda (USD, EUR, BRL, etc)
 * @param {string} locale - Locale para formatação
 * @returns {string} Valor formatado como moeda
 */
export function formatCurrency(value, currency = 'BRL', locale = 'pt-BR') {
    if (value === null || value === undefined || isNaN(value)) {
        return '—';
    }

    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
        }).format(value);
    } catch (error) {
        console.error('Erro ao formatar moeda:', error);
        return String(value);
    }
}

/**
 * Formata um valor como percentual
 * @param {number} value - Valor entre 0 e 1 (ex: 0.25 = 25%)
 * @param {string} locale - Locale para formatação
 * @returns {string} Valor formatado como percentual
 */
export function formatPercent(value, locale = 'pt-BR') {
    if (value === null || value === undefined || isNaN(value)) {
        return '—';
    }

    try {
        return new Intl.NumberFormat(locale, {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    } catch (error) {
        console.error('Erro ao formatar percentual:', error);
        return String(value);
    }
}

/**
 * Formata um valor com notação científica
 * @param {number} value - Valor a ser formatado
 * @param {string} locale - Locale para formatação
 * @returns {string} Valor em notação científica
 */
export function formatScientific(value, locale = 'pt-BR') {
    if (value === null || value === undefined || isNaN(value)) {
        return '—';
    }

    try {
        return new Intl.NumberFormat(locale, {
            notation: 'scientific',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    } catch (error) {
        console.error('Erro ao formatar científico:', error);
        return String(value);
    }
}

/**
 * Formata um valor com notação compacta (K, M, B, etc)
 * @param {number} value - Valor a ser formatado
 * @param {string} locale - Locale para formatação
 * @returns {string} Valor em notação compacta
 */
export function formatCompact(value, locale = 'pt-BR') {
    if (value === null || value === undefined || isNaN(value)) {
        return '—';
    }

    try {
        return new Intl.NumberFormat(locale, {
            notation: 'compact',
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
        }).format(value);
    } catch (error) {
        // Fallback para navegadores que não suportam notation compacta
        return formatNumber(value, locale);
    }
}

/**
 * Lista todos os locales disponíveis
 * @returns {array} Array com locales disponíveis
 */
export function getAvailableLocales() {
    return Object.keys(localeConfigs);
}

/**
 * Obtém a configuração de um locale específico
 * @param {string} locale - Locale
 * @returns {object} Configuração do locale
 */
export function getLocaleConfig(locale) {
    return localeConfigs[locale] || localeConfigs['pt-BR'];
}

export default {
    formatNumber,
    formatCurrency,
    formatPercent,
    formatScientific,
    formatCompact,
    getAvailableLocales,
    getLocaleConfig,
};
