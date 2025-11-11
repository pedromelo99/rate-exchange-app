import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../components/LoginPage.vue"; // Página de login
import CurrencyConverter from "../components/CurrencyConverter.vue"; // Página do conversor de moedas

const routes = [
    {
        path: "/",
        name: "LoginPage", // Página inicial será a LoginPage
        component: LoginPage,
    },
    {
        path: "/conversor",
        name: "Conversor",
        component: CurrencyConverter,
        beforeEnter: (to, from, next) => {
            // Verifica se o usuário tem os dados de autenticação no localStorage
            if (!localStorage.getItem("username") || !localStorage.getItem("apiKey")) {
                next("/"); // Se não houver nome de usuário ou chave da API, vai para a página de login
            } else {
                next(); // Caso contrário, permite a entrada na página do conversor
            }
        },
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;