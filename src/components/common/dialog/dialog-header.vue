<template>
  <main>
    <article :style="{ justifyContent: icon ? 'unset' : 'center' }">
      <img v-if="icon" :src="imgURL" />
      <div>{{ title }}</div>
    </article>
    <footer>
      <img :src="lineURL" />
    </footer>
  </main>
</template>

<script>
export default {
  props: ['icon', 'title', 'width'],
  data() {
    return {
      imgURL: this.icon ? this.icon : '',
      lineURL: !this.width
        ? this.icon
          ? 'assets/images/theme/line-normal.png'
          : 'assets/images/theme/line-double.png'
        : 'assets/images/theme/line-short.png',
    };
  },
};
</script>

<style lang="scss" scoped>
article {
  height: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  color: #fff;
  div {
    height: 20px;
    line-height: 20px;
    margin-left: 6px;
    font-size: 16px;
    text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
  }
}
footer {
  img {
    width: 100%;
    display: block;
    margin-bottom: 8px;
  }
}
</style>
