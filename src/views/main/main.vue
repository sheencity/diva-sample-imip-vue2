<template>
  <div class="win">
    <main>
      <!-- 头部导航 -->
      <app-header></app-header>
      <!-- 中心内容 -->
      <router-view></router-view>
      <!-- 底部路由 -->
      <app-footer></app-footer>
    </main>
  </div>
</template>
<script>
// 所有的组件都按照App[组件名]命名规则
import AppHeader from "../components/header/header.vue";
import AppFooter from "../components/footer/index.vue";

export default {
  components: {
    AppHeader,
    AppFooter,
  },
};
</script>

<style lang="scss" scoped>
.win {
  main {
    position: relative;
    pointer-events: none;
    width: 100%;
    padding: 0px 30px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    // pointer-events: none;
    background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0.4) 100%
      )
      top/100% 170px no-repeat;
  }
}
</style>
