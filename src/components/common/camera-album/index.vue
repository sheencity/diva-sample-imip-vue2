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
          class='pic-container'
          v-for='(camera, index) in item.content'
          :key='camera.text'
          :ref="index"
        >
          <img :src="require('../../../assets/route4-2/' + item.header.icon)" />
          <span>{{ camera.text }}</span>
        </div>
      </aside>
    </div>
  </main>
</template>

<script>
import AppDialogHeader from "./dialog-header";

export default {
  props: ["dataSource"],
  data() {
    return {

    };
  },
  created() {
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
}
</style>
