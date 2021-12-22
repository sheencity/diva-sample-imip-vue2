<template>
  <article class="space-between">
    <aside class="space-left all">
      <div class="top10">
        <app-dialog :header-key="header_1">
          <template v-slot:dialog-article>
            <div class="module-1">
              <div class="ranking">
                <div v-for="item in companyInfo" :key="item.title" class="item">
                  <p>{{ item.title }}</p>
                  <span :style="{ color: item.color }">{{ item.counts }}</span>
                  <!-- <img src="../assets/route4-1/1.png" /> -->
                </div>
              </div>
              <div class="statics">
                <div v-for="item in staticInfo" :key="item.title" class="item">
                  <!-- <img :src="require('../assets/route4-1/' + item.icon)" /> -->
                  <div>
                    <p>{{ item.title }}</p>
                    <p>{{ item.counts }}</p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </app-dialog>
      </div>
      <div class="top10">
        <app-dialog :header-key="header_2">
          <template v-slot:dialog-article>
            <ul v-for="item in supportList" :key="item" class="module-2">
              <li>{{ item }}</li>
            </ul>
          </template>
        </app-dialog>
      </div>
      <div class="top10">
        <app-dialog :header-key="header_3">
          <template v-slot:dialog-article>
            <div class="module-3">
              <div class="thead">
                <span class="col-1">企业名称</span>
                <span class="col-2">入驻区域</span>
                <span class="col-3">类型</span>
              </div>

              <app-scroller
                :dataLength="companyList.length"
                :height="36"
                :contentHeight="220"
              >
                <div
                  v-for="(item, index) in companyList"
                  :key="item.name + index"
                  class="tbody"
                >
                  <span class="col-1">{{ item.name }}</span>
                  <span class="col-2">{{ item.area }}</span>
                  <span class="col-3">{{ item.type }}</span>
                </div>
                <div
                  v-for="(item, index) in companyList"
                  :key="item.name + index + 999"
                  class="tbody"
                >
                  <span class="col-1">{{ item.name }}</span>
                  <span class="col-2">{{ item.area }}</span>
                  <span class="col-3">{{ item.type }}</span>
                </div>
              </app-scroller>
            </div>
          </template>
        </app-dialog>
      </div>
    </aside>
    <aside class="space-right all">
      <div class="top10">
        <app-dialog :header-key="header_4">
          <template v-slot:dialog-article>
            <div ref="pieChart" style="width: 320px; height: 180px"></div>
          </template>
        </app-dialog>
      </div>
      <div class="top10">
        <app-dialog :header-key="header_5">
          <template v-slot:dialog-article>
            <div ref="barChart" style="width: 320px; height: 180px"></div>
          </template>
        </app-dialog>
      </div>
      <div class="top10">
        <app-dialog :header-key="header_6">
          <template v-slot:dialog-article>
            <div ref="recordChart" style="width: 320px; height: 180px"></div>
          </template>
        </app-dialog>
      </div>
    </aside>
  </article>
</template>

<script>
import * as echarts from "echarts";
import AppDialog from "@/components/common/dialog/dialog";
import AppScroller from "@/components/common/scroller";
import { echartService, diva } from "@/services/global";

export default {
  data() {
    return {
      header_1: "investment-1", //从左到右，从上到下，即第一个组件框
      header_2: "investment-2",
      header_3: "investment-3",
      header_4: "investment-4",
      header_5: "investment-5",
      header_6: "investment-6",
      companyInfo: [],
      staticInfo: [],
      supportList: [],
      companyList: [],
      echartsData: {},
      defaultScene: '',
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
    this.axios.get("https://diva.sheencity.cn/samples/imip-vue2-embedded/data/investment/achivement.json").then((res) => {
      this.defaultScene = res.data.default_scene;
      this.echartsData = res.data.echarts_data;
      this.companyInfo = res.data.company_info;
      this.staticInfo = res.data.static_info;
      this.supportList = res.data.support_list;
      this.companyList = res.data.company_list;

      diva.client?.applyScene(this.defaultScene);
      this.initCharts();
    });
  },
  components: {
    AppDialog,
    AppScroller,
  },
};
</script>

<style lang="scss" scoped>
.module-1 {
  .ranking {
    display: flex;
    justify-content: space-between;
    .item {
      width: 148px;
      position: relative;
      p {
        text-align: center;
        font-size: 14px;
        line-height: 20px;
        margin-bottom: 35px;
      }
      span {
        position: absolute;
        width: 100%;
        font-size: 36px;
        font-family: 'Saira';
        font-weight: 700;
        line-height: 20px;
        letter-spacing: 1px;
        text-align: center;
        top: 40px;
      }
      img {
        margin: 0 auto;
        display: block;
      }
    }
  }
  .statics {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .item {
      width: 148px;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
      p:first-child {
        height: 16px;
        text-align: right;
        font-size: 12px;
        line-height: 16px;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 4px;
      }
      p:last-child {
        height: 20px;
        font-weight: bold;
        font-size: 20px;
        line-height: 20px;
        text-align: right;
        letter-spacing: 1px;
        color: #caff87;
        font-family: "Saira";
      }
    }
  }
}

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
