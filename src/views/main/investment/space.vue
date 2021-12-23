<template>
  <article class="space-between">
    <aside class="space-left all">
      <template v-if="echartsData">
        <echarts
          :header="echartsData.header"
          :dataSource="echartsData.content"
        >
        </echarts>
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
import AppDialog from "components/common/dialog/dialog";
import AppBasicInfo from "components/common/basic-info";
import AppCameraAlbum from "components/common/camera-album";
import Echarts from "components/common/echarts";

export default {
  data() {
    return {
      echartsData: null,
      basicInfoData: null,
      cameraAlbumData: null,
    };
  },
  created() {
    this.axios.get('/config/page/space.json').then((res) => {
      this.echartsData = res.data['panel-left'][0];
      this.basicInfoData = res.data['panel-left'][1];
      this.cameraAlbumData = res.data['panel-right'][0];
    });
  },
  components: {
    AppDialog,
    AppBasicInfo,
    AppCameraAlbum,
    Echarts,
  }
};
</script>

<style lang="scss" scoped>

</style>
