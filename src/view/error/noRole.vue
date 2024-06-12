<!--  -->
<template>
  <div class="noRole">
    <div class="iconBox">
      <img src="@/image/logo.png" class="icon" />
    </div>
    <div class="content">
      <img src="@/image/user.png" class="logo" />
      <div class="text1">您暂不属于任何角色</div>
      <div class="text2">请联系超级管理员为您分配角色后刷新页面</div>
      <a-button type="primary" class="btn" @click="menu">刷新页面</a-button>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    // 方法

    // 获取用户菜单列表
    const menu = () => {
      router.push({ name: "Login" });
    };
    return { menu };
  },
};
</script>
<style lang='scss' scoped>
.noRole {
  width: 100%;
  height: 100vh;
  background-color: var(--main-backgroundColor);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  .iconBox {
    width: 224px;
    height: 100px;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon {
      flex-shrink: 0;
      width: 146px;
      height: 40px;
    }
  }
  .content {
    width: 266px;
    height: 184px;
    .logo {
      width: 48px;
      height: 48px;
      margin-left: 50%;
      transform: translate(-50%);
    }
    .text1,
    .text2 {
      text-align: center;
      color: var(--main-fontColor3);
      font-size: 14px;
    }
    .text1 {
      font-weight: bold;
      font-size: 18px;
      color: var(--main-fontColor2);
      margin: 24px 0 8px 0;
    }
    .btn {
      margin-left: 50%;
      transform: translate(-50%);
      width: 140px;
      height: 36px;
      margin-top: 24px;
      background-color: var(--main-btnBackgroundColor);
      &:hover {
        background-color: var(--main-btnHoverColor1);
      }
      &:active {
        background-color: var(--main-btnPressedColor);
      }
    }
  }
}
</style>