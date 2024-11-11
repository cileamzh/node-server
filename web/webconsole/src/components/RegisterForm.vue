<template>
  <div>
    <h2>用户注册</h2>
    <form @submit.prevent="registerUser">
      <label for="uname">用户名:</label>
      <input v-model="form.uname" type="text" id="uname" required />
      
      <label for="password">密码:</label>
      <input v-model="form.password" type="password" id="password" required />
      
      <label for="email">邮箱:</label>
      <input v-model="form.email" type="email" id="email" required />
      
      <button type="submit">注册</button>
    </form>
  </div>
</template>

<script>
import { register } from '../services/api'

export default {
  data() {
    return {
      form: {
        uname: '',
        password: '',
        email: ''
      }
    }
  },
  methods: {
    async registerUser() {
      try {
        const response = await register(this.form)
        alert(response.data.message)
        this.$router.push('/login')
      } catch (error) {
        alert('注册失败')
      }
    }
  }
}
</script>
