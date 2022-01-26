<template>
  <article class="space-between">
    <aside class="space-left all">
      <app-basic-info
        class="card-mt"
        v-if="basicInfo"
        :header="basicInfo.header"
        :dataSource="basicInfo.content.data"
      ></app-basic-info>
    </aside>
    <aside class="space-right all">
      <app-camera-album
        v-if="cameraAlbum"
        :dataSource="cameraAlbum.content"
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
      divaParams: null,
      basicInfo: null,
      cameraAlbum: null,
    };
  },
  async created() {
    await this.init();
  },
  destroyed() {
    this.reset();
  },
  methods: {
    async init() {
      await this.initConfig();
      await this.initScene();
    },
    async initConfig() {
      const { data } = await this.axios.get('config/page/space.json');
      this.divaParams = data.diva;
      [this.basicInfo] = data['panel-left'];
      [this.cameraAlbum] = data['panel-right'];
    },
    async initScene() {
      await diva.applySceneByName(this.divaParams.init.scene_name);
    },
    changeCameraTrack(e) {
      this.reset();
      if (e.diva.scene_name) diva.applySceneByName(e.diva.scene_name);
      else if (e.diva.camera_track_name) diva.playCameraTrack(e.diva.camera_track_name);
    },
    reset() {
      diva.client?.stopCameraTrack();
      this.divaParams?.destroy?.group
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
