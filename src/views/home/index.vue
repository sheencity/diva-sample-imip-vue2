<template>
  <main class="home">
    <div class="home-logo">
      <!-- <img src="../assets/home.png" alt="logo"> -->
    </div>
    <h1 class="home-title">智能制造产业园数字孪生平台</h1>
    <button ref="btn" class="home-button">进入系统</button>
  </main>
</template>

<script>
import { RenderingStyleMode, Overlay } from "@sheencity/diva-sdk";
import { Subscription } from 'rxjs';
import { diva, dataService } from 'services/global';

export default {
  data(){
    return{
      title: '',
      clientSub: new Subscription(),
    }
  },
  methods: {
    async initHome() {
      const { data } = await this.axios.get('https://diva.sheencity.cn/samples/imip-vue2-embedded/data/home.json');
      this.title = data.title;
      await diva.client?.applyScene(data.scene);

      // 后期将需要重置和解锁的路径配置到 json
      await diva.setEntityVisibleByGroup('功能辅助', false);
      await diva.client?.request("UpdateEntityStatusByGroup", {
        group: '产业园区',
        locked: false,
      });
      const modelGroup = await diva.client?.getEntitiesByGroupPath('产业园区/楼栋');
      modelGroup
        .filter((model) => !(model instanceof Overlay))
        .forEach((model) => model.setRenderingStyleMode(RenderingStyleMode.Default));
    },
  },
  created() {
    this.clientSub = dataService.divaClient.subscribe((value) => {
      if (value) this.initHome();
    });
  },
  mounted(){
    this.$refs.btn.addEventListener('click',()=>{
      this.$router.push('/introduction');
    });
  },
  destroyed() {
    this.clientSub.unsubscribe();
  },
}
</script>

<style lang="scss" scoped>
.home{
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .home-logo{
    width: 200px;
    height: 68px;
    margin-bottom: 30px;
  }
  .home-title{
    font-weight: 500;
    font-size: 60px;
    line-height: 82px;
    margin-bottom: 60px;
    letter-spacing: 0.12em;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
  .home-button{
    pointer-events: all;
    width: 200px;
    height: 60px;
    font-weight: 500;
    font-size: 20px;
    line-height: 27px;
    color: #FFFFFF;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid #FFFFFF;
    border-radius: 4px;
  }

  &::before{
    content: "";
    position: absolute;
    width: 100%;
    height: 100vh;
    background: linear-gradient(107.71deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 101.14%);
    z-index: -2;
  }


  &::after{
    content: "";
    position: absolute;
    width: 100%;
    height: 100vh;
    backdrop-filter: blur(20px);
    z-index: -1;
  }
}

</style>
