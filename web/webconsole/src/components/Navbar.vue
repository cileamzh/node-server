<template>
    <nav>
      <ul>
        <li><router-link to="/">主页</router-link></li>
        <li><router-link to="/devices">设备列表</router-link></li>
        <li v-if="!isAuthenticated"><router-link to="/register">注册</router-link></li>
        <li v-if="!isAuthenticated"><router-link to="/login">登录</router-link></li>
        <li v-if="isAuthenticated"><button @click="logout">退出</button></li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    computed: {
      isAuthenticated() {
        return this.$store.getters.isAuthenticated
      }
    },
    methods: {
      logout() {
        this.$store.dispatch('logout')
        localStorage.removeItem('token')
        this.$router.push('/login')
      }
    }
  }
  </script>
  
  <style scoped>
  nav {
    background-color: #2980b9;
    padding: 10px;
  }
  ul {
    list-style: none;
    display: flex;
    justify-content: space-around;
  }
  li {
    color: white;
  }
  button {
    background-color: #e74c3c;
    border: none;
    color: white;
    padding: 5px 10px;
    cursor: pointer;
  }
  button:hover {
    background-color: #c0392b;
  }
  </style>
  