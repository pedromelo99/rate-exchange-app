<template>
  <div id="app">
    <!-- Aqui o conteúdo da página será renderizado com base na rota ativa -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
/* Seu estilo global pode ser adicionado aqui */
body {
  font-family: Arial, Helvetica, sans-serif;
}
</style>