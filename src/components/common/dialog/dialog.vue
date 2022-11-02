<template>
  <main class="bg">
    <header :key="title">
      <app-dialog-header
        :key="title"
        :title="title"
        :icon="icon"
      ></app-dialog-header>
    </header>
    <aside>
      <slot></slot>
    </aside>
  </main>
</template>

<script>
import AppDialogHeader from './dialog-header';

export default {
  props: ['header'],
  data() {
    return {
      title: this.header.title,
      icon: this.header.icon,
    };
  },
  mounted() {},

  components: {
    AppDialogHeader,
  },
};
</script>

<style lang="scss" scoped></style>
