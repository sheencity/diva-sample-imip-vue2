<template>
  <main>
    <div ref="backendContainer" class="backend-container"></div>
    <router-view></router-view>
  </main>
</template>
<script>
import { diva, dataService } from 'services/global';
import { Subject } from 'rxjs';
  import { debounceTime } from "rxjs/operators";

export default {
  data(){
    return {
      changeResolution: new Subject(),
    }
  },
  async mounted() {
    const backendContainer = this.$refs.backendContainer;
    if (backendContainer) {
      await diva.init(backendContainer);
      this.updateResolution();
      const resizeObserver = new ResizeObserver(() => {
        this.changeResolution.next(true);
      });
      resizeObserver.observe(backendContainer);
      this.changeResolution
        .pipe(debounceTime(200))
        .subscribe(this.updateResolution);
      // 通知其他组件 diva.clent 可用了
      if (diva.client) dataService._diva.next(true);
    }
  },
  methods: {
    /**
     * 设置 diva 分辨率随浏览器窗口改变
     */
    updateResolution() {
      const width = this.$refs.backendContainer.clientWidth;
      const height = this.$refs.backendContainer.clientHeight;
      diva.client.setResolution({
        width,
        height,
      });
    },
  }
};
</script>

<style lang="scss" scoped>
  .backend-container{
    position: fixed;
    top: -1px;
    left: -1px;
    bottom: -1px;
    right: -1px;
  }
</style>
