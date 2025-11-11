<template>
  <div class="container mt-5">
    <!-- Notificações -->
    <NotificationComponent
      :notifications="notifications"
      @close="removeNotification"
    />

    <div class="card shadow-lg p-4 bg-white text-dark">
      <!-- Header com Dark Mode Toggle -->
      <div class="header-top">
        <h2 class="text-center mb-0">💱 Conversor de Moedas</h2>
        <DarkModeToggle @toggle="onDarkModeToggle" />
      </div>

      <!-- Informações do Usuário -->
      <div v-if="username" class="alert alert-info d-flex justify-content-between align-items-center mt-3">
        <div>
          <p><strong>Usuário:</strong> {{ username }}</p>
          <p class="mb-0"><small>Usando API pública: Frankfurter</small></p>
        </div>
        <button @click="logout" class="btn btn-sm btn-outline-secondary">Sair</button>
      </div>

      <!-- Estado de Loading -->
      <div v-if="isLoading" class="alert alert-info text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
        Carregando taxas de câmbio...
      </div>

      <!-- Formulário de Conversão -->
      <div class="form-section">
        <div class="mb-3">
          <label class="form-label">Valor:</label>
          <input 
            v-model.number="amount" 
            type="number" 
            class="form-control" 
            placeholder="Digite o valor"
            :disabled="isLoading"
            min="0"
            step="0.01"
            @input="validateAmount"
          />
          <small v-if="amountError" class="text-danger">{{ amountError }}</small>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">De:</label>
            <select 
              v-model="fromCurrency" 
              class="form-select"
              :disabled="isLoading"
            >
              <option v-for="(name, code) in currencies" :key="code" :value="code">
                {{ code }} - {{ name }}
              </option>
            </select>
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Para:</label>
            <select 
              v-model="toCurrency" 
              class="form-select"
              :disabled="isLoading"
            >
              <option v-for="(name, code) in currencies" :key="code" :value="code">
                {{ code }} - {{ name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Botão de Trocar Moedas -->
        <div class="text-center mb-3">
          <button 
            @click="swapCurrencies" 
            class="btn btn-outline-secondary"
            :disabled="isLoading"
            title="Trocar moedas"
          >
            ⇄ Trocar Moedas
          </button>
        </div>
      </div>

      <!-- Resultado da Conversão -->
      <div v-if="convertedAmount !== null && !error" class="alert alert-success mt-4 text-center result-box">
        <h4 class="mb-2">{{ formatAmount(amount) }} <span class="currency-label">{{ fromCurrency }}</span></h4>
        <h3 class="mb-0">=</h3>
        <h4 class="mt-2">{{ formatAmount(convertedAmount) }} <span class="currency-label">{{ toCurrency }}</span></h4>
        <hr class="my-3" />
        <small class="text-muted">
          Taxa: 1 {{ fromCurrency }} = {{ formatAmount(exchangeRate?.rate || 0) }} {{ toCurrency }}
        </small>
      </div>

      <!-- Mensagem de Erro -->
      <div v-if="error" class="alert alert-danger mt-4 text-center">
        ⚠️ {{ error }}
      </div>

      <!-- Gráfico de Taxas de Câmbio -->
      <div v-if="chartData && chartData.labels && chartData.labels.length" class="mt-4 chart-container">
        <h5 class="text-center mb-3">📈 Histórico de Taxas (Últimos 7 dias)</h5>
        <LineChart :data="chartData" :options="chartOptions" />
      </div>

      <!-- Histórico de Conversões -->
      <ConversionHistory
        :conversions="conversions"
        @delete-conversion="deleteConversion"
        @clear-history="clearConversions"
        @export="exportConversions"
      />

      <!-- Controles Adicionais -->
      <div class="controls-footer mt-4">
        <button
          @click="clearCache"
          class="btn btn-sm btn-outline-warning"
          title="Limpar cache de API"
        >
          🔄 Limpar Cache
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import NotificationComponent from './Notification.vue';
import ConversionHistory from './ConversionHistory.vue';
import DarkModeToggle from './DarkModeToggle.vue';
import useExchangeCache from '../composables/useExchangeCache';

// Registra os elementos necessários do Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

export default defineComponent({
  name: 'CurrencyConverter',
  components: {
    LineChart: Line,
    NotificationComponent,
    ConversionHistory,
    DarkModeToggle,
  },
  data() {
    return {
      username: localStorage.getItem('username') || '',
      amount: 1,
      fromCurrency: 'USD',
      toCurrency: 'BRL',
      amountError: null,
      chartData: null,
      convertTimer: null,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Histórico de Taxas de Câmbio',
          },
          legend: {
            display: true,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: function(value) {
                return value.toFixed(4);
              }
            }
          },
        },
      },
    };
  },
  setup() {
    const exchangeCache = useExchangeCache();
    return exchangeCache;
  },
  computed: {
    /**
     * Alias para compatibilidade com templates
     */
    errorMessage() {
      return this.error;
    },
  },
  watch: {
    amount() {
      this.debouncedConvert();
    },
    fromCurrency() {
      this.debouncedConvert();
    },
    toCurrency() {
      this.debouncedConvert();
    },
  },
  methods: {
    /**
     * Valida o valor digitado
     */
    validateAmount() {
      if (this.amount < 0) {
        this.amountError = 'O valor não pode ser negativo';
        this.amount = 0;
      } else if (this.amount > 999999999) {
        this.amountError = 'O valor é muito grande';
        this.amount = 999999999;
      } else {
        this.amountError = null;
      }
    },

    /**
     * Debounce para evitar muitas requisições
     */
    debouncedConvert() {
      if (this.convertTimer) {
        clearTimeout(this.convertTimer);
      }
      this.convertTimer = setTimeout(() => {
        this.convertCurrencyAndChart();
      }, 500);
    },

    /**
     * Converte moeda e busca histórico
     */
    async convertCurrencyAndChart() {
      await this.convertCurrency(this.amount, this.fromCurrency, this.toCurrency);
      await this.fetchHistoricalData();
    },

    /**
     * Busca dados históricos para o gráfico
     */
    async fetchHistoricalData() {
      try {
        const rates = await this.loadHistoricalRates();

        if (rates && Object.keys(rates).length > 0) {
          const dates = Object.keys(rates).sort();
          const values = dates.map(date => rates[date][this.toCurrency]);

          this.chartData = {
            labels: dates.map(date => new Date(date).toLocaleDateString('pt-BR')),
            datasets: [{
              label: `${this.fromCurrency} para ${this.toCurrency}`,
              data: values,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
              tension: 0.4,
            }],
          };
        }
      } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        this.chartData = null;
      }
    },

    /**
     * Carrega histórico de taxas
     */
    async loadHistoricalRates() {
      const { ExchangeService } = await import('../services/exchangeService');
      return await ExchangeService.getHistoricalRates(this.fromCurrency, this.toCurrency, 7);
    },

    /**
     * Troca moedas
     */
    swapCurrencies() {
      const temp = this.fromCurrency;
      this.fromCurrency = this.toCurrency;
      this.toCurrency = temp;
    },

    /**
     * Logout
     */
    logout() {
      localStorage.removeItem('username');
      this.$router.push('/');
    },

    /**
     * Verifica autenticação
     */
    checkAuth() {
      if (!this.username) {
        this.$router.push('/');
      }
    },

    /**
     * Callback dark mode
     */
    onDarkModeToggle(isDarkMode) {
      console.log('Dark mode:', isDarkMode);
    },
  },
  async mounted() {
    this.checkAuth();
    try {
      await this.loadCurrencies();
      await this.convertCurrencyAndChart();
    } catch (error) {
      console.error('Erro ao inicializar:', error);
    }
  },
  beforeUnmount() {
    if (this.convertTimer) {
      clearTimeout(this.convertTimer);
    }
  },
});
</script>


