<template>
  <div>
    <h2>设备日志</h2>
    <ul>
      <li v-for="log in logs" :key="log.date">{{ log.date }} - {{ log.data }}</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      logs: []
    };
  },
  async mounted() {
    const did = this.$route.params.did;
    try {
      const response = await axios.get(`/api/device_logs/${did}`);
      this.logs = response.data.logs;
    } catch (error) {
      alert('获取日志失败');
    }
  }
};
</script>
