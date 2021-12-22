<template>
  <div class="footer-container">
    <footer>
      <div class="route-button">
        <router-link :key="item.title" v-for="item in menuList" :to="item.link" class="route all" active-class="route-selected" >
          <img class="logo" :src="require('assets/images/footer/' + item.icon)" />
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
      menuList: [
        //  {
        //   link: "/introduction",
        //   icon: "1.svg",
        //   title: "项目介绍",
        //   children: [],
        // },
        // {
        //   link: "/carbon-neutral",
        //   icon: "2.svg",
        //   title: "碳中和",
        //   children: [{ link: "/carbon-neutral/energy", title: "能源" }],
        // },
        // {
        //   link: "/wisdom-operation",
        //   icon: "3.svg",
        //   title: "智慧运营",
        //   children: [
        //     { link: "/wisdom-operation/work", title: "办公" },
        //     { link: "/wisdom-operation/environment", title: "环境" },
        //     { link: "/wisdom-operation/fire-control", title: "消防" },
        //     { link: "/wisdom-operation/security", title: "安保" },
        //     { link: "/wisdom-operation/park", title: "停车" },
        //   ],
        // },
        // {
        //   link: "/attract-investment",
        //   icon: "4.svg",
        //   title: "产业招商",
        //   children: [
        //     { link: "/attract-investment/achievement", title: "招商成果" },
        //     { link: "/attract-investment/space", title: "空间布局" },
        //     { link: "/attract-investment/project", title: "产业规划" },
        //   ],
        // },
      ],
    };
  },
  async created(){
    const { data } = await this.axios.get('config/menu/index.json');
    this.menuList = data.menu.data;
  }
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
      background: url("assets/images/footer/button-bg.png") no-repeat;
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
      }
      .logo {
        width: 1.25rem;
        height: 1.25rem;
        display: block;
        margin-right: .25rem;
      }

      &:hover {
        &::before {
          background: url("assets/images/footer/button-hover.png");
          background-size: 100% 100%;
        }
      }
    }
    .route-selected {
      &::before {
        background: url("assets/images/footer/button-hover.png");
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
          background: url("assets/images/footer/button-hover-child.png") no-repeat;
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
      background: url("assets/images/footer/button-bg-child.png") no-repeat;
      background-size: 100% 100%;
      z-index: -1;
    }
    .child-route-selected {
      &::before {
        background: url("assets/images/footer/button-hover-child.png");
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
