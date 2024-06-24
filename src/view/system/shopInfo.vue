<!--  -->
<template>
  <div class="shopInfo">
    <div class="account" style="display: none">
      <div class="title">
        <div class="left">
          <div class="icon-user"></div>
          <div class="text">账号信息</div>
        </div>
      </div>
      <div class="item">
        <div class="name">用户名</div>
        <div class="value">{{ accountInfo.name }}</div>
      </div>
      <div class="item">
        <div class="name">账号等级</div>
        <div class="value">
          <div>{{ accountInfo.accountLv }}</div>
          <a-button type="text" @click="openTips">升级</a-button>
        </div>
      </div>
      <div class="item">
        <div class="name">子账号席位</div>
        <div class="value">
          <div>{{ accountInfo.accountSeat }}/10</div>
          <a-button type="text" @click="openTips">扩容</a-button>
        </div>
      </div>
      <div class="item">
        <div class="name">开通时间</div>
        <div class="value">{{ accountInfo.openTime }}</div>
      </div>
      <div class="item">
        <div class="name">到期时间</div>
        <div class="value">{{ accountInfo.endTime }}</div>
      </div>
    </div>
    <div class="shop">
      <div class="title title1">
        <div class="left">
          <div class="icon-store"></div>
          <div class="text">店铺信息</div>
        </div>
        <div class="right" @click="changeShopInfoModal = true">
          <div class="icon-edit"></div>
          <a-button type="text">修改店铺信息</a-button>
        </div>
      </div>
      <div class="item">
        <div class="name">店铺名称</div>
        <div class="value">{{ shopInfo.name }}</div>
      </div>
      <div class="item">
        <div class="name">店铺昵称</div>
        <div class="value">
          <div class="placeholder" v-if="shopInfo.nickName == ''">暂未填写</div>
          <div class="text" v-else>{{ shopInfo.nickName }}</div>
        </div>
      </div>
      <div class="item">
        <div class="name">主营类目</div>
        <div class="value">
          <div>{{ shopInfo.category.Name }}</div>
        </div>
      </div>
      <div class="item">
        <div class="name">具体经营</div>
        <div class="value">
          <div v-for="(item, index) in tags" :key="index" class="tagItem">
            {{ item }}
          </div>
        </div>
      </div>
      <div class="item">
        <div class="name">品牌理念</div>
        <div class="value">
          <div>{{ shopInfo.brandBelief }}</div>
        </div>
      </div>
      <div class="item">
        <div class="name">核心卖点</div>
        <div class="value">
          <div class="placeholder" v-if="shopInfo.brandAdvantage == ''">
            暂未填写
          </div>
          <div class="text" v-else>{{ shopInfo.brandAdvantage }}</div>
        </div>
      </div>
    </div>
  </div>
  <a-modal
    v-model:visible="changeShopInfoModal"
    :width="410"
    class="changeShopInfoModal"
  >
    <template #title>
      <div class="title">修改店铺信息</div>
    </template>
    <div class="content">
      <div class="item">
        <div class="label">
          <div class="icon">*</div>
          <div class="text">店铺昵称</div>
        </div>
        <a-input
          placeholder="请输入店铺昵称"
          v-model="shopInfo.nickName"
          class="input"
        />
      </div>
      <div class="item">
        <div class="label">
          <div class="icon">*</div>
          <div class="text">主营类目</div>
        </div>
        <a-cascader
          :options="categoryArr"
          :field-names="fieldNames"
          :model-value="shopInfo.category.Name"
          check-strictly
          @change="blurCascader"
          placeholder="请输入主营类目"
        />
      </div>
      <div class="item">
        <div class="label">
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
        <div class="label">
          <div class="text">品牌理念</div>
        </div>
        <a-textarea
          placeholder="品牌理念"
          auto-size
          v-model="shopInfo.brandBelief"
          :max-length="200"
          :show-word-limit="true"
        />
      </div>
      <div class="item">
        <div class="label">
          <div class="text">核心卖点</div>
        </div>
        <a-textarea
          placeholder="核心卖点"
          v-model="shopInfo.brandAdvantage"
          auto-size
          :max-length="30"
          :show-word-limit="true"
        />
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <a-button class="sub" @click="subShopInfo" :loading="btnLoading">
          确定
        </a-button>
        <a-button class="cancel" @click="changeShopInfoModal = false">
          取消
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import {
  getShopInfo,
  updateShopInfo,
  getShopMainCategory,
} from "../../api/system/shopInfo";
import { Message } from "@arco-design/web-vue";
import { restoreHierarchy } from "../../utils/public";

