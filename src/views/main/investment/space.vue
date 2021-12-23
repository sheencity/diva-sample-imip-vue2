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
        <app-camera-album :dataSource="cameraAlbumData.content"></app-camera-album>
      </template>
    </aside>
  </article>
</template>

<script>
import AppBasicInfo from "components/common/basic-info";
import AppCameraAlbum from "components/common/camera-album";
import Echarts from "components/common/echarts";

export default {
  data() {
    return {
      basicInfoData: null,
      cameraAlbumData: null,
    };
  },
  created() {
    this.axios.get('/config/page/space.json').then((res) => {
      this.basicInfoData = res.data['panel-left'][0];
      this.cameraAlbumData = res.data['panel-right'][0];
    });
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
