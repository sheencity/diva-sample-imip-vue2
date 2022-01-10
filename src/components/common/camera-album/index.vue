<template>
  <main class="bg">
    <div v-for="item in dataSource" :key="item.header.title">
      <header>
        <app-dialog-header
          :title="item.header.title"
          :icon="item.header.icon"
          width="160"
        ></app-dialog-header>
      </header>
      <aside>
        <div
          class="pic-container"
          v-for="camera in item.content.data"
          :key="camera.text"
          @click="onChange(camera)"
        >
          <img :src="camera.image" />
          <span>{{ camera.text }}</span>
        </div>
      </aside>
    </div>
  </main>
</template>

<script>
import AppDialogHeader from '../dialog/dialog-header';

export default {
  props: ['dataSource'],
  methods: {
    onChange(e) {
      this.$emit('check', e);
    },
  },
  components: {
    AppDialogHeader,
  },
};
</script>

<style lang="scss" scoped>
.bg {
  width: 200px;
  background: rgba(4, 14, 29, 0.6);
  border-radius: 2px;
  padding: 16px 20px 20px 20px;

  .pic-container {
    position: relative;
    width: 160px;
    height: 90px;
    margin-bottom: 12px;
    img {
      width: 100%;
      height: 100%;
      display: block;
      pointer-events: none;
    }
    span {
      position: absolute;
      bottom: 4px;
      width: 100%;
      text-align: center;
      z-index: 2;
      text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
      pointer-events: none;
    }
  }
}
</style>
