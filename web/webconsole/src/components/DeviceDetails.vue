<template>
  <div>
    <h2>设备详情</h2>
    <button @click="startDevice">启动设备</button>
    <button @click="stopDevice">停止设备</button>
    <ul>
      <li v-for="log in logs" :key="log.date">
        {{ log.date }} - {{ log.data }}
      </li>
    </ul>
  </div>
</template>

<script>
import { getDeviceDetails, controlDevice } from '../services/api'

export default {
  data() {
    return {
      logs: []
    }
  },
  created() {
    const deviceId = this.$route.params.id
    this.fetchDeviceLogs(deviceId)
  },
  methods: {
    async fetchDeviceLogs(deviceId) {
      try {
        const response = await getDeviceDetails(deviceId)
        this.logs = response.data.logs
      } catch (error) {
        alert('获取设备日志失败')
      }
    },
    async startDevice() {
      const deviceId = this.$route.params.id
      try {
        await controlDevice(deviceId, 'run')
        alert('设备启动成功')
      } catch (error) {
        alert('设备启动失败')
      }
    },
    async stopDevice() {
      const deviceId = this.$route.params.id
      try {
        await controlDevice(deviceId, 'stop')
        alert('设备停止成功')
      } catch (error) {
        alert('设备停止失败')
      }
    }
  }
}
</script>
