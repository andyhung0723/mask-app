import '@/assets/scss/reset.scss';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

library.add(fas);

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(pinia);
app.mount('#app');
