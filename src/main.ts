import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";
import { createApp } from "vue";

import Toast from "vue-toastification";
import App from "./App.vue";

import { ripple } from "./directives/ripple";
import router from "./router";
import "./assets/main.css";
import "vue-toastification/dist/index.css";

const app = createApp(App);

app.directive("ripple", ripple);

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin);
app.use(Toast);

app.mount("#app");
