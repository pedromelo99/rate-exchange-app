/**
 * @file storageService.js
 * @description Serviço para gerenciar armazenamento em localStorage
 */

const STORAGE_KEYS = {
    CONVERSIONS: 'currency_conversions',
    USERNAME: 'username',
    PREFERENCES: 'user_preferences',
};

/**
 * Serviço para gerenciar dados no localStorage
 */
class StorageService {
    /**
     * Salva uma conversão de moeda no histórico
     */
    static saveConversion(conversion) {
        try {
            const conversions = this.getConversions();
            conversions.unshift(conversion); // Adiciona no início

            // Manter apenas as últimas 100 conversões
            if (conversions.length > 100) {
                conversions.pop();
            }

            localStorage.setItem(STORAGE_KEYS.CONVERSIONS, JSON.stringify(conversions));
        } catch (error) {
            console.error('Erro ao salvar conversão:', error);
        }
    }

    /**
     * Obtém todo o histórico de conversões
     */
    static getConversions() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.CONVERSIONS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Erro ao recuperar conversões:', error);
            return [];
        }
    }

    /**
     * Obtém conversões dos últimos N dias
     */
    static getConversionsFromLastDays(days) {
        const conversions = this.getConversions();
        const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;

        return conversions.filter(c => c.timestamp >= cutoffTime);
    }

    /**
     * Limpa todo o histórico de conversões
     */
    static clearConversions() {
        try {
            localStorage.removeItem(STORAGE_KEYS.CONVERSIONS);
        } catch (error) {
            console.error('Erro ao limpar conversões:', error);
        }
    }

    /**
     * Remove uma conversão específica
     */
    static deleteConversion(id) {
        try {
            const conversions = this.getConversions();
            const filtered = conversions.filter(c => c.id !== id);
            localStorage.setItem(STORAGE_KEYS.CONVERSIONS, JSON.stringify(filtered));
        } catch (error) {
            console.error('Erro ao deletar conversão:', error);
        }
    }

    /**
     * Salva nome de usuário
     */
    static setUsername(username) {
        try {
            localStorage.setItem(STORAGE_KEYS.USERNAME, username);
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
        }
    }

    /**
     * Obtém nome de usuário
     */
    static getUsername() {
        try {
            return localStorage.getItem(STORAGE_KEYS.USERNAME);
        } catch (error) {
            console.error('Erro ao recuperar usuário:', error);
            return null;
        }
    }

    /**
     * Remove nome de usuário
     */
    static clearUsername() {
        try {
            localStorage.removeItem(STORAGE_KEYS.USERNAME);
        } catch (error) {
            console.error('Erro ao limpar usuário:', error);
        }
    }

    /**
     * Salva preferências do usuário
     */
    static setPreferences(preferences) {
        try {
            localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
        } catch (error) {
            console.error('Erro ao salvar preferências:', error);
        }
    }

    /**
     * Obtém preferências do usuário
     */
    static getPreferences() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Erro ao recuperar preferências:', error);
            return {};
        }
    }

    /**
     * Limpa todos os dados do localStorage
     */
    static clearAll() {
        try {
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
        } catch (error) {
            console.error('Erro ao limpar tudo:', error);
        }
    }
}

export default StorageService;
