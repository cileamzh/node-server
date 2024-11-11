<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style>
#app {
  font-family: 'Arial', sans-serif;
  background-color: #f4f6f9;
  color: #333;
  padding-top: 20px;
}
</style>
