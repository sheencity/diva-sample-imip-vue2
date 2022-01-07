<template>
  <article class="space-between">
    <aside class="space-left all">
      <app-table-col3
        v-if="deviceListData"
        :maxItem="2"
        :header="deviceListData.header"
        :thead="deviceListData.content.head"
        :dataSource="deviceListData.content.data"
        @select="deviceChange"
      ></app-table-col3>

      <app-echarts
        class="top10"
        v-if="CH2OData"
        :header="CH2OData.header"
        :dataSource="CH2OData.content"
      ></app-echarts>

      <app-echarts
        class="top10"
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
        class="top10"
        v-if="PM25Data"
        :header="PM25Data.header"
        :dataSource="PM25Data.content"
      ></app-echarts>

      <echarts
        class="top10"
        v-if="VOCData"
        :header="VOCData.header"
        :dataSource="VOCData.content"
      ></echarts>
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
      divaData: null,
      deviceListData: null,
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
    const { data } = await this.axios.get('/config/page/environment.json');
    this.divaData = data.diva;
    this.deviceListData = data['panel-left'][0];
    this.CH2OData = data['panel-left'][1];
    this.CO2Data = data['panel-left'][2];
    this.tempHumiData = data['panel-right'][0];
    this.PM25Data = data['panel-right'][1];
    this.VOCData = data['panel-right'][2];

    await this.initScene();
  },
  async destroyed() {
    if (this.deviceId) {
      try {
        await diva.client.request('DestroyWebWidget', { entityId: this.deviceId });
      } catch (err) {
        console.warn(err);
      }
    }
  },
  methods: {
    // 初始化场景
    async initScene() {
      await diva.client?.applyScene(this.divaData.init.scene_name);
      this.getDeviceInfo();
    },
    // 获取设备信息
    async getDeviceInfo() {
      this.deviceListData.content.data.forEach(async (item) => {
        const model = await diva.getEntityByName(item.diva.model[0].name);
        this.deviceMap.set(model.id, item.id);
        model?.addEventListener('click', this.setWebWidget);
      });
    },
    // 点击设备弹出弹窗
    async setWebWidget(e) {
      this.deviceId = e.target;
      const equipmentId = this.deviceMap.get(e.target);
      const widgetOption = this.deviceListData.content.diva.action
        .filter((action) => action.name === 'set_web_widget')[0]
        .param;
      
      const url = `${window.location.origin}/#/pop-up/environment/widget/${equipmentId}`;
      diva.client.request('CreateWebWidget', {
        entityId: e.target,
        widget: {
          url,
          ...widgetOption,
        },
      });
    },
    // 点击设备列表聚焦至设备
    deviceChange(name, e) {
      const focusOption = this.deviceListData.content.diva.action
        .filter((action) => action.name === 'focus')[0]
        .param;
      const modelName = e.diva.model[0].name;
      diva.focusOnModelByName(modelName, focusOption.distance, focusOption.pitch);
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
