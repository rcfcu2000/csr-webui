<!-- 
    框架页面
 -->
<template>
  <div class="index">
    <Header />
    <Aside />
    <Content />
  </div>
</template>

<script>
import Aside from "./aside/index.vue";
import Header from "./header/index.vue";
import Content from "./content/index.vue";
export default {
  name: "layoutIndex",
  components: {
    Aside,
    Header,
    Content,
  },
  setup() {
    return {};
  },
};
</script>
<style lang='scss'>
.index {
  width: 100vw;
  height: 100vh;
  position: relative;
}
</style>