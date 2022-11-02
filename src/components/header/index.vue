<template>
  <header class="all">
    <img class="sheentity-logo" src="assets/images/logo.svg">
    <div class="title">
      <p>智能制造产业园数字孪生平台</p>
    </div>
    <div class="tool">
      <router-link style="height: 20px;" to="/home">
        <img style="margin-right: 25px" src="assets/images/icon/home.svg" />
      </router-link>
      <img
        style="margin-right: 25px"
        src="assets/images/icon/help.svg"
        @click="showGuide = true"
      >
      <img
        style="margin-right: 10px"
        v-if="weatherUrl"
        :src="'assets/images/icon/weather-' + weatherUrl + '.svg'"
      >
      <span style="margin-right: 18px">{{ weatherInfo.temp }} ℃</span>
      <img style="margin-right: 8px" src="assets/images/icon/time.svg" />
      <span style="margin-right: 19px">{{ date }}</span>
      <img style="margin-right: 9px" src="assets/images/icon/date.svg" />
      <span>{{ time }}</span>
    </div>
    <app-guide
      v-if="showGuide"
      @close="closeDialog"
    ></app-guide>
  </header>
</template>

<script>
import { utilService } from 'services/global';
import AppGuide from 'components/guide';

export default {
  data() {
    return {
      date: '',
      time: '',
      weatherInfo: {},
      weatherUrl: '',
      showGuide: false,
      weatherTimer: null,
      timer: null,
    };
  },
  created() {
    this.init();
  },
  destroyed() {
    clearInterval(this.weatherTimer);
    clearInterval(this.timer);
  },
  methods: {
    init() {
      this.initWeatherInfo();
      // 每15分钟获取一次天气
      this.weatherTimer = setInterval(() => {
        this.initWeatherInfo();
      }, 1000 * 60 * 15);

      this.date = utilService.getDate();
      this.time = utilService.getCurrentTime();
      this.timer = setInterval(() => {
        this.time = utilService.getCurrentTime();
      }, 1000);
    },
    async initWeatherInfo() {
      this.weatherInfo = {
        weather: '晴',
        temp: 20,
      };
      if (this.weatherInfo.weather === '晴') {
        this.weatherUrl = 'sun';
        return;
      }
      if (this.weatherInfo.weather === '晴转多云') {
        this.weatherUrl = 'suncloud';
        return;
      }
      if (this.weatherInfo.weather === '多云') {
        this.weatherUrl = 'cloud';
        return;
      }
      if (this.weatherInfo.weather === '阴') {
        this.weatherUrl = 'overcast';
        return;
      }
      if (
        this.weatherInfo.weather.indexOf('霾') !== -1 ||
        this.weatherInfo.weather.indexOf('雾') !== -1
      ) {
        this.weatherUrl = 'fog';
        return;
      }
      if (this.weatherInfo.weather.indexOf('雨') !== -1) {
        this.weatherUrl = 'rain';
        return;
      }
      if (this.weatherInfo.weather.indexOf('雪') !== -1) {
        this.weatherUrl = 'snow';
        return;
      }
      if (
        this.weatherInfo.weather.indexOf('沙') !== -1 ||
        this.weatherInfo.weather.indexOf('尘') !== -1
      ) {
        this.weatherUrl = 'dust';
        return;
      }
      this.weatherUrl = 'cloud';
    },
    closeDialog(e) {
      this.showGuide = e;
    }
  },
  components: {
    AppGuide,
  },
};
</script>

<style lang="scss" scoped>
header {
  width: 100%;
  height: 5.13rem;
  margin-bottom: 1.88rem;
  display: flex;
  justify-content: center;
  background: url("/public/assets/images/theme/header.png") no-repeat bottom;
  background-size: contain;
  .sheentity-logo {
    position: absolute;
    left: 2.5rem;
    top: 1.25rem;
  }
  .title {
    margin-top: 1.88rem;
    p {
      font-size: 2rem;
      font-weight: 500;
      letter-spacing: 0.12em;
    }
  }
  .tool {
    position: absolute;
    right: 1.88rem;
    top: 1.75rem;
    display: flex;
    align-items: center;
    font-family: "Saira";
    img {
      width: 1.25rem;
      height: 1.25rem;
    }
    span {
      font-weight: 500;
      font-size: .88rem;
      line-height: 1.06rem;
    }
  }
}
</style>
