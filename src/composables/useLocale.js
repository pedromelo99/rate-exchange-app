/**
 * @file useLocale.js
 * @description Composable para gerenciar preferências de locale do usuário
 */

import { ref, computed } from 'vue';

const LOCALE_STORAGE_KEY = 'preferred_locale';

/**
 * Locales suportados com nome amigável
 */
const supportedLocales = {
    'pt-BR': { name: 'Português (Brasil)', flag: '🇧🇷' },
    'en-US': { name: 'English (USA)', flag: '🇺🇸' },
    'es-ES': { name: 'Español (España)', flag: '🇪🇸' },
    'de-DE': { name: 'Deutsch (Deutschland)', flag: '🇩🇪' },
    'fr-FR': { name: 'Français (France)', flag: '🇫🇷' },
};

/**
 * Composable para gerenciar locale
 */
export function useLocale() {
    const currentLocale = ref(localStorage.getItem(LOCALE_STORAGE_KEY) || 'pt-BR');

    /**
     * Obtém o locale atual
     */
    const getLocale = () => currentLocale.value;

    /**
     * Define um novo locale
     */
    const setLocale = (locale) => {
        if (supportedLocales[locale]) {
            currentLocale.value = locale;
            localStorage.setItem(LOCALE_STORAGE_KEY, locale);
        }
    };

    /**
     * Obtém informações do locale atual
     */
    const localeInfo = computed(() => {
        return supportedLocales[currentLocale.value] || supportedLocales['pt-BR'];
    });

    /**
     * Lista de locales disponíveis
     */
    const availableLocales = computed(() => {
        return Object.entries(supportedLocales).map(([code, info]) => ({
            code,
            ...info,
        }));
    });

    return {
        currentLocale: computed(() => currentLocale.value),
        getLocale,
        setLocale,
        localeInfo,
        availableLocales,
        supportedLocales,
    };
}

export default useLocale;
