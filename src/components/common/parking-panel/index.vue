<template>
  <app-dialog :header="header">
    <main>
      <div class="preview">
        <div ref="parkPieChart" class="chart"></div>
        <div class="cars-info">剩余车位分析</div>
        <div class="truck-space">
          <div class="item">
            <p class="digital">{{ parkGeneralData.total - totalCars }}</p>
            <p>剩余车位数</p>
          </div>
          <div class="item">
            <p class="digital">{{ parkGeneralData.total }}</p>
            <p>车位总数</p>
          </div>
        </div>
        <hr class="hr" style="margin: 5px 0px 10px 0px" />
        <div class="charge">
          <div class="item">
            <p class="digital">
              {{ parkGeneralData.power_rest
              }}<span>/{{ parkGeneralData.power_total }}</span>
            </p>
            <p>
              <img src="assets/images/icon/charge-park.svg" />
              充电桩停车位
            </p>
          </div>
          <div class="line"></div>
          <div class="item">
            <p class="digital">
              {{ parkGeneralData.common_rest
              }}<span>/{{ parkGeneralData.common_total }}</span>
            </p>
            <p>
              <img src="assets/images/icon/common-park.svg" />
              普通停车位
            </p>
          </div>
        </div>
      </div>
      <hr class="hr" />
      <div class="switch">
        <p>车位使用透视</p>
        <app-switcher v-model="check" @switch="onChange"></app-switcher>
      </div>
      <hr class="hr" style="margin-bottom: 10px" />
      <!-- 停车区 -->
      <div class="parking-area">
        <div
          class="area-container"
          v-for="(item, index) in parkAreaData"
          :key="item.title"
          @click="focusParksArea(item, index)"
          :class="{ active: selectedIndex === index }"
        >
          <div class="free-parks">
            <p>{{ item.title }}</p>
            <p class="num">
              {{ item.rest }}<span>/{{ item.total }}</span>
            </p>
          </div>
          <div class="info">占用车位/总数</div>
        </div>
      </div>
    </main>
  </app-dialog>
</template>

<script>
import * as echarts from 'echarts';
import AppDialog from '../dialog/dialog';
import AppSwitcher from '../switcher';
import { echartService } from 'services/global';

export default {
  props: ['header', 'dataSource', 'checked'],
  data() {
    return {
      totalCars: 0,
      parkGeneralData: this.dataSource.general,
      parkAreaData: this.dataSource.data,
      selectedIndex: -1,
      check: this.checked,
    };
  },
  mounted() {
    this.totalCars = this.parkAreaData
      .map((item) => item.rest)
      .reduce((prev, next) => prev + next, 0);
    this.initChart();
  },
  methods: {
    onChange(v) {
      this.selectedIndex = -1;
      this.$emit('switch', v);
    },
    focusParksArea(item, index) {
      this.selectedIndex = index;
      this.$emit('areaClick', item);
    },
    initChart() {
      const parkData = this.parkAreaData.map((item) => {
        return { value: item.rest, name: item.title };
      });
      const parkPieChart = echarts.init(this.$refs.parkPieChart);
      const parkPieOption = echartService.getParkingPanelPieChart(parkData);
      parkPieChart.setOption(parkPieOption);
    },
  },
  components: {
    AppDialog,
    AppSwitcher,
  },
};
</script>

<style lang="scss" scoped>
.preview {
  position: relative;
  .cars-info {
    position: absolute;
    bottom: -8px;
    width: 140px;
    text-align: center;
  }
  .num {
    position: absolute;
    left: 72px;
    top: 96px;
    font-weight: 500;
    font-size: 22px;
    line-height: 35px;
    font-family: "Saira";
  }
  .chart {
    float: left;
    margin-right: 8px;
    width: 140px;
    height: 140px;
  }
  .truck-space {
    display: flex;
    justify-content: flex-end;
    padding-top: 15px;
    p {
      letter-spacing: 0;
    }
    .item {
      width: 50%;
      p {
        text-align: right;
        font-size: 10px;
        line-height: 14px;
      }
      .digital {
        font-family: "Digital Numbers";
        font-size: 20px;
        line-height: 26px;
        color: #00f7ff;
        margin-bottom: 6px;
      }
    }
  }
  .charge {
    height: 55px;
    @extend .truck-space;
    padding-top: 0px;
    .digital {
      font-size: 16px !important;
      line-height: 21px !important;
      color: #ffffff !important;
      text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
      margin-bottom: 0px;
      span {
        font-size: 10px;
      }
      img {
        vertical-align: bottom;
      }
    }
    .line {
      position: relative;
      left: 10px;
      width: 0px;
      height: 100%;
      border-right: 1px solid rgba(235, 235, 235, 0.2);
    }
  }
  &::after {
    content: "";
    display: block;
    clear: both;
  }
  margin-bottom: 18px;
}
.hr {
  border: 0px;
  border-bottom: 1px solid rgba(235, 235, 235, 0.2);
  margin: 0;
}
.switch {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.parking-area {
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  .area-container {
    width: 100%;
    height: 68px;
    margin-bottom: 6px;
    padding: 8px;
    border: 1px solid rgba(235, 235, 235, 0.2);
    div {
      pointer-events: none;
    }
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    &:last-child {
      margin: 0;
    }
    &.active {
      border-color: #00f7ff;
      background: rgba(255, 255, 255, 0.1);
    }
    p {
      text-align: left;
      padding-bottom: 4px;
    }
    .free-parks {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 1px dashed rgba(4, 205, 152, 0.6);
      .num {
        font-size: 20px;
        line-height: 20px;
        font-family: "Saira";
        color: #00f7ff;
        font-weight: 500;
        span {
          font-size: 14px;
        }
      }
    }
    .info {
      font-size: 12px;
      width: 100%;
      text-align: right;
      margin-top: 8px;
    }
  }
}
</style>
