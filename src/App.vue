<template>
  <div>
    <router-view />
  </div>
</template>

<script>

export default {
  name: "App",
  setup() {
    document.title = "会回AI客服助手丨训练语料库";
  },
};
</script>

<style lang='scss' >
@import "./utils/main.css";
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
