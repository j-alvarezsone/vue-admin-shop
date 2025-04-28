import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";

import { createApp } from "vue";
import App from "./App.vue";

import { ripple } from "./directives/ripple";
import router from "./router";
import "./assets/main.css";

const app = createApp(App);

app.directive("ripple", ripple);

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin);

app.mount("#app");
