<!-- 通用知识库 -->
<template>
  <div class="general">
    <div class="top">
      <a-tabs
        type="rounded"
        size="large"
        class="left"
        :hide-content="true"
        @change="tabsChange"
      >
        <a-tab-pane :key="-1">
          <template #title>
            <div class="tabsAll">全部 · {{ tabsAllNum }}</div>
          </template>
        </a-tab-pane>
        <a-tab-pane :key="index" v-for="(item, index) in tabsArr">
          <template #title>
            <div
              :style="
                selTabs == index ? 'color:#005fff;font-weight: bold;' : ''
              "
            >
              {{ item.QType }} · {{ item.RefCount }}
            </div>
          </template>
        </a-tab-pane>
      </a-tabs>
      <div class="right">
        <a-input-search
          placeholder="搜索知识内容"
          class="input"
          v-model="search.Answer"
          @press-enter="searchFn"
        />
      </div>
    </div>
    <a-table
      :data="tableData"
      class="table"
      :pagination="false"
      :sticky-header="100"
    >
      <template #columns>
        <a-table-column
          title="知识类别"
          data-index="Question"
          :width="190"
        ></a-table-column>
        <a-table-column title="知识内容" data-index="Answer"></a-table-column>
        <a-table-column title="分组" data-index="qa_types" :width="130">
          <template #cell="{ record }">
            <div v-if="record.qa_types.length > 0">
              {{ record.qa_types[0].QType }}
            </div>
            <div v-else>暂无数据</div>
          </template>
        </a-table-column>
        <a-table-column title="状态" data-index="Enable" width="100">
          <template #cell="{ record }">
            <div v-if="record.Enable == '1'" class="status">
              <span style="background: #00b42a"></span>
              正常
            </div>
            <div v-if="record.Enable != '1'" class="status">
              <span style="background: #f53f3f"></span>
              已停用
            </div>
          </template>
        </a-table-column>
        <a-table-column title="操作" data-index="option" :width="150">
          <template #cell="{ record }">
            <a-button type="text" class="btn" @click="changeLine(record)">
              配置知识
            </a-button>
            <a-popconfirm
              content="停用后可重新启用，确认要停用吗？"
              type="warning"
              position="tr"
              @ok="changeStatus(record)"
            >
              <a-button
                type="text"
                class="btn"
                style="color: #ff1600"
                v-if="record.Enable == '1'"
              >
                停用
              </a-button>
            </a-popconfirm>
            <a-button
              type="text"
              class="btn"
              v-if="record.Enable != '1'"
              @click="changeStatus(record)"
            >
              启用
            </a-button>
          </template>
        </a-table-column>
      </template>
    </a-table>
    <div class="tableOption">
      <div class="left"></div>
      <a-pagination
        @page-size-change="changePageSize"
        @change="changePage"
        :total="search.total"
        :page-size="search.pageSize"
        show-total
        show-jumper
        show-page-size
      />
    </div>
  </div>
  <a-modal
    v-model:visible="knowledgeDeploymentModal"
    :width="648"
    class="modal"
  >
    <template #title>
      <div class="title">配置知识</div>
    </template>
    <div class="content">
      <div class="item">
        <div class="lable">知识类别</div>
        <div class="value">{{ lineValue.Question }}</div>
      </div>
      <div class="item">
        <div class="lable">
          <div class="icon">*</div>
          知识内容
        </div>
        <a-textarea
          :show-word-limit="true"
          v-model="lineValue.Answer"
          :max-length="500"
          placeholder="请输入知识内容"
          class="textarea"
        />
      </div>
      <div class="item">
        <div class="lable">所属分组</div>
        <a-select
          placeholder="请选择所属分组"
          v-model="modalSelTabs"
          :allow-search="false"
          @change="selTabsFn"
        >
          <a-option v-for="item in tabsArr" :key="item.ID">
            {{ item.QType }}
          </a-option>
        </a-select>
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <a-button class="sub" @click="subKnowledgeBase">确定修改</a-button>
        <a-button class="cancel" @click="knowledgeDeploymentModal = false">
          取消
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import {
  getTypesList,
  getList,
  updateList,
} from "../../api/knowledgeLibrary/knowledgeBase";
import { fuzzySearch, groupingSearch } from "../../utils/public";
import { Message } from "@arco-design/web-vue";

