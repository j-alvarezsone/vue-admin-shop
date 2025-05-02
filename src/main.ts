import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";
import { createApp } from "vue";

import Toast from "vue-toastification";
import App from "./App.vue";

import { clickOutside } from "./directives/click-outside";
import { focus } from "./directives/focus";
import { ripple } from "./directives/ripple";
import { tooltip } from "./directives/tooltip";
import router from "./router";
import "./assets/main.css";
import "./assets/tooltip.css";
import "vue-toastification/dist/index.css";

const app = createApp(App);

app.directive("ripple", ripple);
app.directive("tooltip", tooltip);
app.directive("focus", focus);
app.directive("click-outside", clickOutside);

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin);
app.use(Toast);

app.mount("#app");
