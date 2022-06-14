<template>
  <main>
    <div id="backendContainer" class="backend-container"></div>
    <router-view></router-view>
  </main>
</template>
<script>
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { diva, dataService } from './services/global';

export default {
  data() {
    return {
      backendContainer: null,
      changeResolution: new Subject(),
    }
  },
  async mounted() {
    this.backendContainer = document.getElementById("backendContainer");
    if (this.backendContainer) {
      //初始话 webRtc 链接
      await diva.init(this.backendContainer);
      if (!diva.client) {
        new Error('diva client is not initialized');
        return;
      }
      dataService._diva.next(true);
      //  设置服务后端分辨率
      this.updateResolution();
      // 监听显示区域的改变 
      const resizeObserver = new ResizeObserver(() => {
        this.changeResolution.next(true);
      });
      resizeObserver.observe(this.backendContainer);
      this.changeResolution
        .pipe(debounceTime(200))
        .subscribe(this.updateResolution);
    }
  },
  destroyed() {
    this.changeResolution.unsubscribe();
  },
  methods: {
    updateResolution() {
      if (!diva.isEmbeddedMode()) {
        const width = this.backendContainer.clientWidth;
        const height = this.backendContainer.clientHeight;
        diva.client.setResolution({ width, height });
      }
    },
  },
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
