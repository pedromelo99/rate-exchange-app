import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Importando o Vue Router

const app = createApp(App);
app.use(router);  // Usando o Vue Router
app.mount("#app");