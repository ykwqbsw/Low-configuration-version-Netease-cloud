import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Search from "../views/Search.vue";
import Play from "../views/Play.vue";
import Sheet from "../views/Sheet.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    component: Home,
    meta: {
      needTabbar: true,
    },
  },
  {
    path: "/search",
    component: Search,
    meta: {
      needTabbar: true,
    },
  },
  {
    path: "/sheet/:id",
    component: Sheet,
  },
  {
    path: "/play/:id",
    component: Play,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
