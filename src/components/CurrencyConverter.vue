<template>
  <div class="container mt-5">
    <div class="card shadow-lg p-4 bg-white text-dark">
      <h2 class="text-center mb-4">Conversor de Moedas</h2>

      <!-- Exibir Nome de Usuário -->
      <div v-if="username" class="alert alert-info d-flex justify-content-between align-items-center">
        <div>
          <p><strong>Usuário:</strong> {{ username }}</p>
          <p class="mb-0"><small>Usando API pública: Frankfurter</small></p>
        </div>
        <!-- Botão de Voltar ao Painel de Acesso -->
        <button @click="logout" class="btn btn-sm btn-outline-secondary">Sair</button>
      </div>

      <!-- Estado de Loading -->
      <div v-if="isLoading" class="alert alert-info text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
        Carregando taxas de câmbio...
      </div>

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
        />
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
          ⇄ Trocar
        </button>
      </div>

      <!-- Resultado da Conversão -->
      <div v-if="convertedAmount !== null && !errorMessage" class="alert alert-success mt-4 text-center">
        <h4 class="mb-2">{{ formatAmount(amount) }} {{ fromCurrency }}</h4>
        <h3 class="mb-0">= {{ formatAmount(convertedAmount) }} {{ toCurrency }}</h3>
        <small class="text-muted">Taxa: 1 {{ fromCurrency }} = {{ formatAmount(exchangeRate) }} {{ toCurrency }}</small>
      </div>

      <!-- Mensagem de Erro -->
      <div v-if="errorMessage" class="alert alert-danger mt-4 text-center">
        {{ errorMessage }}
      </div>

      <!-- Informações Adicionais -->
      <div v-if="lastUpdate" class="alert alert-light mt-3 text-center">
        <small>Última atualização: {{ lastUpdate }}</small>
      </div>

      <!-- Gráfico de Taxas de Câmbio -->
      <div v-if="chartData && chartData.labels && chartData.labels.length" class="mt-4 chart-container">
        <h5 class="text-center mb-3">Histórico de Taxas (Últimos 7 dias)</h5>
        <LineChart :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

// Registra os elementos necessários do Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

// API Base URL - Frankfurter (API pública e gratuita)
const API_BASE_URL = 'https://api.frankfurter.app';

