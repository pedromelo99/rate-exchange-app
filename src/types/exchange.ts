/**
 * @file exchange.ts
 * @description Tipos e interfaces para a aplicação de câmbio
 */

/**
 * Interface para uma conversão de moeda
 */
export interface CurrencyConversion {
  id: string;
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  convertedAmount: number;
  exchangeRate: number;
  timestamp: number;
  date: string;
}

/**
 * Interface para dados de taxa de câmbio
 */
export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  timestamp: number;
}

/**
 * Interface para resposta de histórico de taxas
 */
export interface HistoricalRates {
  [date: string]: {
    [currency: string]: number;
  };
}

/**
 * Interface para dados de cache
 */
export interface CacheData<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Interface para notificação
 */
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
  timestamp: number;
}

/**
 * Interface para status de erro
 */
export interface ErrorResponse {
  message: string;
  code?: string;
  details?: any;
}
