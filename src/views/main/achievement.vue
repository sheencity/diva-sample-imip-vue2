<template>
  <article class="space-between">
    <aside class="space-left all">
      <template v-if="statisticsData">
        <app-statistics-panel :dataSource="statisticsData"></app-statistics-panel>
      </template>
      <template v-if="basicInfoData">
        <app-basic-info
          class="top10"
          :header="basicInfoData.header"
          :dataSource="basicInfoData.content.data"
        >
        </app-basic-info>
      </template>
      <template v-if="textListData">
        <app-scroller-table
          class="top10"
          :header="textListData.header"
          :dataSource="textListData.content.data"
          :thead="textListData.content.header"
          :dataLength="textListData.content.data.length"
          :autoScroll="textListData.content.scroll"
          :height="36"
          :contentHeight="220"
        >
        </app-scroller-table>
      </template>
    </aside>
    <aside class="space-right all">
      <template v-if="ringPieData">
        <echarts
          :header="ringPieData.header"
          :dataSource="ringPieData.content"
        >
        </echarts>
      </template>
      <template v-if="basicBarData">
        <echarts
          class="top10"
          :header="basicBarData.header"
          :dataSource="basicBarData.content"
        >
        </echarts>
      </template>
      <template v-if="horBarData">
        <echarts
          class="top10"
          :header="horBarData.header"
          :dataSource="horBarData.content"
        >
        </echarts>
      </template>
    </aside>
  </article>
</template>

<script>
import AppDialog from "components/common/dialog/dialog";
import AppBasicInfo from "components/common/basic-info";
import AppStatisticsPanel from "components/common/statistics-panel";
import AppScrollerTable from "components/common/table/scroller-table";
import Echarts from "components/common/echarts";
import { diva } from "services/global";

export default {
  data() {
    return {
      divaData: null,
      statisticsData: null,
      basicInfoData: null,
      textListData: null,
      ringPieData: null,
      basicBarData: null,
      horBarData: null
    };
  },
  methods: {
    initScene() {
      diva?.client?.applyScene(this.divaData.init.scene_name);
    }
  },
  created() {
    this.axios.get("/config/page/achievement.json").then((res) => {
      this.divaData = res.data.diva;
      this.statisticsData = res.data['panel-left'][0];
      this.basicInfoData = res.data['panel-left'][1];
      this.textListData = res.data['panel-left'][2];
      this.ringPieData = res.data['panel-right'][0];
      this.basicBarData = res.data['panel-right'][1];
      this.horBarData = res.data['panel-right'][2];

      this.initScene();
    });
  },
  components: {
    AppDialog,
    AppBasicInfo,
    AppStatisticsPanel,
    AppScrollerTable,
    Echarts,
  },
};
</script>

<style lang="scss" scoped>
.module-2 {
  color: #ebebeb;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 1px;
  padding-left: 20px;
  li {
    list-style: unset;
  }
}
.module-3 {
  .thead {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    span {
      text-align: center;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
    }
    .col-1 {
      width: 140px;
      text-align: left;
    }
    .col-2 {
      width: 100px;
      text-align: left;
    }
    .col-3 {
      width: 40px;
    }
  }
  .roll {
    overflow: hidden;
    max-height: 36px * 6;
  }

  .tbody {
    @extend .thead;
    width: 100%;
    height: 36px;
    margin-bottom: 0;
    border-top: 1px dashed rgba(255, 255, 255, 0.4);
  }
}
</style>
