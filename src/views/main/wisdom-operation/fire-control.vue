<template>
  <article v-if="initDivaData" class="space-between">
    <aside class="space-left all">
      <app-table-mulit-col3 
        class="top10" 
        :dataSource="tablePanelData.content.data"
        :maxItem="4"
        @select="select"
        @unselect="unselect"
      ></app-table-mulit-col3>
    </aside>
    <aside class="space-right all">
      
    </aside>
  </article>
</template>


<script>
import { diva } from 'services/global'
import AppTableMulitCol3 from 'components/common/table/table-mulit-col3'
import { Vector3 } from "@sheencity/diva-sdk-math";
import { POI } from "@sheencity/diva-sdk";

export default {
   data() {
    return {
      initDivaData: null,
      commonConfig: null,
      tablePanelData: null,

      /**
       * @type {import("@sheencity/diva-sdk").TypedGroup}
       */
      floorModelGroup: null,
      // 监听应用场景
      cameraSubscription: null,
    };
  },
  async created() {
    await this.init();
    this.initScene(this.initDivaData.init.scene_name);
  },
  methods: {
    async init() {
      await this.getConfig();
      this.commonConfig = this.initDivaData.common;
    },
    async getConfig() {
      const { data } = await this.axios.get('config/page/firecontrol.json');
      this.initDivaData = data.diva;
      this.tablePanelData = data['panel-left'][0];
    },
    /**
     * 初始化场景
     * @param[string] e
     */
    async initScene(name) {
      await diva.client?.applyScene(name);
      this.cameraSubscription = setTimeout(() => {
        this.initSceneEffect();
      }, 1500);
    },

    /**
     * 监听应用场景
     */
    async initSceneEffect() {
      this.floorModelGroup = await this.getFloorModelGroup();
      await diva.drawOutFloor(
        this.floorModelGroup,
        false,
        this.commonConfig.default_floor_index
      );
      const floorBoundingInfo = await this.floorModelGroup.getBoundingInfo();
      const floorCoord = floorBoundingInfo.boundingBox.center;
      const focusCoord = floorCoord.add(
        new Vector3(0, this.commonConfig.default_translate_distance, 0)
      );
      await diva.client.request("FocusOnCoord", {
        coord: focusCoord.tuple,
        ...this.commonConfig.floor_focus_param
      });
    },

    /**
     * 获取当前模型组
     */
    async getFloorModelGroup() {
      const result = await diva.getFloorInfoByName(this.commonConfig.resource_group_name);
      return result;
    },




    /**
     * 点击列表事件
     * @param name 点击设备名
     * @param e 点击对象
     */
    async select(name,e){
      const { distance, pitch } = e.focus_param;
      const mode = e.render_mode;
      await this.floorModelGroup.setRenderingStyleMode("default");
      await diva.renderAndFocusOnModelByName(name, distance, pitch, mode);
    },
    /**
     * 点击列表获取上次点击事件
     * @param name 点击设备名
     * @param e 点击对象
     */
    unselect(oldName,e){
      console.log({ oldName, e })
    }
  },
  async beforeDestroy(){
    // 组件销毁时重置状态
    if (this.floorModelGroup) {
      await diva.drawOutFloor(
        this.floorModelGroup,
        true,
        this.commonConfig.default_floor_index
      );
      await Promise.all(
        Array.from(this.floorModelGroup).map((model) => {
          model instanceof POI
            ? Promise.resolve()
            : model.setRenderingStyleMode("default");
        })
      );
    }
    clearTimeout(this.cameraSubscription);
  },
  components: {
    AppTableMulitCol3
  }

}
</script>

<style lang="scss" scoped>

</style>