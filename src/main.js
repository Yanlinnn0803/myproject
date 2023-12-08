import { createApp } from 'vue'
import App from './App.vue'
import router  from './router'; // 导入 router
import store  from './store'; // 导入 store 
import axios from 'axios';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { firebaseConfig } from "./config/firebaseConfig.js";
import '@fortawesome/fontawesome-free/css/all.css'; // 引入 font-awesome 的 CSS 樣式
firebase.initializeApp(firebaseConfig);
axios.defaults.baseURL = '/api';
createApp(App).use(router).use(store).mount('#app')