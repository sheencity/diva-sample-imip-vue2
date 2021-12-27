<template>
  <article class="space-between">
    <aside class="space-left all">
      <template v-if="buttonTabData">
        <app-button-tab
          :header="buttonTabData.header"
          :dataSource="buttonTabData.content"
          @select="buttonTabChange"
        >
        </app-button-tab>
      </template>
      <template v-if="monitorListData && selectedIndex === 0">

      </template>
      <app-switcher-list
        v-show="trafficListData && selectedIndex === 1"
        class="top10"
        :header="trafficListData.header"
        :dataSource="trafficListData.content.data"
      >
      </app-switcher-list>
    </aside>
    <aside class="space-right all">
      <template v-if="abnormalEventsData">
        <echarts
          :header="abnormalEventsData.header"
          :dataSource="abnormalEventsData.content"
        >
        </echarts>
      </template>
      <template v-if="abnormalAreaData">
        <echarts
          class="top10"
          :header="abnormalAreaData.header"
          :dataSource="abnormalAreaData.content"
        >
        </echarts>
      </template>
    </aside>
  </article>
</template>

<script>
import Echarts from "components/common/echarts";
import AppButtonTab from "components/common/button-tab";
import AppSwitcherList from "components/common/switcher-list-panel";

export default {
  data() {
    return {
      buttonTabData: null,
      monitorListData: null,
      trafficListData: null,
      abnormalEventsData: null,
      abnormalAreaData: null,
      selectedIndex: 0,
    };
  },
  created() {
    this.axios.get('/config/page/security.json').then((res) => {
      this.buttonTabData = res.data['panel-left'][0];
      this.monitorListData = res.data['panel-left'][1];
      this.trafficListData = res.data['panel-left'][2];
      this.abnormalEventsData = res.data['panel-right'][0];
      this.abnormalAreaData = res.data['panel-right'][1];
    });
  },
  methods: {
    buttonTabChange(index) {
      this.selectedIndex = index;
      // TODO diva action
    },
  },
  components: {
    Echarts,
    AppButtonTab,
    AppSwitcherList,
  }
};
</script>

<style lang="scss" scoped>

</style>