export default {
  name: "generalPage",
  setup() {
    // 变量
    // 配置知识弹窗
    const knowledgeDeploymentModal = ref(false);
    // 选中的tabs
    const selTabs = ref(-1);
    // 选中的当行数据
    const lineValue = reactive({
      ID: "",
      Question: "",
      Answer: "",
      qa_types: [
        {
          ID: null,
          KbType: 1,
          QType: "",
          RefCount: 0,
        },
      ],
    });
    // 搜索按钮
    const search = reactive({
      total: 0,
      page: 1,
      pageSize: 10,
      Answer: "",
    });
    // 表格数据
    const tableData = reactive([]);
    // 后台返回数据
    const resArr = reactive([]);
    // 搜索之后的数据
    const searchTableData = reactive([]);
    // 表格搜索tabs
    const tabsArr = reactive([]);
    // tabs总数
    const tabsAllNum = ref(0);
    // 弹窗选中的tabs
    const modalSelTabs = ref();
    // 选中的当行数据中qa_types中的id
    const qa_types_ID = ref(null);
    // 获取shopId
    const shopId = sessionStorage.getItem("userInfo")
      ? JSON.parse(sessionStorage.getItem("userInfo")).shopId
      : 0;

    // 方法
    // 打开配置知识弹窗
    const changeLine = (item) => {
      lineValue.ID = item.ID;
      lineValue.Question = item.Question;
      lineValue.Answer = item.Answer;
      if (item.qa_types.length > 0) {
        lineValue.qa_types = item.qa_types;
        modalSelTabs.value = item.qa_types[0].QType;
        qa_types_ID.value = item.qa_types[0].ID;
      } else {
        lineValue.qa_types = [
          {
            ID: null,
            KbType: 1,
            QType: "",
            RefCount: 0,
          },
        ];
      }
      knowledgeDeploymentModal.value = true;
    };
    // tabs发生变化
    const tabsChange = (num) => {
      if (num !== "") {
        selTabs.value = num;
      }
      tableData.length = 0;
      searchTableData.length = 0;
      if (selTabs.value != -1) {
        searchTableData.push(
          ...groupingSearch(resArr, "QType", tabsArr[selTabs.value].QType)
        );
        tableData.push(...searchTableData);
        if (searchTableData.length > 0) {
          changePageSize(search.pageSize);
          search.total = searchTableData.length;
        } else {
          search.total = 0;
        }
      } else {
        changePageSize(search.pageSize);
        search.total = resArr.length;
      }
    };
    // 获取表格搜索tabs数据
    const getTabsFn = async () => {
      tabsArr.length = 0;
      tabsAllNum.value = 0;
      let params = {
        page: 1,
        pageSize: 5,
        keyWord: "1",
      };
      let res = await getTypesList(params);
      if (res.code == 0) {
        tabsArr.push(...res.data.list);
        tabsArr.forEach((item) => {
          tabsAllNum.value += item.RefCount;
        });
      }
    };
    // 获取表格数据
    const getListFn = async () => {
      tableData.length = 0;
      resArr.length = 0;
      let params = {
        keyword: "1",
        page: 1,
        pageSize: 10000,
        shopId: shopId,
      };
      let res = await getList(params);
      if (res.code == 0) {
        // 获取后台数据
        resArr.push(...res.data.list);
        search.total = res.data.total;
        tableData.length = 0;
        tableData.push(...resArr.slice(0, search.pageSize));
      }
    };
    // 修改列表数据
    const subKnowledgeBase = async () => {
      if (lineValue.Answer == "") {
        Message.error("知识内容不能为空");
        return;
      }
      let params = {
        ID: lineValue.ID,
        answer: lineValue.Answer,
        kbType: 1,
        question: lineValue.Question,
        updatedBy: JSON.parse(sessionStorage.getItem("userInfo")).nickName
          ? JSON.parse(sessionStorage.getItem("userInfo")).nickName
          : "",
        shopId: shopId,
      };
      if (qa_types_ID.value != lineValue.qa_types[0].ID) {
        params.qa_type = lineValue.qa_types;
      }
      let res = await updateList(params);
      if (res) {
        knowledgeDeploymentModal.value = false;
        getListFn();
        getTabsFn();
        qa_types_ID.value = null;
      }
    };

    // 修改自动回复状态
    const changeStatus = async (item) => {
      let params = {
        ID: item.ID,
        Enable: item.Enable == "1" ? "0" : "1",
      };
      let res = await updateList(params);
      if (res) {
        Message.success("修改成功");
        getListFn();
      } else {
        Message.error("修改失败,请稍后重试");
      }
    };

    // 新增列表数据选择分组
    const selTabsFn = (value) => {
      if (lineValue.qa_types.length > 0) {
        lineValue.qa_types[0].QType = value;
      }
      tabsArr.forEach((item) => {
        if (item.QType == value) {
          if (lineValue.qa_types.length > 0) {
            lineValue.qa_types[0].ID = item.ID;
          }
        }
      });
    };
    // 列表搜索查询
    const searchFn = () => {
      tableData.length = 0;
      searchTableData.length = 0;
      if (search.Answer != "") {
        searchTableData.push(...fuzzySearch(resArr, "Answer", search.Answer));
        tableData.push(...searchTableData);
        if (searchTableData.length > 0) {
          changePageSize(search.pageSize);
          search.total = searchTableData.length;
        } else {
          search.total = 0;
        }
      } else {
        if (selTabs.value !== -1) {
          tabsChange("");
        } else {
          changePageSize(search.pageSize);
          search.total = resArr.length;
        }
      }
    };
    // 分页数量变化
    const changePageSize = (num) => {
      search.pageSize = num;
      tableData.length = 0;
      search.page = 1;
      if (searchTableData.length == 0) {
        tableData.push(...resArr.slice(0, search.pageSize));
      } else {
        tableData.push(...searchTableData.slice(0, search.pageSize));
      }
    };
    // 分页页码变化
    const changePage = (num) => {
      search.page = num;
      let arr = searchTableData.length == 0 ? resArr : searchTableData;
      tableData.length = 0;
      if (num == 1) {
        tableData.push(...arr.slice(0, search.pageSize));
      } else {
        let first = (num - 1) * search.pageSize;
        tableData.push(...arr.slice(first, first + search.pageSize));
      }
    };
    onMounted(() => {
      getListFn();
      getTabsFn();
    });
    return {
      shopId,
      resArr,
      searchTableData,
      selTabs,
      tabsAllNum,
      search,
      tableData,
      tabsArr,
      knowledgeDeploymentModal,
      lineValue,
      modalSelTabs,
      qa_types_ID,
      changeStatus,
      getTabsFn,
      getListFn,
      tabsChange,
      changeLine,
      subKnowledgeBase,
      selTabsFn,
      searchFn,
      changePageSize,
      changePage,
    };
  },
};
</script>
<style lang='scss' scoped>
.general {
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: relative;
  border-radius: var(--main-borderRadio);
  ::v-deep .arco-btn-text {
    padding: 0;
    &:hover {
      background-color: transparent;
    }
  }
  .top {
    width: 100%;
    height: 70px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      height: 36px;
      ::v-deep .arco-tabs-tab-active {
        background: #e7f0ff;
        color: var(--main-btnBackgroundColor);
        border-radius: var(--main-borderRadio);
        font-weight: bold;
      }
      ::v-deep .arco-tabs-tab {
        margin: 0 8px 0 0;
        &:hover {
          border-radius: var(--main-borderRadio);
          color: var(--main-btnBackgroundColor);
          background: #e7f0ff;
        }
      }
    }
    .right {
      display: flex;
      align-items: center;
      .input {
        width: 200px;
        height: 36px;
        background-color: var(--main-backgroundColor);
      }
      ::v-deep .arco-input-wrapper:hover {
        background-color: var(--main-btnHoverColor);
      }
    }
  }
  .table {
    position: absolute;
    top: 70px;
    left: 24px;
    right: 24px;
    bottom: 80px;
    .status {
      display: flex;
      align-items: center;
      span {
        display: block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin-right: 8px;
      }
    }
    .btn {
      padding: 0;
      margin-right: 15px;
    }
    ::v-deep .arco-table-header,
    ::v-deep .arco-table-container {
      border-radius: 0 0 0 0 !important;
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
.modal {
  .title {
    font-size: 16px;
    font-weight: bold;
  }
  .content {
    padding: 0 4px;
    .item {
      margin-bottom: 24px;
      .lable {
        color: var(--main-fontColor2);
        font-weight: bold;
        display: flex;
        align-items: center;
        .icon {
          height: 16px;
          color: #f53f3f;
          margin-right: 4px;
        }
      }
      .value {
        color: var(--main-fontColor2);
      }
      .textarea {
        font-size: 14px;
        margin-top: 8px;
        background-color: var(--main-backgroundColor);
      }
      ::v-deep .arco-textarea {
        min-height: 300px;
      }
      ::v-deep .arco-textarea-wrapper {
        background-color: var(--main-btnHoverColor);
      }
      ::v-deep .arco-select-view-single {
        margin-top: 8px;
        background-color: var(--main-backgroundColor);
        &:hover {
          background-color: var(--main-btnHoverColor);
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