<!-- 
    登录界面
 -->
<template>
  <vue-particles
    class="login-bg"
    color="#39AFFD"
    :particleOpacity="0.15"
    :particlesNumber="100"
    shapeType="circle"
    :particleSize="4"
    linesColor="#8DD1FE"
    :linesWidth="1"
    :lineLinked="true"
    :lineOpacity="0.4"
    :linesDistance="150"
    :moveSpeed="3"
    :hoverEffect="true"
    hoverMode="grab"
    :clickEffect="true"
    clickMode="push"
  >
  </vue-particles>
  <div class="index">
    <div class="option">
      <img src="../../image/logo.png" class="logo" />
      <div class="form">
        <a-input
          v-model="form.name"
          placeholder="请输入用户名"
          allow-clear
          class="input"
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
        <a-input-password
          v-model="form.password"
          placeholder="请输入密码"
          allow-clear
          class="input"
          :defaultVisibility="true"
          @press-enter="handleSubmit"
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
        <a-button type="primary" @click="handleSubmit" class="btn">
          立即登录
        </a-button>
        <a-checkbox
          v-model="isPassword"
          class="checkbox"
          @change="changeIsPassWord"
          >记住密码</a-checkbox
        >
      </div>
    </div>
    <div class="tips">由 <strong>智绘阁</strong> 提供AI大模型计算服务</div>
  </div>
  <a-modal
    v-model:visible="changeShopInfoModal"
    :width="410"
    :mask-closable="false"
    :hide-title="true"
    class="changeShopInfoModal"
  >
    <div class="content">
      <div class="title">欢迎您！</div>
      <div class="subTitle">
        请填写您的店铺信息，之后可在“系统管理-店铺信息”中修改
      </div>
      <div class="item">
        <div class="lable">
          <div class="icon">*</div>
          <div class="text">店铺名称</div>
        </div>
        <a-input
          placeholder="请输入店铺名称"
          disabled
          v-model="shopInfoForm.name"
          class="input"
        />
      </div>
      <div class="item">
        <div class="lable">
          <div class="icon">*</div>
          <div class="text">店铺昵称</div>
        </div>
        <a-input
          placeholder="请输入店铺昵称"
          v-model="shopInfoForm.nickname"
          class="input"
        />
      </div>
      <div class="item">
        <div class="lable">
          <div class="icon">*</div>
          <div class="text">主营类目</div>
        </div>
        <a-cascader
          :options="categoryArr"
          :field-names="fieldNames"
          check-strictly
          @change="blurCascader"
          placeholder="请输入主营类目"
        />
      </div>
      <div class="item">
        <div class="lable">
          <div class="text">具体经营商品类型</div>
        </div>
        <a-input-tag
          class="inputTag"
          placeholder="请输入具体商品类型，用回车分隔"
          :model-value="tags"
          @change="changeTag"
          @blur="blurTag"
          allow-clear
        />
      </div>
      <div class="item">
        <div class="lable">
          <div class="text">品牌理念</div>
        </div>
        <a-textarea
          placeholder="品牌理念"
          auto-size
          v-model="shopInfoForm.brandBelief"
          :max-length="50"
          :show-word-limit="true"
        />
      </div>
      <div class="item">
        <div class="lable">
          <div class="text">核心卖点</div>
        </div>
        <a-textarea
          placeholder="请输入核心卖点"
          auto-size
          v-model="shopInfoForm.brandAdvantage"
          :max-length="50"
          :show-word-limit="true"
        />
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <a-button class="sub" @click="createShopAccountFn">确定</a-button>
        <a-button class="cancel" @click="cancelCrate"> 取消 </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { login, getUserInfo } from "../../api/login/login";
import { getUserMenu } from "../../api/menu/index";
import {
  updateShopInfo,
  getShopInfo,
  getShopMainCategory,
} from "../../api/system/shopInfo";
import { useStore } from "vuex";
import { Message } from "@arco-design/web-vue";
import { restoreHierarchy } from "../../utils/public";

