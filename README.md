# Rate Exchange App

Aplicativo de conversão de moedas desenvolvido com Vue.js 3, utilizando API pública para obter taxas de câmbio em tempo real.

## 🚀 Funcionalidades

- ✅ Conversão de moedas em tempo real
- ✅ API pública (Frankfurter) - sem necessidade de chave de API
- ✅ Conversão automática e reativa
- ✅ Histórico de taxas de câmbio (gráfico dos últimos 7 dias)
- ✅ Interface moderna e responsiva
- ✅ Formatação de valores monetários em português brasileiro

## 🛠️ Tecnologias

- **Vue.js 3** - Framework JavaScript reativo
- **Vue Router** - Roteamento
- **Axios** - Cliente HTTP para consumo de API
- **Chart.js** - Gráficos e visualizações
- **Vue ChartJS** - Integração Chart.js com Vue

## 📡 API Utilizada

Este projeto utiliza a [API Frankfurter](https://www.frankfurter.app/), uma API pública e gratuita que fornece:
- Taxas de câmbio atualizadas
- Suporte a mais de 30 moedas
- Dados históricos de taxas
- Sem necessidade de autenticação ou chave de API

## 📦 Instalação

```bash
npm install
```

## 🏃 Executando o Projeto

### Desenvolvimento
```bash
npm run serve
```

### Build para Produção
```bash
npm run build
```

### Lint
```bash
npm run lint
```

## 🎯 Como Usar

1. Acesse a aplicação
2. Digite um nome de usuário (não é necessário chave de API)
3. Selecione a moeda de origem e destino
4. Digite o valor a ser convertido
5. A conversão acontece automaticamente!

## 📊 Recursos de Reatividade

O aplicativo demonstra reatividade do Vue.js através de:
- **Watchers**: Conversão automática quando valores ou moedas mudam
- **Debounce**: Evita requisições excessivas à API
- **Computed Properties**: Formatação de valores monetários
- **Estado Reativo**: Gerenciamento de loading, erros e dados

## 📝 Estrutura do Projeto

```
src/
├── components/
│   ├── CurrencyConverter.vue  # Componente principal do conversor
│   └── LoginPage.vue           # Página de login
├── router/
│   └── index.js               # Configuração de rotas
└── App.vue                     # Componente raiz
```

## 🔧 Customização

Veja [Vue CLI Configuration Reference](https://cli.vuejs.org/config/).
