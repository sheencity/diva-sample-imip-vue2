<template>
  <div class="footer-container">
    <footer>
      <div class="route-button">
        <router-link 
          :to="item.link"
          class="route all"
          :class="{'route-selected': currentIndex === index}"
          :key="item.title" 
          v-for="(item, index) in menuList"  
          @click.native="selectRoute(index)"
        >
          <img class="logo" :src="item.icon" />
          <p>{{ item.title }}</p>
          <div class="child-route-button">
            <router-link
              :key="childRoute.title"
              v-for="childRoute in item.children"
              :to="childRoute.link"
              active-class="child-route-selected"
              class="child-route"
            >
              <p>{{ childRoute.title }}</p>
            </router-link>
          </div>
        </router-link>
      </div>
    </footer>
    <div class="tips">* 嵌入页面模式下键入 Ctrl + Shift + Q 可退回至编辑模式。展示数据经过脱敏，仅用于演示。</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      currentIndex: 0,
      filterMap: new Map([
        ['introduction','/introduction'],
        ['energy','/carbon-neutral/energy'],
        ['office','/wisdom-operation/office'],
        ['environment','/wisdom-operation/environment'],
        ['fire-control','/wisdom-operation/fire-control'],
        ['security','/wisdom-operation/security'],
        ['parking','/wisdom-operation/parking'],
        ['achievement','/attract-investment/achievement'],
        ['space','/attract-investment/space'],
        ['planing','/attract-investment/planing'],
      ]),
    };
  },
  async created() {
    await this.initMenu();
  },
  methods: {
    async initMenu() {
      const { data } = await this.axios.get('config/menu/index.json');
      const menuList = data.menu.data;
      this.filterRoute(menuList);
      this.menuList = menuList;
    },
    selectRoute(index) {
      this.currentIndex = index;
    },
    filterRoute(list) {
      list.forEach((item) => {
        const route = this.filterMap.get(item.view);
        item.link = route || '/not-found';

        if (item.children?.length > 0) return this.filterRoute(item.children);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
footer {
  position: fixed;
  left: 50%;
  transform: translate(-50%);
  height: 6.75rem;
  bottom: 0;
  display: flex;
  justify-content: center;

  .route-button {
    display: flex;
    justify-content: center;
    padding-bottom: 3.75rem;

    // 为了防止初次加载闪烁白色，创建伪元素代替
    .route::before {
      position: absolute;
      content: "";
      width: 11.25rem;
      height: 3rem;
      background: url("/public/assets/images/theme/button-bg.png") no-repeat;
      background-size: 100% 100%;
      z-index: -1;
    }

    .route {
      position: relative;
      width: 10.13rem;
      height: 3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-size: 100% 100%;
      color: #fff;
      text-decoration: none;
      p {
        font-weight: 500;
        font-size: 1rem;
        pointer-events: none;
      }
      .logo {
        width: 1.25rem;
        height: 1.25rem;
        display: block;
        margin-right: .25rem;
        pointer-events: none;
      }
      &:hover {
        &::before {
          background: url("/public/assets/images/theme/button-hover.png");
          background-size: 100% 100%;
        }
      }
    }
    .route-selected {
      &::before {
        background: url("/public/assets/images/theme/button-hover.png");
        background-size: 100% 100%;
      }

      .child-route-button {
        display: flex;
      }
    }
  }

  // 二级路由列表
  .child-route-button {
    position: absolute;
    bottom: 3.63rem;
    display: flex;
    justify-content: center;
    display: none;
    // 子路由样式
    .child-route {
      width: 6.75rem;
      height: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-size: 100% 100%;
      color: #fff;
      text-decoration: none;
      p {
        font-size: .88rem;
        line-height: 1.19rem;
      }
      &:hover {
        &::before {
          background: url("/public/assets/images/theme/button-hover-child.png") no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    // 为了防止初次加载闪烁白色，创建伪元素代替
    .child-route::before {
      position: absolute;
      content: "";
      width: 7.5rem;
      height: 2rem;
      background: url("/public/assets/images/theme/button-bg-child.png") no-repeat;
      background-size: 100% 100%;
      z-index: -1;
    }
    .child-route-selected {
      &::before {
        background: url("/public/assets/images/theme/button-hover-child.png");
        background-size: 100% 100%;
      }
    }
  }
}
.tips {
  position: absolute;
  color: #ffffff;
  font-size: 13px;
  opacity: 0.8;
  height: 20px;
  line-height: 20px;
  bottom: 2.8%;
}
</style>
