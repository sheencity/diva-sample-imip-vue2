<template>
  <main v-if="data" class="home">
    <div class="home-logo">
      <img :src="data.logo" alt="logo" />
    </div>
    <h1 class="home-title">{{ data.title }}</h1>
    <button class="home-button" @click="login">{{ data.button.text }}</button>
  </main>
</template>

<script>
import { Subscription } from 'rxjs';
import { diva, dataService } from 'services/global';

export default {
  data() {
    return {
      initDivaData: null,
      data: null,
      clientSub: new Subscription(),
    };
  },
  methods: {
    async init() {
      await this.getConfig();
      this.initScene();
    },
    /**
     * 获取json数据
     */
    async getConfig() {
      const { data } = await this.axios.get('config/page/home.json');
      this.initDivaData = data.diva;
      this.data = data.panel['panel-center'];
    },
    /**
     * 初始化场景
     */
    async initScene() {
      await diva.client?.applyScene(this.initDivaData.init.scene_name);
    },
    /**
     * 进入系统
     */
    login() {
      this.$router.push('/introduction');
    },
  },
  created() {
    this.clientSub = dataService.divaClient.subscribe((value) => {
      if (value) this.init();
    });
  },
  destroyed() {
    this.clientSub.unsubscribe();
  },
};
</script>

<style lang="scss" scoped>
.home {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .home-logo {
    width: 200px;
    height: 68px;
    margin-bottom: 30px;
  }
  .home-title {
    font-weight: 500;
    font-size: 60px;
    line-height: 82px;
    margin-bottom: 60px;
    letter-spacing: 0.12em;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
  .home-button {
    pointer-events: all;
    width: 200px;
    height: 60px;
    font-weight: 500;
    font-size: 20px;
    line-height: 27px;
    color: #ffffff;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid #ffffff;
    border-radius: 4px;
  }

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100vh;
    background: linear-gradient(
      107.71deg,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.2) 101.14%
    );
    z-index: -2;
  }

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100vh;
    backdrop-filter: blur(4px);
    z-index: -1;
  }
}
</style>