export default {
  name: "rolePage",
  setup() {
    // 变量
    const numRole = ref("2");
    // 按钮btn loading
    const btnLoading = ref(false);
    // 主营类目数组
    const categoryArr = reactive([]);
    // 主营类目数组-未处理
    const categoryArr1 = reactive([]);
    // 主营类目自定义字段名
    const fieldNames = reactive({ value: "ID", label: "Name" });
    // 店铺信息
    const accountInfo = reactive({
      name: "用户名", //用户名
      accountLv: "基础版", //账号等级
      accountSeat: "3", //子账号席位
      openTime: "2024-05-31", //开通时间
      endTime: "2025-05-31", //开通时间
    });
    // 店铺信息
    const shopInfo = reactive({
      ID: "",
      brandAdvantage: "", //品牌优势(核心卖点)
      brandBelief: "", //品牌理念
      brandManagement: "", //品牌管理(具体经营商品类型)
      category: {
        ID: 0,
        Name: "", //名称
        parentId: 0,
      }, //主营类目
      name: "", //店铺名称
      nickName: "", //店铺昵称
    });
    // tag临时存储
    const tags = reactive([]);
    // 修改弹窗
    const changeShopInfoModal = ref(false);
    // 获取shopId
    const shopId = sessionStorage.getItem("userInfo")
      ? JSON.parse(sessionStorage.getItem("userInfo")).shopId
      : 0;

    // 方法
    const getShopInfoFn = async () => {
      let params = {
        shopId: shopId,
      };
      let res = await getShopInfo(params);
      if (res) {
        shopInfo.brandAdvantage = res.brandAdvantage;
        shopInfo.brandBelief = res.brandBelief;
        shopInfo.brandManagement = res.brandManagement;
        shopInfo.category = res.category;
        shopInfo.ID = res.ID;
        shopInfo.name = res.name;
        shopInfo.nickName = res.nickName;
        tags.push(...shopInfo.brandManagement.split(","));
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
      shopInfo.brandManagement = tags.join(",");
    };
    // 打开提示弹窗
    const openTips = () => {
      Message.info("请联系您的销售顾问进行具体操作");
    };
    // 提交修改店铺信息
    const subShopInfo = async () => {
      if (shopInfo.nickName == "") {
        Message.error("店铺昵称不能为空");
        return;
      }
      if (shopInfo.category.Name == "") {
        Message.error("主营类目不能为空");
        return;
      }
      btnLoading.value = true;
      let res = await updateShopInfo(shopInfo);
      if (res) {
        Message.success("修改成功");
        changeShopInfoModal.value = false;
        btnLoading.value = false;
      } else {
        btnLoading.value = false;
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
      shopInfo.category.ID = value;
      categoryArr1.forEach((item) => {
        if (item.ID == value) {
          shopInfo.category.Name = item.Name;
          shopInfo.category.parentId = item.parentId;
        }
      });
      if (shopInfo.category.parentId != 0) {
        categoryArr1.forEach((item) => {
          if (item.ID == shopInfo.category.parentId) {
            shopInfo.category.Name = item.Name + "/" + shopInfo.category.Name;
          }
        });
      }
    };
    onMounted(() => {
      getShopMainCategoryFn();
      getShopInfoFn();
    });
    return {
      shopId,
      categoryArr,
      fieldNames,
      categoryArr1,
      tags,
      numRole,
      shopInfo,
      accountInfo,
      changeShopInfoModal,
      btnLoading,
      openTips,
      subShopInfo,
      getShopInfoFn,
      changeTag,
      blurTag,
      getShopMainCategoryFn,
      blurCascader,
    };
  },
};
</script>
<style lang='scss' scoped>
.shopInfo {
  height: 100%;
  padding: 64px;
  background-color: #fff;
  border-radius: var(--main-borderRadio);
  color: #333c43;
  .shop,
  .account {
    width: 600px;
  }
  .account {
    margin-bottom: 52px;
  }
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--main-fontColor1);
    font-weight: bold;
    margin-bottom: 24px;
    .icon-user,
    .icon-store {
      color: var(--main-btnBackgroundColor);
      margin-right: 8px;
    }
    .left,
    .right {
      display: flex;
      align-items: center;
    }
    .right {
      .arco-btn-text {
        padding: 0;
      }
      .icon-edit {
        margin-right: 8px;
        color: var(--main-btnBackgroundColor);
      }
      .arco-btn-text:hover {
        background-color: transparent;
      }
    }
  }
  .item {
    display: flex;
    font-size: 14px;
    line-height: 24px;
    .name {
      flex-shrink: 0;
      width: 100px;
      color: var(--main-fontColor3);
      padding-bottom: 24px;
    }
    .value {
      padding-bottom: 24px;
      display: flex;
      .placeholder {
        color: var(--main-fontColor3);
      }
      .tagItem {
        height: 24px;
        line-height: 24px;
        padding: 0 8px;
        border-radius: 2px;
        background-color: #f2f3f4;
        margin-right: 8px;
      }
      ::v-deep .arco-btn-text {
        padding: 0;
        margin-left: 8px;
        height: auto;
        &:hover {
          background-color: transparent;
        }
        &:active {
          background-color: transparent;
        }
      }
    }
  }
}
.changeShopInfoModal {
  .content {
    padding: 0 4px;
    .item {
      width: 100%;
      margin-bottom: 24px;
      .label {
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