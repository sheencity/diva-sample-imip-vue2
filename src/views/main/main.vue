<template>
  <div class="win">
    <main>
      <app-header></app-header>
      <router-view></router-view>
      <app-footer></app-footer>
    </main>
  </div>
</template>

<script>
import AppHeader from 'components/header';
import AppFooter from 'components/footer';

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
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.4) 100%
    )
    top/100% 170px no-repeat;
  }
}
</style>
