<!-- 
  通用问答知识库
 -->
<template>
  <div class="general">
    <div class="tableBox">
      <div class="top">
        <div class="numIssue">共 {{ numIssue }} 个标签</div>
        <div class="right">
          <a-input-search placeholder="搜索问题" class="input" />
          <a-button class="btn" @click="open('添加标签')">
            <div class="icon-add"></div>
            添加标签
          </a-button>
        </div>
      </div>
      <a-table
        :sticky-header="100"
        :pagination="{ pageSize: search.pageSize }"
        :row-selection="rowSelection"
        v-model:selectedKeys="selectedKeys"
        row-key="id"
        :columns="columns"
        :data="tableData"
        @select="tableFn"
        class="table"
      >
        <template #option="{ record }">
          <a-table-column title="操作">
            <a-button type="text" class="btn" @click="edit(record)"
              >编辑</a-button
            >
            <a-popconfirm
              content="删除之后不可恢复，确定要删除吗？"
              type="warning"
              position="tr"
              @ok="del('only', record.id)"
            >
              <a-button
                type="text"
                class="btn"
                style="color: #ff1600"
                @click="openDel('only')"
              >
                删除
              </a-button>
            </a-popconfirm>
          </a-table-column>
        </template>
      </a-table>
      <div class="tableOption">
        <div class="left">
          <a-checkbox :model-value="checkedTableAll" @click="allChecked"
            >全选</a-checkbox
          >
          <a-popconfirm
            content="确定要删除吗?"
            type="warning"
            position="right"
            @ok="del('move', '')"
            :popup-visible="popupVisible"
          >
            <a-button class="btn" @click="openDel('move')">删除选中项</a-button>
          </a-popconfirm>
        </div>
        <a-pagination
          :total="search.total"
          v-model:page-size="search.pageSize"
          show-total
          show-jumper
          show-page-size
        />
      </div>
    </div>
  </div>
  <a-modal v-model:visible="passwordModel" :width="400" class="model">
    <template #title>
      <div class="title">{{ modelTitle }}</div>
    </template>
    <div class="content">
      <div class="item">
        <div class="lable">
          <div class="icon">*</div>
          <div class="text">标签名称</div>
        </div>
        <a-input
          v-model="form.name"
          placeholder="请输入标签名称"
          class="input"
        />
      </div>
      <div class="item">
        <div class="lable">
          <div class="icon">*</div>
          <div class="text">标签说明</div>
        </div>
        <a-textarea
          auto-size
          class="textarea"
          show-word-limit
          :max-length="80"
          placeholder="请输入标签说明"
        />
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <a-button class="sub" @click="submit">{{ modelBtnText }}</a-button>
        <a-button class="cancel" @click="passwordModel = false">取消</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { ref, reactive } from "vue";
