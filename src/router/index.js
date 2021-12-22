import Vue from "vue";
import VueRouter from "vue-router";
import Home from '../views/home/index'

Vue.use(VueRouter);

const routes = [
    {
        path: '',
        component: Home,
        redirect: '/home',
        children: []
    },
    { path: "/home", name: "首页", component: Home },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
