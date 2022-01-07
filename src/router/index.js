import Vue from 'vue';
import VueRouter from 'vue-router';
import Main from 'views/main/main.vue';
import Home from 'views/home';
import Introduction from 'views/main/introduction';
import Energy from 'views/main/energy.vue';
import Achievement from 'views/main/achievement.vue';
import Space from 'views/main/space.vue';
import Plan from 'views/main/planing.vue';
import Office from 'views/main/office.vue';
import Park from 'views/main/parking.vue';
import Environment from 'views/main/environment.vue';
import Security from 'views/main/security.vue';
import FireControl from 'views/main/fire-control.vue';
import Widget from 'components/widget';

Vue.use(VueRouter);

const routes = [
  { path: '/home', name: '首页', component: Home },
  {
    path: '',
    component: Main,
    redirect: '/home',
    children: [
      { path: '/introduction', name: '项目介绍', component: Introduction },
      {
        path: '/carbon-neutral',
        name: '碳中和',
        component: Energy,
        redirect: '/carbon-neutral/energy',
      },
      {
        path: '/carbon-neutral/energy',
        name: '碳中和/能源',
        component: Energy,
      },
      {
        path: '/wisdom-operation',
        name: '智慧运营',
        component: Office,
        redirect: '/wisdom-operation/office',
      },
      { path: '/wisdom-operation/office', component: Office },
      { path: '/wisdom-operation/environment', component: Environment },
      { path: '/wisdom-operation/fire-control', component: FireControl },
      { path: '/wisdom-operation/security', component: Security },
      { path: '/wisdom-operation/parking', component: Park },
      {
        path: '/attract-investment',
        name: '产业招商',
        component: Achievement,
        redirect: '/attract-investment/achievement',
      },
      { path: '/attract-investment/achievement', component: Achievement },
      { path: '/attract-investment/space', component: Space },
      { path: '/attract-investment/planing', component: Plan },
    ],
  },
  { path: '*/widget', component: Widget },
  { path: '*/widget/:id', component: Widget },
  { path: '*', redirect: '/home' },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

export default router;