export default {
  name: "diyPage",
  setup() {
    // 变量
    //表格全选
    const popupVisible = ref(false);
    //表格全选
    const checkedTableAll = ref(false);
    //标签弹窗
    const passwordModel = ref(false);
    //弹窗详情title
    const modelTitle = ref("添加标签");
    //弹窗按钮名称
    const modelBtnText = ref("确定修改");
    //多少个问题
    let numIssue = ref("0");
    //表格选中的id
    const selectedKeys = ref([]);
    //搜索参数
    const search = reactive({
      total: 10,
      pageSize: 20,
    });
    //问答类型数组
    const answerArr = reactive([]);
    //选中的问答类型数组
    const selAnswerArr = reactive([]);
    //列表单行数据
    const form = reactive({
      biz_qa: {
        answer: "", //问题内容
        id: 0,
        question: "", //回复内容
        updatedBy: JSON.parse(sessionStorage.getItem("userInfo")).nickName
          ? JSON.parse(sessionStorage.getItem("userInfo")).nickName
          : "",
      },
      biz_qa_question: [], //自定义问答
      biz_question_type: [], //问答类型
    });
    //表格表头
    const columns = reactive([
      {
        title: "标签名称",
        dataIndex: "name",
        width: 200,
      },
      {
        title: "标签说明",
        dataIndex: "explain",
      },
      {
        title: "已关联商品量",
        dataIndex: "shopNum",
        width: 200,
      },
      {
        title: "操作",
        slotName: "option",
        fixed: "right",
        width: 200,
      },
    ]);
    //表格数据
    const tableData = reactive([
      {
        id: "1",
        name: "限量抢购",
        explain: "你必须知道的8中产品设计能力提升技巧",
        shopNum: "78",
      },
      {
        id: "1",
        name: "限量抢购",
        explain: "你必须知道的8中产品设计能力提升技巧",
        shopNum: "78",
      },
    ]);
    //表格选择
    const rowSelection = reactive({
      type: "checkbox",
      showCheckedAll: false,
      onlyCurrent: false,
    });

    // 方法
    //打开弹窗
    const open = (type) => {
      modelTitle.value = type;
      modelBtnText.value = "确定添加";
      passwordModel.value = true;
    };
    // 表格全选
    const allChecked = () => {
      if (checkedTableAll.value) {
        selectedKeys.value = [];
        checkedTableAll.value = false;
      } else {
        selectedKeys.value = [];
        tableData.forEach((item) => {
          selectedKeys.value.push(item.id);
        });
        checkedTableAll.value = true;
      }
    };
    // 表格选择
    const tableFn = (data, extra, currentDataSource) => {
      if (data.length === tableData.length || data.length === search.pageSize) {
        checkedTableAll.value = true;
      } else {
        checkedTableAll.value = false;
      }
      console.log("表格选中的数据,已存储", data);
      console.log("选中的id", currentDataSource.id);
    };
    // 编辑标签
    const edit = (item) => {
      modelTitle.value = "编辑标签";
      modelBtnText.value = "确定编辑";
      console.log(item);
      passwordModel.value = true;
    };
    // 删除
    const del = (type, id) => {
      console.log(id);
      if (type == "move") {
        popupVisible.value = false;
      }
    };
    // 删除选中项
    const openDel = (type) => {
      if (type == "move") {
        if (selectedKeys.value.length > 0) {
          popupVisible.value = true;
        } else {
          popupVisible.value = false;
        }
      }
    };
    // 问答sel赋值
    const changeTips = (e) => {
      selAnswerArr.value = e;
    };
    // 新增一行问法
    const addLine = () => {
      let list = {
        qid: 0,
        question: "",
        updatedBy: JSON.parse(sessionStorage.getItem("userInfo")).nickName
          ? JSON.parse(sessionStorage.getItem("userInfo")).nickName
          : "",
      };
      form.biz_qa_question.push(list);
    };
    // 删除一行问法
    const delLine = (index) => {
      form.biz_qa_question.splice(index, 1);
    };
    // 当行input失去焦点赋值给当行question
    const questionsInputBlur = (e, index) => {
      form.biz_qa_question[index].question = e.target.value;
    };
    // 提交编辑/修改
    const submit = () => {};
    return {
      checkedTableAll,
      numIssue,
      columns,
      tableData,
      rowSelection,
      selectedKeys,
      search,
      passwordModel,
      modelTitle,
      form,
      modelBtnText,
      selAnswerArr,
      answerArr,
      popupVisible,
      tableFn,
      edit,
      del,
      allChecked,
      submit,
      addLine,
      delLine,
      questionsInputBlur,
      openDel,
      changeTips,
      open,
    };
  },
};
</script>
<style lang='scss' scoped>
.general {
  width: 100%;
  height: 100%;
  .tableBox {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: var(--main-borderRadio) !important;
    .top {
      width: 100%;
      height: 70px;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .numIssue {
        color: var(--main-fontColor3);
        font-size: 14px;
      }
      .right {
        display: flex;
        align-items: center;
        .input {
          width: 200px;
          height: 36px;
          background-color: var(--main-backgroundColor) !important;
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
        }
        ::v-deep .arco-btn-secondary:hover {
          background-color: var(--main-btnHoverColor1);
        }
        ::v-deep .arco-btn-secondary:active {
          background-color: var(--main-btnPressedColor);
        }
        ::v-deep .arco-input-wrapper:hover {
          background-color: var(--main-btnHoverColor) !important;
        }
      }
    }
    .table {
      position: absolute;
      top: 70px;
      left: 24px;
      right: 24px;
      bottom: 80px;
      .btn {
        padding: 0;
        margin-right: 15px;
        color: var(--main-btnBackgroundColor);
      }
      ::v-deep .arco-table-header,
      ::v-deep .arco-table-container {
        border-radius: 0 0 0 0 !important;
      }
      ::v-deep .arco-table-pagination {
        display: none !important;
      }
      ::v-deep .arco-btn-text:hover {
        background-color: transparent;
      }
      ::v-deep .arco-table-th {
        height: 48px;
        padding: 4px 16px;
        background-color: #f6f8fc !important;
        border-radius: 0 !important;
        border-bottom: 1px solid var(--main-borderColor);
        font-weight: 700;
      }
      ::v-deep .arco-table-td {
        height: 48px;
        padding: 4px 16px;
        border-bottom: 1px solid var(--main-borderColor);
      }
      ::v-deep .arco-table-cell {
        padding: 0;
      }
    }
    .tableOption {
      width: calc(100% - 48px);
      display: flex;
      position: absolute;
      left: 24px;
      bottom: 24px;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .btn {
          width: 98px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          margin-left: 16px;
          background-color: var(--main-backgroundColor) !important;
        }
        ::v-deep .arco-btn-secondary:hover {
          background-color: var(--main-btnHoverColor) !important;
        }
      }
      ::v-deep .arco-pagination-total {
        display: none;
      }
      ::v-deep .arco-pagination-options .arco-select {
        background-color: var(--main-backgroundColor) !important;
      }
      ::v-deep .arco-pagination-jumper .arco-pagination-jumper-input {
        background-color: var(--main-backgroundColor) !important;
      }
      ::v-deep .arco-select-view-single:hover {
        background-color: var(--main-btnHoverColor) !important;
      }
      ::v-deep .arco-input-wrapper:hover {
        background-color: var(--main-btnHoverColor) !important;
      }
    }
  }
}
.model {
  .title {
    font-size: 16px;
    font-weight: bold;
  }
  .content {
    padding: 0 4px;
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
      .input {
        width: 352px;
        height: 36px;
        line-height: 36px;
        background-color: var(--main-backgroundColor) !important;
      }
      .textarea {
        width: 352px;
        height: 100px;
        background-color: var(--main-backgroundColor) !important;
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
      width: 100px;
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      text-align: center;
      background-color: var(--main-backgroundColor);
    }
    ::v-deep .arco-btn-secondary:hover {
      background-color: var(--main-btnHoverColor);
    }
    .sub {
      width: 100px;
      height: 36px;
      line-height: 36px;
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