export default {
  name: "loginIndex",
  setup() {
    const router = useRouter();
    const store = useStore();
    // 变量
    // 登录
    const form = reactive({
      name: "",
      password: "",
    });
    // 店铺信息
    const shopInfoForm = reactive({
      ID: "",
      brandAdvantage: "", //品牌优势(核心卖点)
      brandBelief: "", //品牌理念
      brandManagement: "", //品牌管理(具体经营商品类型)
      category: {
        ID: 0,
        parentId: 0,
        name: "", //名称
      }, //主营类目
      name: "", //店铺名称
      nickname: "", //店铺昵称
    });
    // 主营类目数组
    const categoryArr = reactive([]);
    // 主营类目数组-未处理
    const categoryArr1 = reactive([]);
    // 主营类目自定义字段名
    const fieldNames = reactive({ value: "ID", label: "Name" });
    // tag临时存储
    const tags = reactive([]);
    // 账号第一次登陆填写店铺信息弹窗
    const changeShopInfoModal = ref(false);
    // 是否记住密码
    const isPassword = ref(false);

    // 方法
    // 是否记住密码
    const changeIsPassWord = (value) => {
      localStorage.setItem("isPassWord", value);
      isPassword.value = value;
    };
    // 登录
    const handleSubmit = async () => {
      const params = {
        captcha: "string",
        captchaId: "string",
        password: form.password,
        username: form.name,
      };
      let res = await login(params);
      if (res.code == 0) {
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("userInfo", JSON.stringify(res.data.user));
        sessionStorage.setItem("uuid", res.data.user.uuid);
        if (isPassword.value) {
          localStorage.setItem(
            "accountAndPassWord",
            JSON.stringify({ password: form.password, name: form.name })
          );
        } else {
          localStorage.removeItem("accountAndPassWord");
        }
        if (res.data.user.shopId) {
          getShopMainCategoryFn();
          getShopInfoFn(res.data.user.shopId);
        } else {
          changeShopInfoModal.value = true;
        }
      } else {
        Message.error(res.msg);
      }
    };
    // 获取用户菜单列表
    const menu = async () => {
      let res = await getUserMenu();
      if (res.code == 0) {
        const foundItem = res.data.menus.find(
          (item) => item.children && item.children.length > 0
        );
        let list = {
          parent: foundItem,
          son: foundItem.children[0],
        };
        store.commit("pushMenu", res.data.menus);
        store.commit("changeMenu", list);
        sessionStorage.setItem("menu", JSON.stringify(res.data.menus));
        sessionStorage.setItem("selMenu", JSON.stringify(list));
        router.push({ name: foundItem.children[0].path });
      } else {
        router.push({ name: "Error" });
      }
    };
    // 第一次登录创建商户信息
    const createShopAccountFn = async () => {
      if (shopInfoForm.nickname == "") {
        Message.error("店铺昵称不能为空");
        return;
      }
      if (shopInfoForm.category.name == "") {
        Message.error("主营类目不能为空");
        return;
      }
      let res = await updateShopInfo(shopInfoForm);
      if (res) {
        menu();
        sessionStorage.setItem("shopInfo", JSON.stringify(res));
      }
    };
    // 取消创建
    const cancelCrate = () => {
      sessionStorage.clear();
      changeShopInfoModal.value = false;
    };
    // 获取商户信息
    const getShopInfoFn = async (shopId) => {
      let params = {
        shopId,
      };
      let res = await getShopInfo(params);
      if (res && res.nickName != "") {
        sessionStorage.setItem("shopInfo", JSON.stringify(res));
        menu();
      } else {
        shopInfoForm.name = res.name;
        shopInfoForm.ID = res.ID;
        changeShopInfoModal.value = true;
      }
    };
    // 获取用户信息
    const getUserInfoFn = async (name) => {
      let params = {
        name,
      };
      let res = await getUserInfo(params);
      if (res) {
        sessionStorage.setItem("userInfo", JSON.stringify(res.data.userInfo));
        setTimeout(() => {
          window.location.href = "/";
        });
        menu();
      }
    };
    // 获取商户主营类目
    const getShopMainCategoryFn = async () => {
      categoryArr.length = 0;
      categoryArr1.length = 0;
      let res = await getShopMainCategory();
      categoryArr.push(...restoreHierarchy(res));
      categoryArr1.push(...res);
    };
    // 选择主营类目
    const blurCascader = (value) => {
      shopInfoForm.category.ID = value;
      categoryArr1.forEach((item) => {
        if (item.ID == value) {
          shopInfoForm.category.name = item.Name;
          shopInfoForm.category.parentId = item.parentId;
        }
      });
      if (shopInfoForm.category.parentId != 0) {
        categoryArr1.forEach((item) => {
          if (item.ID == shopInfoForm.category.parentId) {
            shopInfoForm.category.name =
              item.Name + "/" + shopInfoForm.category.name;
          }
        });
      }
    };
    // tag输入框变化
    const changeTag = (value) => {
      if (value.length > 0) {
        let str = value[value.length - 1];
        if (str.includes(",") || str.includes("，")) {
          Message.error("文本不能包含','");
          value.splice(value.length - 1, 1);
        }
      }
      tags.length = 0;
      tags.push(...value);
    };
    // tag blur事件
    const blurTag = () => {
      shopInfoForm.brandManagement = tags.join(",");
    };
    onMounted(() => {
      if (
        !sessionStorage.getItem("token") ||
        !sessionStorage.getItem("userInfo")
      ) {
        let params = new URLSearchParams(window.location.search);
        if (params && params.get("token")) {
          sessionStorage.setItem("token", params.get("token"));
          getUserInfoFn(decodeURIComponent(params.get("name")));
        }
      } else {
        menu();
      }
      if (localStorage.getItem("isPassWord") == "true") {
        isPassword.value = localStorage.getItem("isPassWord");
        let list = JSON.parse(localStorage.getItem("accountAndPassWord"));
        form.name = list.name;
        form.password = list.password;
      }
    });
    return {
      categoryArr1,
      form,
      shopInfoForm,
      changeShopInfoModal,
      isPassword,
      tags,
      categoryArr,
      fieldNames,
      blurCascader,
      getShopMainCategoryFn,
      cancelCrate,
      getShopInfoFn,
      blurTag,
      handleSubmit,
      menu,
      changeIsPassWord,
      createShopAccountFn,
      changeTag,
      getUserInfoFn,
    };
  },
};
</script>
<style lang='scss' scoped>
.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 4px;
}
.index {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--main-backgroundColor);
  .option {
    width: 320px;
    height: 290px;
    background-color: #fff;
    position: relative;
    z-index: 1;
    border-radius: var(--main-borderRadio);
    border: 1px solid var(--main-borderColor);
    .logo {
      width: 146px;
      height: 40px;
      margin: 24px;
    }
    .form {
      width: calc(100% - 48px);
      margin-left: 24px;
      justify-content: center;
      flex-wrap: wrap;
      .input {
        width: 100%;
        height: 36px;
        margin-bottom: 16px;
        background-color: var(--main-backgroundColor);
      }
      ::v-deep .arco-input-wrapper:hover {
        background-color: var(--main-btnHoverColor);
      }
      .btn {
        width: 100%;
        height: 36px;
        margin-bottom: 16px;
      }
      .checkbox {
        padding: 0;
      }
      ::v-deep .arco-icon-hover:hover::before {
        background-color: rgba($color: #000000, $alpha: 0.1);
      }
    }
  }
  .tips {
    position: absolute;
    bottom: 20px;
    width: 100%;
    color: var(--main-fontColor2);
    text-align: center;
  }
}
.changeShopInfoModal {
  .content {
    padding: 0 4px;
    .title {
      font-weight: bold;
      font-size: 20px;
      line-height: 27px;
      color: var(--main-fontColor1);
    }
    .subTitle {
      color: var(--main-fontColor3);
      font-size: 12px;
      line-height: 15px;
      margin-top: 8px;
      margin-bottom: 24px;
    }
    .item {
      width: 100%;
      margin-bottom: 24px;
      .lable {
        color: var(--main-fontColor2);
        font-weight: bold;
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        .icon {
          color: #ff1600;
          margin-right: 4px;
        }
      }
      .inputTag {
        background-color: var(--main-backgroundColor);
      }
      .inputTag:hover {
        background-color: #e3e9f0;
      }
      .valueModel {
        width: 100%;
        border-top: 1px solid var(--main-borderColor);
        padding: 8px 0;
        display: flex;
        &:last-child {
          border-bottom: 1px solid var(--main-borderColor);
        }
        ::v-deep .arco-checkbox {
          padding-left: 0;
        }
        .left {
          flex-shrink: 0;
          width: 124px;
        }
        .right {
          flex-shrink: 0;
          .checkbox {
            margin-right: 24px;
          }
        }
      }
      .input {
        width: 100%;
        height: 36px;
        line-height: 36px;
        background-color: var(--main-backgroundColor) !important;
      }
      ::v-deep .arco-select-view-single {
        background-color: var(--main-backgroundColor) !important;
      }
      ::v-deep .arco-select-view-single:hover {
        background-color: var(--main-btnHoverColor) !important;
      }
      ::v-deep .arco-textarea {
        height: 110px !important;
        background-color: var(--main-backgroundColor) !important;
      }
      ::v-deep .arco-textarea:hover {
        background-color: var(--main-btnHoverColor) !important;
      }
      ::v-deep .arco-input-wrapper:hover {
        background-color: var(--main-btnHoverColor) !important;
      }
      ::v-deep .arco-form-item {
        display: block;
      }
      ::v-deep .arco-form-item-label-col > .arco-form-item-label {
        display: flex;
        align-items: center;
      }
    }
  }
  .footer {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    padding: 0 4px;
    .cancel {
      width: 60px;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      text-align: center;
      background-color: var(--main-backgroundColor);
    }
    ::v-deep .arco-btn-secondary:hover {
      background-color: var(--main-btnHoverColor);
    }
    .sub {
      width: 60px;
      height: 32px;
      line-height: 32px;
      color: rgba(255, 255, 255, 1);
      font-size: 14px;
      text-align: center;
      margin-left: 12px;
      background-color: var(--main-btnBackgroundColor);
    }
    ::v-deep .sub:hover {
      background-color: var(--main-btnHoverColor1);
    }
    ::v-deep .sub:active {
      background-color: var(--main-btnPressedColor);
    }
  }
}
</style>