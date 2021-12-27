import Vue from "vue";
import VueRouter from "vue-router";
import Main from "views/main/main.vue";
import Home from 'views/home'
import Introduction from "views/main/introduction";
import Energy from 'views/main/carbon-neutral/energy'
import Achievement from "views/main/investment/achievement";
import Space from "views/main/investment/space";
import Plan from "views/main/investment/plan";
import Office from "views/main/wisdom-operation/office";
import Park from "views/main/wisdom-operation/park";
import Environment from "views/main/wisdom-operation/environment";

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
            component: Energy,
            redirect: "/carbon-neutral/energy",
          },
          {
            path: "/carbon-neutral/energy",
            name: "碳中和/能源",
            component: Energy,
          },
          {
            path: "/wisdom-operation",
            name: "智慧运营",
            component: Office,
            redirect: "/wisdom-operation/office",
          },
          { path: "/wisdom-operation/office", component: Office },
          { path: "/wisdom-operation/environment", component: Environment },
          { path: "/wisdom-operation/fire-control", component: Introduction },
          { path: "/wisdom-operation/security", component: Introduction },
          { path: "/wisdom-operation/park", component: Park },
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
