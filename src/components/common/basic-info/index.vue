<template>
  <app-dialog :header="header">
    <div class="main">
      <div v-if="contentData.image" class="image">
        <img
          style="width: 100%;height: 100%;"
          v-if="contentData.image.url"
          :src="require('../../../assets/' + contentData.image.url)"
        />
      </div>
      <p v-if="contentData.text.length === 1">
        {{ contentData.text[0] }}
      </p>
      <template v-else>
        <ul v-for="item in contentData.text" :key="item" class="list">
          <li>{{ item }}</li>
        </ul>
      </template>
    </div>
  </app-dialog>
</template>

<script>
import AppDialog from '../dialog/dialog';

export default {
  props: ['contentData','header'],
  components: {
    AppDialog
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
