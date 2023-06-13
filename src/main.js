import { createApp } from 'vue';
import App from './App.vue';
import Vuex from 'vuex';

const store = new Vuex.Store({
    state: {
        user: null
    }
});

const app = createApp(App);

app.use(store);

app.mount('#app');

export default store;