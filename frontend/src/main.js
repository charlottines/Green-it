import { createApp } from 'vue'
import App from "/src/App.vue"
import router from "/src/router/index.js"
import '@/assets/style.css'

createApp(App).use(router).mount('#app')
