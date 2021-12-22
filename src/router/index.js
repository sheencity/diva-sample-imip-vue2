import Vue from "vue";
import VueRouter from "vue-router";
import Main from "views/main/main.vue";
import Home from 'views/home'
import Introduction from "views/main/introduction";

Vue.use(VueRouter);

const routes = [
    { path: "/home", name: "首页", component: Home },
    {
        path: '',
        component: Main,
        redirect: '/home',
        children: [
          { path: "/introduction", name: "项目介绍", component: Introduction },
        ]
    },
    { path: "*", redirect: "/home"},
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
