<template>
  <article v-if="initDivaData" class="space-between">
    <aside class="space-left all">
      <app-button-tab class="top10" :header="buttonTabData.header" :dataSource="buttonTabData.content"></app-button-tab>
    </aside>
    <aside class="space-right all">
      <app-switcher-list-panel class="top10" :header="switchPanelData.header" :dataSource="switchPanelData.content.data"
        @checked="checked"
      ></app-switcher-list-panel>
    </aside>
  </article>
</template>


<script>
import { diva } from 'services/global'
import AppButtonTab from 'components/common/button-tab'
import AppSwitcherListPanel from 'components/common/switcher-list-panel'
export default {
   data() {
    return {
      initDivaData: null,
      buttonTabData: null,
      barChartsData: null,
      pieChartsData: null,
      switchPanelData: null
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await this.getConfig();
    },
    async getConfig() {
      const { data } = await this.axios.get('config/page/energy.json');
      console.log(data)
      this.initDivaData = data.diva;
      this.buttonTabData = data.panel['panel-left'][0];
      this.barChartsData = data.panel['panel-left'][1];
      this.pieChartsData = data.panel['panel-left'][2];
      this.switchPanelData = data.panel['panel-right'][0];
    },
    checked(e){
      console.log(e)
    }
  },
  components: {
    AppButtonTab,
    AppSwitcherListPanel
  }

}
</script>

<style lang="scss" scoped>

</style>