<style scoped>
.container {
  background: var(--bg-color, #f3f4f6);
  min-height: 100vh;
  transition: background-color 0.3s ease;
}

.card {
  width: 100%;
  max-width: 1000px;
  border-radius: 10px;
  padding: 30px;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-top h2 {
  flex: 1;
  text-align: center;
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.form-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.result-box {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border: 2px solid #28a745;
  border-radius: 10px;
  padding: 20px;
  animation: fadeIn 0.3s ease-in;
}

.result-box h4 {
  margin: 5px 0;
  font-weight: 600;
}

.currency-label {
  background: rgba(255, 255, 255, 0.7);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  margin-left: 4px;
}

.chart-container {
  height: 400px;
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.controls-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  flex-wrap: wrap;
}

/* Bootstrap completo */
.btn {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-outline-secondary {
  background: transparent;
  border: 1px solid #6c757d;
  color: #6c757d;
}

.btn-outline-secondary:hover {
  background: #6c757d;
  color: white;
}

.btn-outline-warning {
  background: transparent;
  border: 1px solid #ffc107;
  color: #ffc107;
}

.btn-outline-warning:hover {
  background: #ffc107;
  color: #000;
}

.form-control,
.form-select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-control:focus,
.form-select:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #212529;
}

.alert {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 12px 16px;
  margin-bottom: 15px;
  animation: slideInDown 0.3s ease;
}

.alert-info {
  background: #d1ecf1;
  border-color: #bee5eb;
  color: #0c5460;
}

.alert-success {
  background: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.alert-danger {
  background: #f8d7da;
  border-color: #f5c2c7;
  color: #842029;
}

.alert-light {
  background: #f8f9fa;
  border-color: #dee2e6;
  color: #212529;
}

.text-center {
  text-align: center;
}

.text-danger {
  color: #dc3545;
}

.text-muted {
  color: #6c757d !important;
}

.spinner-border {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
  border: 0.125em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
}

.visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

/* Animações */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
}

/* Responsivo */
@media (max-width: 768px) {
  .card {
    padding: 20px;
  }

  .header-top {
    flex-direction: column;
    gap: 15px;
  }

  .header-top h2 {
    font-size: 24px;
  }

  .chart-container {
    height: 250px;
  }

  .form-section {
    padding: 15px;
  }
}

/* Modo escuro */
:global([data-bs-theme='dark']) .container {
  background: #1a1a1a;
}

:global([data-bs-theme='dark']) .card {
  background: #2d2d2d !important;
  color: #ffffff !important;
}

:global([data-bs-theme='dark']) .form-section {
  background: #3a3a3a;
}

:global([data-bs-theme='dark']) .form-control,
:global([data-bs-theme='dark']) .form-select {
  background: #404040;
  border-color: #555;
  color: #ffffff;
}

:global([data-bs-theme='dark']) .form-control:focus,
:global([data-bs-theme='dark']) .form-select:focus {
  border-color: #0d6efd;
  background: #404040;
  color: #ffffff;
}

:global([data-bs-theme='dark']) .chart-container {
  background: #3a3a3a;
  border-color: #555;
}

:global([data-bs-theme='dark']) .result-box {
  background: linear-gradient(135deg, #1e5631 0%, #2d7a3a 100%);
  border-color: #3a9d5d;
}
</style>
