<!-- 欢迎语 -->
<template>
  <div class="greeting">
    <div class="top">
      <div class="left">
        <a-switch checked-color="#165DFF" unchecked-color="#C9CDD4" />
        <div class="text">
          <div class="title">欢迎语</div>
          <div>开启后AI能够第一时间欢迎顾客，给顾客更好的客服体验。</div>
        </div>
      </div>
      <a-button class="btn" @click="openGreetingModal('add')">
        添加欢迎语
      </a-button>
    </div>
    <div class="content">
      <div class="item">
        <div class="top">
          <div class="text">默认欢迎语</div>
          <a-switch
            checked-color="#165DFF"
            unchecked-color="#C9CDD4"
            size="small"
          />
        </div>
        <div class="content">
          <div class="value">
            生活中，不少消费者都有这样的经历：在超市、菜市场灯光下看着光鲜水灵的肉类、蔬果，买回家后却发现并不那么“养眼”。其实，在商店里，经营者可能使用了特殊灯具，使得所销售的生鲜农产品看起来色泽亮丽美观。这种专门用来给生鲜农产品提色增亮的灯具，被形象地称为“生鲜灯”。眼下，“生鲜灯”在各地超市、菜市场中被广泛使用，甚至形成了一种“光学营销”套路。
          </div>
          <div class="option">
            <div class="date">
              <icon-calendar />
              <div class="text">2024-06-21 14:07:07 - 2024-06-22 14:07:07</div>
            </div>
            <div class="btns">
              <icon-edit class="edit" @click="openGreetingModal('change')" />
              <icon-delete class="del" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 编辑欢迎语弹窗 -->
  <a-modal v-model:visible="greetingModal" :width="648" class="modal">
    <template #title>
      <div class="title">{{ greetingTitle }}</div>
    </template>
    <div class="content">
      <div class="item">
        <div class="label">
          <div class="icon">*</div>
          <div class="text">欢迎语标题</div>
        </div>
        <a-input
          placeholder="请输入欢迎语标题"
          class="input"
          :max-length="10"
          show-word-limit
        />
      </div>
      <div class="item">
        <div class="label">
          <div class="icon">*</div>
          <div class="text">欢迎语内容</div>
        </div>
        <a-textarea
          placeholder="请输入欢迎语内容"
          :max-length="500"
          show-word-limit
        />
      </div>
      <div class="item">
        <div class="label">
          <div class="icon">*</div>
          <div class="text">生效时段</div>
          <a-tooltip
            content="当有自定义时段欢迎语时，优先发送自定义时段欢迎语"
            position="right"
            :content-style="{
              fontSize: '13px',
              borderRadius: '4px',
            }"
          >
            <icon-question-circle />
          </a-tooltip>
        </div>
        <div class="value">
          <a-radio-group v-model="dateType" @change="changeDateType">
            <a-radio value="1">长期有效</a-radio>
            <a-radio value="2">自定义时段</a-radio>
          </a-radio-group>
          <a-range-picker
            showTime
            @change="changePicker"
            v-if="dateType == '2'"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <a-button class="sub" @click="sub">保存</a-button>
        <a-button class="cancel" @click="greetingModal = false">
          取消
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { reactive, ref } from "vue";

