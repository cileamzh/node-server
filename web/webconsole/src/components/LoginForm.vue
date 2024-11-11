<template>
  <div>
    <h2>用户登录</h2>
    <form @submit.prevent="loginUser">
      <label for="account">用户名/邮箱/手机号:</label>
      <input v-model="form.account" type="text" id="account" required />
      
      <label for="password">密码:</label>
      <input v-model="form.password" type="password" id="password" required />
      
      <button type="submit">登录</button>
    </form>
  </div>
</template>

<script>
import { login } from '../services/api'

export default {
  data() {
    return {
      form: {
        account: '',
        password: ''
      }
    }
  },
  methods: {
    async loginUser() {
      try {
        const response = await login(this.form)
        localStorage.setItem('token', response.data.token)
        this.$store.dispatch('login', { user: response.data.user, token: response.data.token })
        this.$router.push('/devices')
      } catch (error) {
        alert('登录失败')
      }
    }
  }
}
</script>
