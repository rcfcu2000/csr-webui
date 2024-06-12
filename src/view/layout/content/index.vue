<!--  -->
<template>
  <div class="index">
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "contentIndex",
  setup() {
    return {};
  },
};
</script>
<style lang='scss' scoped>
.index {
  width: calc(100% - 200px);
  height: calc(100vh - 90px);
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: var(--main-backgroundColor);
  .content {
    width: calc(100% - 24px);
    height: calc(100% - 24px);
    border-radius: var(--main-borderRadio);
    border: 1px solid var(--main-borderColor);
  }
}
</style>