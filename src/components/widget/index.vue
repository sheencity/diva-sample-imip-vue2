<template>
  <main ref="device" class="device-bg">
    <header>
      <app-dialog-header
        :key="title"
        :title="title"
        :icon="icon"
        class="header"
      ></app-dialog-header>
    </header>
    <!-- 环境监测设备弹窗内容 -->
    <article class="env" v-if="this.type === 'environment'">
      <div class="env-header">
        <span>设备编号</span>
        <span>{{ envData.num }}</span>
      </div>
      <div v-if="envData.updateTime" class="env-header">
        <span>更新时间</span>
        <span>{{ envData.updateTime }}</span>
      </div>
      <table class="env-table">
        <thead class="thead">
          <tr>
            <td>监测项</td>
            <td width="100px">数值</td>
            <td width="100px">单位</td>
            <td>状态</td>
          </tr>
        </thead>
        <tbody class="tbody">
          <tr :key="item.name" v-for="item in envData.data">
            <td>{{ item.name }}</td>
            <td style="color: #00E400;">{{ item.value }}</td>
            <td>{{ item.unit }}</td>
            <td>{{ item.state }}</td>
          </tr>
        </tbody>
      </table>
    </article>
    <!-- 摄像头弹窗内容 -->
    <article class="mon" v-else-if="this.type === 'monitoring' && monData.id">
      <div class="video">
        <video width="100%" :src="monData.videoPath" autoplay="autoplay" muted="muted"></video>
      </div>
      <p class="introduce">
        <span>监控类型：</span>
        <span>{{ monData.category }}</span>
      </p>
      <p class="introduce">
        <span>监控运行：</span>
        <span>{{ monData.status }}</span>
      </p>
    </article>
  </main>
</template>

<script>
import AppDialogHeader from '../common/dialog/dialog-header';

