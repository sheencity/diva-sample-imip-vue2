<template>
  <article class="space-between">
    <aside class="space-left all">
      <template v-if="deviceListData">
        <app-table-col3
          :maxItem="2"
          :header="deviceListData.header"
          :thead="deviceListData.content.head"
          :dataSource="deviceListData.content.data"
          @select="deviceChange"
        >
        </app-table-col3>
      </template>
      <template v-if="CH2OData">
        <echarts
          class="top10"
          :header="CH2OData.header"
          :dataSource="CH2OData.content"
        >
        </echarts>
      </template>
      <template v-if="CO2Data">
        <echarts
          class="top10"
          :header="CO2Data.header"
          :dataSource="CO2Data.content"
        >
        </echarts>
      </template>
    </aside>
    <aside class="space-right all">
      <template v-if="tempHumiData">
        <echarts
          :header="tempHumiData.header"
          :dataSource="tempHumiData.content"
        >
        </echarts>
      </template>
      <template v-if="PM25Data">
        <echarts
          class="top10"
          :header="PM25Data.header"
          :dataSource="PM25Data.content"
        >
        </echarts>
      </template>
      <template v-if="VOCData">
        <echarts
          class="top10"
          :header="VOCData.header"
          :dataSource="VOCData.content"
        >
        </echarts>
      </template>
    </aside>
  </article>
</template>

<script>
import Echarts from "components/common/echarts";
import AppTableCol3 from "components/common/table/table-col3";
import { diva } from "services/global";

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
  created() {
    this.axios.get('/config/page/environment.json').then((res) => {
      this.divaData = res.data.diva;
      this.deviceListData = res.data['panel-left'][0];
      this.CH2OData = res.data['panel-left'][1];
      this.CO2Data = res.data['panel-left'][2];
      this.tempHumiData = res.data['panel-right'][0];
      this.PM25Data = res.data['panel-right'][1];
      this.VOCData = res.data['panel-right'][2];

      this.initScene();
    });
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
        console.log(this.deviceMap);
        model?.addEventListener('click', this.popDevice);
      });
    },
    // 点击设备弹出弹窗
    async popDevice(e) {
      this.deviceId = e.target;
      const equipmentId = this.deviceMap.get(e.target);
      const widgetOption = this.deviceListData.content.diva.action
        .filter((action) => action.name === 'set_web_widget')[0]
        .param;
      
      const url = `${window.location.origin}/#/pop-up/environment/device/${equipmentId}`;
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
      console.log(name, e);
      const focusOption = this.deviceListData.content.diva.action
        .filter((action) => action.name === 'focus')[0]
        .param;
      const modelName = e.diva.model[0].name;
      diva.focusOnModelByName(modelName, focusOption.distance, focusOption.pitch);
    },
  },
  components: {
    Echarts,
    AppTableCol3,
  }
};
</script>

<style lang="scss" scoped>

</style>