export default {
  name: "greetingPage",
  setup() {
    // 变量
    // 弹窗开关
    const greetingModal = ref(false);
    // 弹窗标题
    const greetingTitle = ref("添加欢迎语");
    // 弹窗生效时段type
    const dateType = ref("1");
    // 选中的当行数据
    const lineValue = reactive({
      ID: "",
    });

    // 方法
    // 打开编辑/新增弹窗
    const openGreetingModal = (type) => {
      if (type == "add") {
        greetingTitle.value = "添加欢迎语";
      } else {
        greetingTitle.value = "编辑欢迎语";
      }
      greetingModal.value = true;
    };
    // 生效时段变化
    const changeDateType = (value) => {
      dateType.value = value;
    };
    // 自定义时间变化
    const changePicker = (value) => {
      console.log(value);
    };
    // 提交编辑/新增
    const sub = () => {};

    return {
      lineValue,
      dateType,
      greetingModal,
      greetingTitle,
      openGreetingModal,
      changeDateType,
      changePicker,
      sub,
    };
  },
};
</script>
<style lang='scss' scoped>
.greeting {
  width: 100%;
  height: 100%;
  background-color: #fff;
  > .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px;
    padding-bottom: 0;
    .left {
      display: flex;
      align-items: center;
      font-size: 14px;
      .text {
        margin-left: 16px;
        color: var(--main-fontColor3);
        .title {
          font-weight: bold;
          font-size: 18px;
          color: var(--main-fontColor1);
          margin-bottom: 4px;
        }
      }
    }

    .btn {
      width: 100px;
      height: 36px;
      line-height: 36px;
      color: rgba(255, 255, 255, 1);
      font-size: 14px;
      margin-left: 16px;
      background-color: var(--main-btnBackgroundColor);
      display: flex;
      align-items: center;
      justify-content: center;
      .icon-add {
        margin-right: 4px;
      }

      &:hover {
        background-color: var(--main-btnHoverColor1);
      }
      &:active {
        background-color: var(--main-btnPressedColor);
      }
    }
  }
  > .content {
    padding: 24px;
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 四列，每列宽度相等 */
    grid-gap: 24px; /* 可选：网格项之间的间距 */
    min-height: 100px; /* 可选：最小高度 */
    max-height: 500px; /* 可选：最大高度，如果需要的话 */
    .item {
      border: 1px solid var(--main-borderColor);
      .top {
        height: 46px;
        border-bottom: 1px solid var(--main-borderColor);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        .text {
          font-weight: 500;
          font-size: 16px;
          color: var(--main-fontColor1);
        }
      }
      .content {
        padding: 16px;
        .value {
          font-size: 14px;
          color: var(--main-fontColor1);
          line-height: 22px;
        }
        .option {
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .date {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            color: var(--main-fontColor3);
            font-size: 12px;
            .text {
              margin-left: 8px;
              width: 100%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .btns {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            .edit,
            .del {
              flex-shrink: 0;
              font-size: 16px;
              color: var(--main-btnBackgroundColor);
              cursor: pointer;
            }
            .del {
              color: #f53f3f;
              margin-left: 16px;
            }
          }
        }
      }
    }
  }
}
.modal {
  .title {
    font-size: 16px;
    font-weight: bold;
  }
  .content {
    padding: 0 4px;
    .item {
      margin-bottom: 24px;
      .label {
        color: var(--main-fontColor2);
        font-weight: bold;
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        .icon {
          color: #ff1600;
        }
        .text {
          margin: 0 4px;
        }
      }
      .input {
        width: 100%;
        height: 36px;
        background-color: var(--main-backgroundColor);
        &:hover {
          background-color: var(--main-btnHoverColor);
        }
      }
      ::v-deep .arco-textarea {
        width: 100%;
        height: 170px;
        resize: none;
        background-color: var(--main-backgroundColor);
        &:hover {
          background-color: var(--main-btnHoverColor);
        }
      }
      ::v-deep .arco-textarea-wrapper{
        border: none;
      }
      .value {
        height: 36px;
        ::v-deep .arco-picker {
          margin-left: 8px;
          background-color: var(--main-backgroundColor);
          &:hover {
            background-color: var(--main-btnHoverColor);
          }
        }
        ::v-deep .arco-radio {
          height: 36px;
          padding: 0;
          margin-right: 24px;
          &:last-child {
            margin-right: 0;
          }
        }
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
      height: 32px;
      line-height: 32px;
      color: rgba(255, 255, 255, 1);
      font-size: 14px;
      text-align: center;
      margin-left: 12px;
      padding: 0 15px;
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