export default {
  data() {
    return {
      title: '',
      icon: '',
      // 弹框类型 environment/monitoring
      type: '',
      // 监测数据
      envData: {
        num: '',
        updateTime: '',
        data: [
          { type:'CH2O', name: '甲醛', value: '', unit: 'mg/m³', state: '', fontColor: ''},
          { type:'CO2', name: '二氧化碳', value: '', unit: 'PPM', state: '', fontColor: ''},
          { type:'HUMI', name: '湿度', value: '', unit: '%', state: '', fontColor: ''},
          { type:'PM25', name: 'PM2.5', value: '', unit: 'μg/m3', state: '', fontColor: ''},
          { type:'TEMP', name: '温度', value: '', unit: '℃', state: '', fontColor: ''},
          { type:'VOC', name: 'VOC', value: '', unit: 'mg/m³', state: '', fontColor: ''},
        ],
      },
      // 监控数据
      monData: null,
    };
  },
  methods: {
    // 获取环境设备数据
    async getEnvData() {
      const { data } = await this.axios.get('config/page/environment.json');
      const deviceList = data['panel-left'][0].content.data;
      const deviceData = deviceList
        .filter((ele) => ele.id === this.$route.params.id)[0]
        .data;
      
      this.envData.num = deviceData.DeviceID;
      this.envData.updateTime = deviceData?.CreateTime;
      this.envData.data.forEach((ele) => {
        ele.value = deviceData[ele.type];
        switch (ele.type) {
          case 'CH2O': {
            ele.state =
              ele.value > 2.001 ? '重度污染' :
              ele.value > 0.301 ? '轻度污染' :
              ele.value > 0.101 ? '轻微污染' :
              '优';
            ele.fontColor =
              ele.value > 2.001 ? '#99004c' :
              ele.value > 0.301 ? '#ff7e00' :
              ele.value > 0.101 ? '#ffff00' :
              '#00e400';
            break;
          };
          case 'CO2': {
            ele.state =
              ele.value > 1500.001 ? '重度污染' :
              ele.value > 1000.001 ? '轻度污染' :
              '清新';
            ele.fontColor =
              ele.value > 1500.001 ? '#99004c' :
              ele.value > 1000.001 ? '#ff7e00' :
              '#00e400';
            break;
          }
          case 'HUMI': {
            ele.state =
              ele.value  > 75.001 ? '潮湿' :
              ele.value  > 30.001 ? '舒适' :
              '干燥';
            ele.fontColor =
              ele.value  > 75.001 ? '#ffff00' :
              ele.value  > 30.001 ? '#00e400' :
              '#ffff00';
            break;
          }
          case 'PM25': {
            ele.state =
              ele.value > 250.001 ? '严重污染' :
              ele.value > 150.001 ? '重度污染' :
              ele.value > 115.001 ? '中度污染' :
              ele.value > 75.001 ? '轻度污染' :
              ele.value > 35.001 ? '良' :
              '优';
            ele.fontColor =
              ele.value > 250.001 ? '#7e0023' :
              ele.value > 150.001 ? '#99004c' :
              ele.value > 115.001 ? '#ff0000' :
              ele.value > 75.001 ? '#ff7e00' :
              ele.value > 35.001 ? '#ffff00' :
              '优';
            break;
          }
          case 'TEMP': {
            ele.state =
              ele.value > 32.001 ? '炎热' :
              ele.value > 25.001 ? '偏热' :
              ele.value > 15.001 ? '舒适' :
              ele.value > 8.001 ? '偏冷' :
              '寒冷';
            ele.fontColor =
              ele.value > 32.001 ? '#ff0000' :
              ele.value > 25.001 ? '#00e400' :
              ele.value > 15.001 ? '#00e400' :
              ele.value > 8.001 ? '#00e400' :
              '#00f7ff';
            break;
          }
          case 'VOC': {
            ele.state =
              ele.value > 1.601 ? '重度污染' :
              ele.value > 1.201 ? '轻度污染' :
              ele.value > 0.601 ? '轻微污染' :
              '优';
            ele.fontColor =
              ele.value > 1.601 ? '#99004c' :
              ele.value > 1.201 ? '#ff7e00' :
              ele.value > 0.601 ? '#ffff00' :
              '优';
            break;
          }
        }
      });
    },
    // 获取监控数据
    async getMonData() {
      const { data } = await this.axios.get('config/page/security.json');
      const monitorList = data['panel-left'][1].content.data;
      this.monData = monitorList
        .filter((mon) => mon.id === this.$route.params.id)[0];
      this.title = this.monData.id + '号摄像头';
    },
  },
  mounted() {
    // 将用于显示 diva 的dom删除
    const divaDom = this.$refs.device.previousSibling;
    divaDom.parentNode.removeChild(divaDom);
    const url = this.$route.path;
    const pathList =  url.split('/');
    const len = pathList.length;
    this.type = this.$route.params.id ? pathList[len - 3] : pathList[len - 2];
    switch (this.type) {
      case 'environment':{     //  【环境】设备弹框
        this.title = '监测数据';
        this.getEnvData();
        break;
      }
      case 'monitoring':{    //    【监控】设备弹框
        this.getMonData();
        this.icon = 'assets/images/icon/monitor.svg';
        break;
      }
    };
  },
  components: {
    AppDialogHeader,
  },
};
</script>

<style lang="scss" scoped>
.device-bg {
  width: 100%;
  height: 100vh;
  background: rgba(4, 14, 29, 0.6);
  border-radius: 2px;
  padding: 20px;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
  .introduce {
    font-size: 14px;
    line-height: 20px;
    color: #EBEBEB;
  }
  .env {
    .env-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 13px;
      font-weight: 500;
      font-size: 14px;
      line-height: 19px;
    
    }
    .env-table {
      width: 100%;
      border-collapse: collapse;
      tr {
        height: 40px;
        text-align: center;
        border: 1px dashed rgba(255, 255, 255, 0.3);
        border-width: 1px 0px;
      }
      .thead {
        font-weight: 500;
        font-size: 14px;
        line-height: 19px;
      }
      .tbody {
        font-size: 12px;
        line-height: 15px;
      }
    }
  }
  
  .mon {
    .video {
      width: 100%;
      margin-bottom: 10px;
      video {
        object-fit: fill;
      }
    }
  }
}
</style>
