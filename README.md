# Rate Exchange App

Aplicativo de conversão de moedas desenvolvido com Vue.js 3, utilizando API pública para obter taxas de câmbio em tempo real.

## 🚀 Funcionalidades

- ✅ Conversão de moedas manual com botão dedicado
- ✅ Troca rápida de moedas (botão ⇄ Trocar Moedas)
- ✅ API pública (Frankfurter) - sem necessidade de chave de API
- ✅ Histórico de conversões com paginação
- ✅ Histórico de taxas de câmbio (gráfico dos últimos 7 dias)
- ✅ Modo escuro com cores sofisticadas
- ✅ Interface moderna e responsiva
- ✅ Formatação de valores monetários em português brasileiro
- ✅ Autenticação básica com localStorage
- ✅ Cache de requisições para melhor desempenho

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

### Conversão de Moedas
1. Acesse a aplicação e faça login com um nome de usuário
2. Selecione a moeda de origem (De) e a moeda de destino (Para)
3. Digite o valor a ser convertido
4. Clique no botão **💱 Converter** para executar a conversão
5. O resultado aparecerá na seção de resultado

### Recursos Disponíveis
- **⇄ Trocar Moedas**: Inverte a posição das moedas (De ↔ Para)
- **💱 Converter**: Executa a conversão manualmente
- **🔄 Limpar Cache**: Limpa o cache de requisições da API
- **📥 Exportar**: Exporta o histórico de conversões
- **🗑️ Limpar**: Remove o histórico de conversões
- **🌙 Modo Escuro**: Alterna entre modo claro e escuro

### Histórico
- Todas as conversões são salvas automaticamente
- Visualize o histórico com detalhes de taxa, data e hora
- Exporte seu histórico em formato JSON
- Limpe o histórico quando necessário

### Gráfico de Taxas
- Após fazer uma conversão, veja o histórico de taxas dos últimos 7 dias
- Visualize tendências de câmbio em um gráfico interativo

## 📊 Recursos de Reatividade

O aplicativo demonstra reatividade do Vue.js através de:
- **Evento de Clique**: Conversão manual ao clicar em "Converter"
- **Computed Properties**: Formatação de valores monetários
- **Estado Reativo**: Gerenciamento de loading, erros e dados
- **LocalStorage**: Persistência de preferências e histórico

## 🌙 Tema e Modo Escuro

O aplicativo possui um modo escuro sofisticado com:
- **Cores Elegantes**: Paleta azul-escura (#1a1a2e) para a caixa principal
- **Bom Contraste**: Texto branco brilhante (#ffffff) para melhor legibilidade
- **Caixas Internas**: Tons médios (#252d45) para elementos como formulário e resultado
- **Persistência**: Suas preferências de tema são salvas no localStorage
- **Toggle Fácil**: Botão para alternar entre tema claro e escuro

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
