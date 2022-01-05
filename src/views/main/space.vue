<template>
  <article class="space-between">
    <aside class="space-left all">
      <template v-if="basicInfoData">
        <app-basic-info
          class="top10"
          :header="basicInfoData.header"
          :dataSource="basicInfoData.content.data"
        >
        </app-basic-info>
      </template>
    </aside>
    <aside class="space-right all">
      <template v-if="cameraAlbumData">
        <app-camera-album
          :dataSource="cameraAlbumData.content"
          @check="changeCameraTrack"
        >
        </app-camera-album>
      </template>
    </aside>
  </article>
</template>

<script>
import AppBasicInfo from "components/common/basic-info";
import AppCameraAlbum from "components/common/camera-album";
import Echarts from "components/common/echarts";
import { diva } from "services/global";

export default {
  data() {
    return {
      divaData: null,
      basicInfoData: null,
      cameraAlbumData: null,
    };
  },
  created() {
    this.axios.get('/config/page/space.json').then((res) => {
      this.divaData = res.data.diva;
      this.basicInfoData = res.data['panel-left'][0];
      this.cameraAlbumData = res.data['panel-right'][0];

      this.initScene();
    });
  },
  destroyed() {
    this.reset();
  },
  methods: {
    initScene() {
      diva?.client?.applyScene(this.divaData.init.scene_name);
    },
    changeCameraTrack(e) {
      this.reset();
      if (e.diva.scene_name) diva.client.applyScene(e.diva.scene_name);
      else if (e.diva.camera_track_name) diva.client.playCameraTrack(e.diva.camera_track_name);
    },
    reset() {
      diva.client?.stopCameraTrack();
      this.divaData?.destroy?.group
        .forEach((group) => diva.setEntityVisibleByGroup(group, false));
    }
  },
  components: {
    AppBasicInfo,
    AppCameraAlbum,
    Echarts,
  }
};
</script>

<style lang="scss" scoped>

</style>
