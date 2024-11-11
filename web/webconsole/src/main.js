import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { authStore } from './store/index';

const app = createApp(App);

authStore.loadFromLocalStorage();
app.use(router);
app.mount('#app');
