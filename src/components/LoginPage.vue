<template>
    <div :class="['login-container', { dark: isDarkMode }]">
        <div class="card shadow-lg p-4" :class="isDarkMode ? 'bg-dark text-white' : 'bg-white text-dark'">
            <h2 class="text-center mb-4">Painel de Acesso</h2>

            <!-- Botão de Modo Claro/Escuro -->
            <button @click="toggleDarkMode" class="btn btn-secondary mb-3">
                {{ isDarkMode ? 'Modo Claro' : 'Modo Escuro' }}
            </button>

            <div class="mb-3">
                <label class="form-label">Nome de Usuário:</label>
                <input v-model="username" type="text" class="form-control" placeholder="Digite seu nome de usuário" />
            </div>

            <div class="mb-3">
                <label class="form-label">Chave da API:</label>
                <input v-model="apiKey" type="text" class="form-control" placeholder="Digite sua chave da API" />
            </div>

            <button @click="login" class="btn btn-primary w-100">Entrar</button>

            <div v-if="errorMessage" class="alert alert-danger mt-4 text-center">
                {{ errorMessage }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: "",
            apiKey: "",
            errorMessage: null,
            isDarkMode: localStorage.getItem("darkMode") === "true",
        };
    },
    methods: {
        login() {
            if (this.username && this.apiKey) {
                localStorage.setItem("username", this.username);
                localStorage.setItem("apiKey", this.apiKey);
                this.$router.push("/conversor");
            } else {
                this.errorMessage = "Por favor, insira o nome de usuário e a chave da API.";
            }
        },
        toggleDarkMode() {
            this.isDarkMode = !this.isDarkMode;
            localStorage.setItem("darkMode", this.isDarkMode);
        }
    }
};
</script>

<style scoped>
.login-container {
    background-image: url("../../public/background.jpg");
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.card {
    width: 1000px;
    /* Largura aumentada */
    max-width: 100%;
    /* Responsivo */
    border-radius: 10px;
    /* Bordas arredondadas */
    padding: 30px;
}

/* Estilos para o modo escuro */
.dark {
    background-color: #121212;
    color: white;
}

.dark .card {
    background-color: #1e1e1e !important;
    color: white !important;
}
</style>