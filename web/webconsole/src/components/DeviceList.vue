<template>
  <div>
    <h2>设备列表</h2>
    <button @click="logout">退出</button>
    <ul>
      <li v-for="device in devices" :key="device.client_id">
        {{ device.device_name }} - {{ device.status }}
        <button @click="viewDevice(device.client_id)">查看详情</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { getDevices } from '../services/api'

export default {
  data() {
    return {
      devices: []
    }
  },
  created() {
    this.fetchDevices()
  },
  methods: {
    async fetchDevices() {
      try {
        const response = await getDevices()
        this.devices = response.data.devices
      } catch (error) {
        alert('获取设备失败')
      }
    },
    viewDevice(deviceId) {
      this.$router.push(`/device/${deviceId}`)
    },
    logout() {
      localStorage.removeItem('token')
      this.$store.dispatch('logout')
      this.$router.push('/login')
    }
  }
}
</script>
