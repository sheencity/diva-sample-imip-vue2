<template>
  <app-dialog :header="header">
    <div class="statistic-panel">
      <div v-if="rankingData" class="ranking">
        <div v-for="item in rankingData" :key="item.title" class="item">
          <p>{{ item.title }}</p>
          <span :style="{ color: item.fontColor }">{{ item.number }}</span>
          <img src="assets/images/theme/effect-disk.png" />
        </div>
      </div>
      <div v-if="statisticData" class="statistic">
        <div :key="item.icon" v-for="item in statisticData" class="item">
          <img :src="item.icon" />
          <div>
            <p>{{ item.title }}</p>
            <p :style="{ color: item.fontColor || '' }">
              {{ item.number }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </app-dialog>
</template>

<script>
import AppDialog from '../dialog/dialog';

export default {
  props: ['dataSource'],
  data() {
    return {
      header: this.dataSource.header,
      rankingData: null,
      statisticData: null,
    };
  },
  created() {
    this.rankingData = this.dataSource.content.data.filter((v) => !v.icon);
    this.statisticData = this.dataSource.content.data.filter((v) => !!v.icon);
  },
  components: {
    AppDialog,
  },
};
</script>
<style lang="scss" scoped>
.statistic-panel {
  .ranking {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .item {
      width: 148px;
      position: relative;
      margin-bottom: 12px;
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
        font-family: "Saira";
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
  .statistic {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: -12px;
    .item {
      width: 148px;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    p:first-of-type {
      height: 16px;
      text-align: right;
      font-size: 12px;
      line-height: 16px;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 4px;
    }
    p:last-of-type {
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
</style>
