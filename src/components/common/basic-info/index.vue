<template>
  <div class="main">
    <div v-if="data.image" class="image">
      <img v-if="data.image.url" style="width: 100%;height: 100%;" :src="require('../../../assets/' + data.image.url)" />
    </div>
    <p v-if="data.text.length === 1">
      {{ data.text[0] }}
    </p>
    <ul v-if="data.text.length !== 1" v-for="item in data.text" :key="item" class="list">
      <li>{{ item }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['data'],
  created(){
    console.log(this.data)
  }
}
</script>

<style lang="scss" scoped>
  .main{
    .image {
      width: 100%;
      margin-bottom: .63rem;
    }
    p {
      font-size: .88rem;
      letter-spacing: .06rem;
      color: #ebebeb;
    }
    .list{
      color: #ebebeb;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 1px;
      padding-left: 20px;
      li {
        list-style: unset;
      }
    }
  }
</style>>
