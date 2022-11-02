<template>
  <div class="container all">
    <main class="bg">
      <header>
        <h3 class=".text-center">操作指南</h3>
        <img
          src="assets/images/theme/line-double.png"
          style="display: block"
        />
      </header>
      <article>
        <div>
          <ul>
            <li class="space-between" v-for="item in mouseMetadata" :key="item.key">
              <p>{{ item.key }}</p>
              <p>{{ item.val }}</p>
            </li>
          </ul>
        </div>
        <div>
          <ul>
            <li class="space-between" v-for="item in keyboardMetadata" :key="item.key">
              <p>{{ item.key }}</p>
              <p>{{ item.val }}</p>
            </li>
          </ul>
        </div>
        <div>
          <ul>
            <li class="space-between all" style="margin-top: 18px">
              <p>天气</p>
              <div>
                <drop-down
                  :options="weatherList"
                  :value="weatherInitial"
                  :disabled="false"
                  @select="setSelectedWeather"
                ></drop-down>
              </div>
            </li>
            <li class="space-between all" style="margin-top: 18px">
              <p>罗盘</p>
              <app-switcher
                class="custom-switch"
                v-model="compass"
                @switch="swit"
              ></app-switcher>
            </li>
          </ul>
        </div>
      </article>
      <footer>
        <button @click="closeDialog()">关闭</button>
      </footer>
    </main>
  </div>
</template>

<script>
import DropDown from 'components/common/dropdown/dropdown';
import AppSwitcher from 'components/common/switcher';
import { dataService, diva } from 'services/global.js';

export default {
  data() {
    return {
      mouseMetadata: [
        { key: '单击鼠标左键', val: '触发事件' },
        { key: '按住右键拖动', val: '绕镜头位置旋转' },
        { key: '按住中键拖动', val: '绕屏幕中心旋转' },
        { key: 'Shift + 中键拖动', val: '平移画面' },
        { key: '中键滚轮', val: '调节镜头远近' },
      ],
      keyboardMetadata: [
        { key: 'W,S,A,D', val: '前，后，左，右' },
        { key: 'Q,E', val: '垂直升降' },
      ],
      weatherList: [
        { value: 'sunny', placeholder: '晴天' },
        { value: 'overcast', placeholder: '阴天' },
        { value: 'rain', placeholder: '雨天' },
        { value: 'smog', placeholder: '雾天' },
        { value: 'snow', placeholder: '雪天' },
      ],
      weatherInitial: {
        value: 'sunny', placeholder: '晴天',
      },
      compass: false,
    };
  },
  created() {
    this.weatherInitial = dataService.selectedWeather;
    this.compass = dataService.compass;
  },
  methods: {
    setSelectedWeather(item) {
      dataService.selectedWeather = item;
      diva.client.request('SetWeather', {
        name: item.value,
      });
    },
    swit(v) {
      dataService.compass = v;
      diva.client.setCompass(v);
    },
    closeDialog() {
      this.$emit('close', false);
    },
  },
  components: {
    DropDown,
    AppSwitcher,
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-180px, -227px);
}
main {
  box-sizing: border-box;
  width: 360px;
  padding: 20px;
  color: #fff;
  header {
    h3 {
      font-size: 16px;
      height: 20px;
      line-height: 20px;
      text-align: center;
    }
  }
  article {
    div {
      ul {
        border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
        li {
          height: 16px;
          margin: 12px 0px;
          font-size: 12px;
        }
      }
    }
  }
  .custom-switch {
    width: 36px;
    padding: 0;
  }
  footer {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    button {
      width: 90px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      border: 1px solid rgba(5, 205, 157, 0.3);
      box-sizing: border-box;
      backdrop-filter: blur(20px);
      border-radius: 4px;
      outline: none;
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
  }
}
</style>
