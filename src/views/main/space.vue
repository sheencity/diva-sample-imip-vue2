<template>
  <article class="space-between">
    <aside class="space-left all">
      <app-basic-info
        class="top10"
        v-if="basicInfoData"
        :header="basicInfoData.header"
        :dataSource="basicInfoData.content.data"
      ></app-basic-info>
    </aside>
    <aside class="space-right all">
      <app-camera-album
        v-if="cameraAlbumData"
        :dataSource="cameraAlbumData.content"
        @check="changeCameraTrack"
      ></app-camera-album>
    </aside>
  </article>
</template>

<script>
import AppBasicInfo from 'components/common/basic-info';
import AppCameraAlbum from 'components/common/camera-album';
import { diva } from 'services/global';

export default {
  data() {
    return {
      divaData: null,
      basicInfoData: null,
      cameraAlbumData: null,
    };
  },
  async created() {
    const { data } = await this.axios.get('/config/page/space.json');
    this.divaData = data.diva;
    this.basicInfoData = data['panel-left'][0];
    this.cameraAlbumData = data['panel-right'][0];

    this.initScene();
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
  },
};
</script>

<style lang="scss" scoped>

</style>
