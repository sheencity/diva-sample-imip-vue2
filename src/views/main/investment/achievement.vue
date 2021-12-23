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
    </aside>
    <aside class="space-right all">

    </aside>
  </article>
</template>

<script>
import AppBasicInfo from "components/common/basic-info";
import AppStatisticsPanel from "components/common/statistics-panel";

export default {
  data() {
    return {
      statisticsData: null,
      basicInfoData: null,
    };
  },
  methods: {
    async initCharts() {
      const barChart = echarts.init(this.$refs.barChart);
      const pieChart = echarts.init(this.$refs.pieChart);
      const recordChart = echarts.init(this.$refs.recordChart);

      const barOption = echartService.getBasicBarOption(
        this.echartsData.company_prof,
        true,
      );
      const pieOption = echartService.getBasicNightingaleOption(
        this.echartsData.company_counts,
        false,
      );
      const recordOption = echartService.getHorizonBarOption(this.echartsData.record_data);
      
      barChart.setOption(barOption);
      pieChart.setOption(pieOption);
      recordChart.setOption(recordOption);
    },
  },
  created() {
    this.axios.get("/config/page/achievement.json").then((res) => {
      this.statisticsData = res.data['panel-left'][0];
      this.basicInfoData = res.data['panel-left'][1];
    });
  },
  components: {
    AppBasicInfo,
    AppStatisticsPanel,
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
