<template>
  <article class="space-between">
    <aside class="space-left all">
      <app-table-col3
        v-if="deviceList"
        :maxItem="2"
        :header="deviceList.header"
        :thead="deviceList.content.head"
        :dataSource="deviceList.content.data"
        @select="deviceChange"
      ></app-table-col3>

      <app-echarts
        class="card-mt"
        v-if="CH2OData"
        :header="CH2OData.header"
        :dataSource="CH2OData.content"
      ></app-echarts>

      <app-echarts
        class="card-mt"
        v-if="CO2Data"
        :header="CO2Data.header"
        :dataSource="CO2Data.content"
      ></app-echarts>
    </aside>
    <aside class="space-right all">
      <app-echarts
        v-if="tempHumiData"
        :header="tempHumiData.header"
        :dataSource="tempHumiData.content"
      ></app-echarts>

      <app-echarts
        class="card-mt"
        v-if="PM25Data"
        :header="PM25Data.header"
        :dataSource="PM25Data.content"
      ></app-echarts>

      <app-echarts
        class="card-mt"
        v-if="VOCData"
        :header="VOCData.header"
        :dataSource="VOCData.content"
      ></app-echarts>
    </aside>
  </article>
</template>

<script>
import AppEcharts from 'components/common/echarts';
import AppTableCol3 from 'components/common/table/table-col3';
import { diva } from 'services/global';

export default {
  data() {
    return {
      divaParams: null,
      deviceList: null,
      CH2OData: null,
      CO2Data: null,
      tempHumiData: null,
      PM25Data: null,
      VOCData: null,
      /**
       * 存储设备信息 
       * diva 世界中的设备 id => json 数据中的设备 id
       */
      deviceMap: new Map(),
      // 存在弹窗的设备 id
      deviceId: null,
    };
  },
  async created() {
    await this.init();
  },
  async destroyed() {
    if (this.deviceId) {
      try {
        await diva.destroyWedWidget(this.deviceId);
      } catch (err) {
        console.warn(err);
      }
    }
  },
  methods: {
    async init() {
      await this.initConfig();
      await this.initScene();
      await this.initDeviceInfo();
    },
    async initConfig() {
      const { data } = await this.axios.get('config/page/environment.json');
      this.divaParams = data.diva;
      [this.deviceList, this.CH2OData, this.CO2Data] = data['panel-left'];
      [this.tempHumiData, this.PM25Data, this.VOCData] = data['panel-right'];
    },
    /**
     * 初始化场景
     */
    async initScene() {
      await diva.applySceneByName(this.divaParams.init.scene_name);
    },
    /**
     * 获取设备信息
     */
    async initDeviceInfo() {
      this.deviceList.content.data.forEach(async (item) => {
        const [model] = await diva.getEntityByName(item.diva.model[0].name);
        this.deviceMap.set(model.id, item.id);
        model?.addEventListener('click', this.setWebWidget);
      });
    },
    /**
     * 点击设备弹出弹窗
     */
    async setWebWidget(e) {
      if (e.detail.button !== 0) return;
      this.deviceId = e.target;
      const equipmentId = this.deviceMap.get(e.target);
      const widgetOption = this.deviceList.content.diva.action
        .filter((action) => action.name === 'set_web_widget')[0]
        .param;
      
      const url = window.location.pathname !== '/'
        ? `${window.location.origin}${window.location.pathname}#/pop-up/environment/widget/${equipmentId}`
        : `${window.location.origin}/#/pop-up/environment/widget/${equipmentId}`;
      diva.createWedWidget(e.target, url, widgetOption);
    },
    /**
     * 点击设备列表聚焦至设备
     */
    deviceChange(name, e) {
      const { distance, pitch } = this.deviceList.content.diva.action
        .filter((action) => action.name === 'focus')[0]
        .param;
      const modelName = e.diva.model[0].name;
      diva.focusOnModelByName(modelName, distance, pitch);
    },
  },
  components: {
    AppEcharts,
    AppTableCol3,
  },
};
</script>

<style lang="scss" scoped>

</style>
