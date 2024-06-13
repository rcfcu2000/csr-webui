<!--  -->
<template>
  <div class="index">
    <div class="title">
      <img src="../../../image/logo.png" class="logo" />
    </div>
    <div class="menu">
      <a-menu :default-selected-keys="[defaultSelectedKeys]" :auto-open="true">
        <a-sub-menu v-for="item in menuArr" :key="item.ID">
          <template #title>{{ item.meta.title }}</template>
          <template #icon
            ><div :class="item.meta.icon + ' icon'"></div
          ></template>
          <a-menu-item
            v-for="item1 in item.children"
            :key="item1.ID"
            @click="toPage(item1)"
          >
            {{ item1.meta.title }}
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </div>
    <div class="loginInfo">
      <div class="title">当前登录</div>
      <div class="name">{{ name }}</div>
      <div class="businessName">{{ businessName }}</div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import "../../../utils/iconfont/index.css";
export default {
  name: "asideIndex",
  setup() {
    const store = useStore();
    const name = sessionStorage.getItem("userInfo")
      ? JSON.parse(sessionStorage.getItem("userInfo")).nickName
      : "橘子味的狸花猫";
    const businessName = sessionStorage.getItem("userInfo")
      ? JSON.parse(sessionStorage.getItem("userInfo")).nickName.split(":")[0]
      : "蜡笔派家居旗舰店";
    // 菜单栏
    const menuArr = computed(() => store.state.menu);
    const defaultSelectedKeys = computed(() => store.state.selMenu.son.ID);
    const router = useRouter();

    const toPage = (item) => {
      router.push({ name: item.path });
      defaultSelectedKeys.value = item.ID;
      findNodeAndParentName(item.parentId, item);
    };
    // 找到该级的title以及父级的title，目前只适用于两层
    const findNodeAndParentName = (targetId, item) => {
      menuArr.value.forEach((item1) => {
        if (item1.ID == targetId) {
          let list = {
            parent: item1,
            son: item,
          };
          store.commit("changeMenu", list);
          sessionStorage.setItem("selMenu", JSON.stringify(list));
        }
      });
    };
    return {
      name,
      businessName,
      defaultSelectedKeys,
      menuArr,
      toPage,
      findNodeAndParentName,
    };
  },
};
</script>
<style lang='scss' scoped>
.index {
  position: absolute;
  width: 200px;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: var(--main-backgroundColor) !important;

  > .title {
    width: 100%;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    .logo {
      flex-shrink: 0;
      width: 146px;
      height: 40px;
    }
  }
  .menu {
    width: 100%;
    height: calc(100vh - 200px);
    ::v-deep .arco-menu-selected {
      color: var(--main-btnBackgroundColor) !important;
      background-color: #e7f0ff !important;
    }
    ::v-deep .arco-menu-inline-header.arco-menu-selected {
      color: #000 !important;
      font-weight: bold !important;
      background-color: transparent !important;
    }
    ::v-deep .arco-menu-light {
      background-color: transparent;
    }
    ::v-deep .arco-menu-item {
      background-color: transparent;
    }
    ::v-deep .arco-menu-item:hover {
      background-color: #e7f0ff !important;
    }
    ::v-deep .arco-menu-inline-header {
      background-color: transparent;
    }
    ::v-deep .arco-icon {
      color: var(--main-fontColor2);
    }
    ::v-deep .arco-menu-icon-suffix.is-open {
      margin-top: 5px;
    }
    ::v-deep .arco-menu-icon-suffix {
      margin-top: -5px;
    }
    ::v-deep .arco-menu-vertical .arco-menu-inner {
      padding: 0 24px !important;
    }
  }
  .loginInfo {
    padding-left: 20px;
    font-size: 14px;
    position: absolute;
    width: 100%;
    bottom: 24px;

    .title {
      color: var(--main-fontColor3);
      position: relative;
      &::before {
        content: "";
        display: block;
        width: calc(100% - 24px);
        height: 1px;
        background-color: #000;
        opacity: 0.05;
        position: absolute;
        top: -24px;
      }
    }
    .name {
      font-weight: bold;
      color: var(--main-fontColor2);
      margin-top: 8px;
      margin-bottom: 4px;
    }
    .businessName {
      color: var(--main-fontColor2);
    }
  }
}
</style>