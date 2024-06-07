import { createApp } from 'vue';
import App from './App.vue';
import { useStore } from './store';
import 'amfe-flexible';

import '@/style/reset.css';
import '@/style/index.less';
import 'uno.css';

const app = createApp(App);

useStore(app);

app.mount('#app');
