import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import NavBar from "./components/NaviBar.vue";

const app = createApp(App);

app.use(router).mount("#app");

app.component("NavBar", NavBar);