export default {
  components: {
    LineChart: Line,
  },
  data() {
    return {
      username: localStorage.getItem("username") || "",
      amount: 1,
      fromCurrency: "USD",
      toCurrency: "BRL",
      convertedAmount: null,
      exchangeRate: null,
      currencies: {},
      errorMessage: null,
      isLoading: false,
      chartData: null,
      lastUpdate: null,
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
      // Debounce timer para evitar muitas requisições
      convertTimer: null,
    };
  },
  watch: {
    // Reatividade: converte automaticamente quando o valor muda
    amount() {
      this.debouncedConvert();
    },
    // Reatividade: converte automaticamente quando a moeda de origem muda
    fromCurrency() {
      this.debouncedConvert();
    },
    // Reatividade: converte automaticamente quando a moeda de destino muda
    toCurrency() {
      this.debouncedConvert();
    },
  },
  methods: {
    /**
     * Busca a lista de moedas disponíveis da API Frankfurter
     */
    async fetchCurrencies() {
      try {
        this.isLoading = true;
        const response = await axios.get(`${API_BASE_URL}/currencies`);
        
        // A API Frankfurter retorna um objeto { "USD": "US Dollar", ... }
        this.currencies = response.data;
        
        // Se não houver moedas, define algumas padrão
        if (Object.keys(this.currencies).length === 0) {
          this.currencies = {
            USD: "US Dollar",
            EUR: "Euro",
            BRL: "Brazilian Real",
            GBP: "British Pound",
            JPY: "Japanese Yen",
            CAD: "Canadian Dollar",
            AUD: "Australian Dollar",
            CHF: "Swiss Franc",
            CNY: "Chinese Yuan",
            INR: "Indian Rupee",
          };
        }
      } catch (error) {
        console.error("Erro ao buscar moedas:", error);
        this.errorMessage = "Erro ao carregar lista de moedas. Usando lista padrão.";
        // Fallback para moedas padrão
        this.currencies = {
          USD: "US Dollar",
          EUR: "Euro",
          BRL: "Brazilian Real",
          GBP: "British Pound",
          JPY: "Japanese Yen",
        };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Converte moeda usando a API Frankfurter
     */
    async convertCurrency() {
      // Validações
      if (!this.amount || this.amount <= 0) {
        this.convertedAmount = null;
        this.exchangeRate = null;
        return;
      }

      if (this.fromCurrency === this.toCurrency) {
        this.convertedAmount = this.amount;
        this.exchangeRate = 1;
        this.errorMessage = null;
        return;
      }

      this.isLoading = true;
      this.errorMessage = null;

      try {
        const response = await axios.get(
          `${API_BASE_URL}/latest?from=${this.fromCurrency}&to=${this.toCurrency}`
        );

        const rate = response.data.rates[this.toCurrency];
        this.exchangeRate = rate;
        this.convertedAmount = (this.amount * rate);
        this.lastUpdate = new Date().toLocaleString('pt-BR');

        // Busca histórico para o gráfico
        await this.fetchHistoricalData();
      } catch (error) {
        console.error("Erro ao converter moeda:", error);
        this.errorMessage = error.response?.data?.error || 
          "Erro ao buscar taxas de câmbio. Verifique sua conexão e tente novamente.";
        this.convertedAmount = null;
        this.exchangeRate = null;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Busca dados históricos para o gráfico (últimos 7 dias)
     */
    async fetchHistoricalData() {
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        const response = await axios.get(
          `${API_BASE_URL}/${startDateStr}..${endDateStr}?from=${this.fromCurrency}&to=${this.toCurrency}`
        );

        const rates = response.data.rates;
        const dates = Object.keys(rates).sort();
        const values = dates.map(date => rates[date][this.toCurrency]);

        this.chartData = {
          labels: dates.map(date => new Date(date).toLocaleDateString('pt-BR')),
          datasets: [{
            label: `${this.fromCurrency} para ${this.toCurrency}`,
            data: values,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
            tension: 0.4,
          }],
        };
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        // Não mostra erro ao usuário, apenas não exibe o gráfico
        this.chartData = null;
      }
    },

    /**
     * Debounce para evitar muitas requisições ao digitar
     */
    debouncedConvert() {
      if (this.convertTimer) {
        clearTimeout(this.convertTimer);
      }
      this.convertTimer = setTimeout(() => {
        this.convertCurrency();
      }, 500); // Aguarda 500ms após a última mudança
    },

    /**
     * Troca as moedas de origem e destino
     */
    swapCurrencies() {
      const temp = this.fromCurrency;
      this.fromCurrency = this.toCurrency;
      this.toCurrency = temp;
      // A conversão será feita automaticamente pelo watcher
    },

    /**
     * Formata valores monetários
     */
    formatAmount(value) {
      if (value === null || value === undefined) return '0.00';
      return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },

    /**
     * Logout do usuário
     */
    logout() {
      localStorage.removeItem("username");
      this.$router.push("/");
    },

    /**
     * Verifica autenticação
     */
    checkAuth() {
      if (!this.username) {
        this.$router.push("/");
      }
    }
  },
  mounted() {
    this.checkAuth();
    this.fetchCurrencies().then(() => {
      // Converte automaticamente após carregar as moedas
      this.convertCurrency();
    });
  },
  beforeUnmount() {
    // Limpa o timer ao desmontar o componente
    if (this.convertTimer) {
      clearTimeout(this.convertTimer);
    }
  }
};
</script>


<style scoped>
body {
  background-color: #f3f4f6;
}

.card {
  width: 1000px;
  max-width: 100%;
  border-radius: 10px;
  padding: 30px;
  margin: 0 auto;
}

/* Estilos do modo escuro */
.dark {
  background-color: #121212;
  color: white;
}

.dark .card {
  background-color: #1e1e1e !important;
  color: white !important;
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px;
  margin: 10px 0;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

input, select {
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
}

input:focus, select:focus {
  border-color: #007bff;
  outline: none;
}

canvas {
  max-width: 100%;
  height: auto;
}

.chart-container {
  height: 400px;
  position: relative;
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

@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
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
</style>
