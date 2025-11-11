<template>
  <div class="container mt-5">
    <div class="card shadow-lg p-4 bg-white text-dark">
      <h2 class="text-center mb-4">Conversor de Moedas</h2>

      <!-- Exibir Nome de Usuário e Chave da API -->
      <div v-if="username && apiKey" class="alert alert-info d-flex justify-content-between align-items-center">
        <div>
          <p><strong>Usuário:</strong> {{ username }}</p>
          <p><strong>Chave da API:</strong> {{ apiKey }}</p>
        </div>
        <!-- Botão de Voltar ao Painel de Acesso -->
        <button @click="logout" class="btn btn-sm btn-outline-secondary">Sair</button>
      </div>

      <div class="mb-3">
        <label class="form-label">Valor:</label>
        <input v-model="amount" type="number" class="form-control" placeholder="Digite o valor" />
      </div>

      <div class="mb-3">
        <label class="form-label">De:</label>
        <select v-model="fromCurrency" class="form-select">
          <option v-for="(name, code) in currencies" :key="code" :value="code">
            {{ code }} - {{ name }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Para:</label>
        <select v-model="toCurrency" class="form-select">
          <option v-for="(name, code) in currencies" :key="code" :value="code">
            {{ code }} - {{ name }}
          </option>
        </select>
      </div>

      <button @click="convertCurrency" class="btn btn-primary w-100">Converter</button>

      <div v-if="convertedAmount !== null" class="alert alert-success mt-4 text-center">
        {{ amount }} {{ fromCurrency }} = {{ convertedAmount }} {{ toCurrency }}
      </div>

      <div v-if="errorMessage" class="alert alert-danger mt-4 text-center">
        {{ errorMessage }}
      </div>

      <!-- Gráfico de Taxas de Câmbio -->
      <div v-if="chartData && chartData.labels && chartData.labels.length" class="mt-4">
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

export default {
  components: {
    LineChart: Line, // Use o componente Line para criar gráficos de linha
  },
  data() {
    return {
      username: localStorage.getItem("username") || "",
      apiKey: localStorage.getItem("apiKey") || "",
      amount: 1,
      fromCurrency: "USD",
      toCurrency: "BRL",
      convertedAmount: null,
      currencies: {},
      errorMessage: null,
      chartData: null, // Para armazenar os dados do gráfico
      chartOptions: { // Opções do gráfico
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Taxas de Câmbio',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
      apiChoice: null, // Variável para armazenar qual API foi selecionada automaticamente
    };
  },
  methods: {
    async fetchCurrencies() {
      if (!this.apiKey) {
        this.errorMessage = "Por favor, insira sua chave da API.";
        return;
      }

      let url = "";
      // Detecta automaticamente qual API usar com base na chave
      if (this.apiKey.includes("openexchangerates")) {
        this.apiChoice = "openExchange";
        url = `https://openexchangerates.org/api/currencies.json`;
      } else {
        this.apiChoice = "exchangeRate";
        url = `https://v6.exchangerate-api.com/v6/${this.apiKey}/codes`;
      }

      try {
        const response = await axios.get(url);
        if (this.apiChoice === "openExchange") {
          this.currencies = response.data;
        } else {
          this.currencies = Object.fromEntries(response.data.supported_codes.map(([code, name]) => [code, name]));
        }
      } catch (error) {
        this.errorMessage = "Erro ao buscar a lista de moedas. Verifique sua chave da API.";
        console.error("Erro ao buscar moedas:", error);
      }
    },
    async convertCurrency() {
      this.errorMessage = null;
      this.convertedAmount = null;

      if (!this.apiKey) {
        this.errorMessage = "Por favor, insira sua chave da API.";
        return;
      }

      let url = "";
      if (this.apiChoice === "openExchange") {
        url = `https://openexchangerates.org/api/latest.json?app_id=${this.apiKey}`;
      } else {
        url = `https://v6.exchangerate-api.com/v6/${this.apiKey}/latest/${this.fromCurrency}`;
      }

      try {
        const response = await axios.get(url);
        const rates = this.apiChoice === "openExchange" ? response.data.rates : response.data.conversion_rates;
        
        this.convertedAmount = (this.amount * rates[this.toCurrency]).toFixed(2);
        this.updateChart(rates);
      } catch (error) {
        this.errorMessage = "Erro ao buscar taxas de câmbio. Verifique sua chave da API.";
        console.error("Erro:", error);
      }
    },
    updateChart(rates) {
      this.chartData = {
        labels: Object.keys(rates),
        datasets: [{
          label: `Taxas de Câmbio (${this.fromCurrency})`,
          data: Object.values(rates),
          borderColor: "rgba(75, 192, 192, 1)",
          fill: false,
        }],
      };
    },
    logout() {
      localStorage.removeItem("username");
      localStorage.removeItem("apiKey");
      this.$router.push("/");
    },
    checkAuth() {
      if (!this.username || !this.apiKey) {
        this.$router.push("/");
      }
    }
  },
  mounted() {
    this.checkAuth();
    this.fetchCurrencies();
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
</style>
