<!--  -->
<template>
  <div class="index">
    <div class="title">当前位置</div>
    <a-breadcrumb class="breadcrumb">
      <a-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
        {{ item.meta.title }}
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  name: "headerIndex",
  setup() {
    const store = useStore();
    const breadcrumb = computed(() => store.state.selMenu);
    return {
      breadcrumb,
    };
  },
};
</script>
<style lang='scss' scoped>
.index {
  width: calc(100% - 200px);
  height: 90px;
  position: absolute;
  right: 0;
  top: 0;
  background-color: var(--main-backgroundColor) !important;
  > .title {
    padding: 24px 0 8px 0;
    font-size: 14px;
    color: #9da8b2;
  }
  .breadcrumb {
    font-size: 20px;
    color: var(--main-fontColor2);
    ::v-deep .arco-breadcrumb-item:last-child {
      font-weight: bold !important;
    }
    ::v-deep .arco-breadcrumb-item {
      padding: 0 !important;
    }
  }
}
</style>