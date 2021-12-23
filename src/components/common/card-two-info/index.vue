<template>
  <main class="area-bg">
    <div style="pointer-events: none;">
      <header>
        <p>{{ contentData.title }}</p>
        <div></div>
      </header>
      <aside>
        <div class="area-content">
          <div class="content">
            <img :src="require('../../../assets/' + contentData.icon)" />
          </div>
          <div class="content">
            <p>{{ contentData.info_left.title }}</p>
            <div>
              <span>
                {{ contentData.info_left.value }}
              </span>
              {{ contentData.info_left.unit }}
            </div>
          </div>
          <div v-if="contentData.info_right" class="content">
            <p>{{ contentData.info_right.title }}</p>
            <div>
              <span>
                {{ contentData.info_right.value }}
              </span>
              {{ contentData.info_right.unit }}
            </div>
          </div>
        </div>
      </aside>
    </div>
  </main>
</template>

<script>
// 项目介绍模块的生产区和生活区组件

export default {
  props: ["contentData",],
};
</script>

<style lang="scss" scoped>
.area-bg {
  width: 100%;
  border: 1px solid rgba(235, 235, 235, 0.2);
  padding: .75rem;
  margin-bottom: .5rem;
  header {
    p {
      font-weight: 500;
      font-size: .88rem;
      line-height: 1.19rem;
      text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
    }
    div {
      width: 7.88rem;
      height: 0px;
      margin: 4px 0px 3px 0px;
      border-bottom: 1px dashed rgba(4, 205, 152, 0.6);
    }
  }
  .area-content {
    display: flex;
    .content {
      flex: 1 1 0;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      img {
        flex-basis: 0;
      }
      p {
        font-size: .75rem;
        line-height: 1.25rem;
        color: #ebebeb;
      }
      span {
        font-family: Saira;
        font-weight: 500;
        font-size: 1rem;
        line-height: 1.25rem;
        color: #00f7ff;
        letter-spacing: 1px;
      }

      &:first-of-type {
        align-items: flex-start !important;
        justify-content: flex-end;
      }
    }
  }
}
</style>
