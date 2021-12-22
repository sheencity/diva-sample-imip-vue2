import Vue from "vue";
import VueRouter from "vue-router";
import Main from "views/main/main.vue";
import Home from 'views/home'
import Introduction from "views/main/introduction";
import Achievement from "views/main/investment/achievement";
import Space from "views/main/investment/space";
import Plan from "views/main/investment/plan";

Vue.use(VueRouter);

const routes = [
    { path: "/home", name: "首页", component: Home },
    {
        path: '',
        component: Main,
        redirect: '/home',
        children: [
          { path: "/introduction", name: "项目介绍", component: Introduction },
          {
            path: "/carbon-neutral",
            name: "碳中和",
            component: Introduction,
            redirect: "/carbon-neutral/energy",
          },
          {
            path: "/carbon-neutral/energy",
            name: "碳中和/能源",
            component: Introduction,
          },
          {
            path: "/wisdom-operation",
            name: "智慧运营",
            component: Introduction,
            redirect: "/wisdom-operation/work",
          },
          { path: "/wisdom-operation/work", component: Introduction },
          { path: "/wisdom-operation/environment", component: Introduction },
          { path: "/wisdom-operation/fire-control", component: Introduction },
          { path: "/wisdom-operation/production", component: Introduction },
          { path: "/wisdom-operation/security", component: Introduction },
          { path: "/wisdom-operation/park", component: Introduction },
          {
            path: "/attract-investment",
            name: "产业招商",
            component: Achievement,
            redirect: "/attract-investment/achievement",
          },
          { path: "/attract-investment/achievement", component: Achievement },
          { path: "/attract-investment/space", component: Space },
          { path: "/attract-investment/plan", component: Plan },
        ]
    },
    // { path: "*", redirect: "/home"},
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
