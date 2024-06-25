<!-- 定制知识库 -->
<template>
  <div class="general" v-if="loading">
    <div class="top">
      <div class="left">
        <a-tabs
          type="rounded"
          size="large"
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
              <a-dropdown-button position="br">
                <div
                  :style="
                    selTabs == index ? 'color:#005fff;font-weight: bold;' : ''
                  "
                >
                  {{ item.QType }} · {{ item.RefCount }}
                </div>
                <template #icon>
                  <div class="icon-more"></div>
                </template>
                <template #content>
                  <a-doption @click="openTabsModal(item)">
                    <template #icon>
                      <div class="icon-edit"></div>
                    </template>
                    重命名
                  </a-doption>
                  <a-doption style="color: #cb272d" @click="delTabs(item)">
                    <template #icon>
                      <icon-delete />
                    </template>
                    删除分组
                  </a-doption>
                </template>
              </a-dropdown-button>
            </template>
          </a-tab-pane>
        </a-tabs>
        <div
          class="icon-add"
          @click="openTabsModal('')"
          v-if="tabsArr.length < 5"
        ></div>
      </div>
      <div class="right">
        <a-input-search
          placeholder="搜索问题"
          class="input"
          v-model="search.Answer"
          @press-enter="searchFn"
        />
        <a-button
          class="btn"
          @click="openKnowledgeModal()"
          v-if="tableData.length > 0"
        >
          <div class="icon-add"></div>
          添加知识
        </a-button>
      </div>
    </div>
    <a-table
     :sticky-header="100"
      :data="tableData"
      class="table"
      :pagination="false"
      v-if="tableData.length > 0"
    >
      <template #columns>
        <a-table-column :width="50">
          <template #cell="{ record }">
            <a-checkbox
              :model-value="record.isChecked"
              @click="checkedLine(record)"
            ></a-checkbox>
          </template>
        </a-table-column>
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
        <a-table-column title="操作" data-index="option" :width="250">
          <template #cell="{ record }">
            <a-button type="text" class="btn" @click="changeLine(record)">
              配置知识
            </a-button>
            <a-popconfirm
              content="删除之后不可恢复，确定要删除吗？"
              type="warning"
              position="tr"
              @ok="del('only', record.ID)"
            >
              <a-button
                type="text"
                class="btn"
                style="color: #ff1600; margin-left: 8px"
              >
                删除
              </a-button>
            </a-popconfirm>
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
    <div class="tableOption" v-if="tableData.length > 0">
      <div class="left">
        <a-checkbox :model-value="checkedTableAll" @click="allChecked"
          >全选</a-checkbox
        >
        <a-popconfirm
          content="确定要删除吗?"
          type="warning"
          position="right"
          @ok="del('more', '')"
        >
          <a-button class="btn">删除选中项</a-button>
        </a-popconfirm>
      </div>
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
    <div class="tableLength0" v-if="tableData.length == 0">
      <div class="option">
        <div class="icon-empty"></div>
        <div class="text1">暂未添加定制知识</div>
        <div class="text2">
          可添加自定义知识，用于训练专属于您店铺的AI大模型，有助于客服助手更精准的为您服务
        </div>
        <a-button class="btn" type="primary" @click="openKnowledgeModal()">
          立即添加
        </a-button>
      </div>
    </div>
  </div>
  <!-- 知识库 -->
  <a-modal
    v-model:visible="knowledgeDeploymentModal"
    :width="648"
    class="modal"
  >
    <template #title>
      <div class="title">{{ knowledgeDeploymentTitle }}</div>
    </template>
    <div class="content">
      <div class="item">
        <div class="label">
          <div class="icon">*</div>
          知识类别
        </div>
        <div class="value" v-if="knowledgeDeploymentTitle == '修改定制知识'">
          {{ lineValue.Question }}
        </div>
        <a-input
          v-model="lineValue.Question"
          placeholder="请输入知识类别"
          class="input"
          v-else
        />
      </div>
      <div class="item">
        <div class="label">
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
        <div class="label">所属分组</div>
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
        <a-button class="sub" @click="subKnowledgeBase" :loading="btnLoading">
          {{ knowledgeDeploymentBtn }}
        </a-button>
        <a-button class="cancel" @click="knowledgeDeploymentModal = false">
          取消
        </a-button>
      </div>
    </template>
  </a-modal>
  <!-- tabs -->
  <a-modal v-model:visible="tabsModal" :width="348" class="tabsModal">
    <template #title>
      <div class="title">分组名称</div>
    </template>
    <div class="content">
      <a-input
        v-model="qa_types.QType"
        placeholder="请输入分组名称"
        class="input"
      />
    </div>
    <template #footer>
      <div class="footer">
        <a-button class="sub" @click="subTabs">{{ tabsBtn }}</a-button>
        <a-button class="cancel" @click="tabsModal = false">取消</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import {
  getTypesList,
  addList,
  getList,
  addTypeList,
  delList,
  updateList,
  updateTypeList,
  delTypeList,
} from "../../api/knowledgeLibrary/knowledgeBase";
import { Message } from "@arco-design/web-vue";
import { fuzzySearch, groupingSearch } from "../../utils/public";

export default {
  name: "generalPage",
  setup() {
    // 变量
    // 页面加载
    const loading = ref(false);
    // 按钮loading
    const btnLoading = ref(false);
    // 配置知识弹窗
    const knowledgeDeploymentModal = ref(false);
    // 配置知识弹窗title
    const knowledgeDeploymentTitle = ref("");
    // 配置知识弹窗Btn
    const knowledgeDeploymentBtn = ref("");
    // 添加tabs菜单弹窗
    const tabsModal = ref(false);
    //表格全选
    const checkedTableAll = ref(false);
    // 添加tabs菜单弹窗按钮
    const tabsBtn = ref("");
    // 分组数据
    const qa_types = reactive({
      ID: null,
      KbType: 2,
      QType: "",
      RefCount: 0,
    });
    // 弹窗选中的tabs
    const modalSelTabs = ref();
    // 选中的当行数据
    const lineValue = reactive({
      ID: "",
      Question: "",
      Enable: "1",
      Answer: "",
      qa_types: [
        {
          ID: null,
          KbType: 2,
          QType: "",
          RefCount: 0,
        },
      ],
    });
    // 选中的当行数据中qa_types中的id
    const qa_types_ID = ref(null);
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
    // 选中的tabs
    const selTabs = ref(-1);
    // tabs总数
    const tabsAllNum = ref(0);
    // 获取shopId
    const shopId = sessionStorage.getItem("userInfo")
      ? JSON.parse(sessionStorage.getItem("userInfo")).shopId
      : 0;

    // 方法
    // 表格单选
    const checkedLine = (item) => {
      item.isChecked = !item.isChecked;
      let num = 0;
      tableData.forEach((item) => {
        if (item.isChecked) {
          num++;
        }
      });
      if (num == tableData.length) {
        checkedTableAll.value = true;
      } else {
        checkedTableAll.value = false;
      }
    };
    // 表格全选
    const allChecked = () => {
      checkedTableAll.value = !checkedTableAll.value;
      if (checkedTableAll.value) {
        tableData.forEach((item) => {
          item.isChecked = true;
        });
      } else {
        tableData.forEach((item) => {
          item.isChecked = false;
        });
      }
    };
    // 打开tabs修改/编辑弹窗
    const openTabsModal = (item) => {
      if (item) {
        qa_types.QType = item.QType;
        qa_types.ID = item.ID;
        tabsBtn.value = "保存";
      } else {
        qa_types.QType = "";
        tabsBtn.value = "确定添加";
      }
      tabsModal.value = true;
    };
    // 打开添加知识弹窗
    const openKnowledgeModal = () => {
      knowledgeDeploymentTitle.value = "添加定制知识";
      knowledgeDeploymentBtn.value = "保存";
      lineValue.ID = "";
      lineValue.Question = "";
      lineValue.Enable = "1";
      lineValue.Answer = "";
      lineValue.qa_types = [
        {
          ID: null,
          KbType: 2,
          QType: "",
          RefCount: 0,
        },
      ];
      qa_types_ID.value = null;
      modalSelTabs.value = "";
      knowledgeDeploymentModal.value = true;
    };
    // 打开配置知识弹窗
    const changeLine = (item) => {
      knowledgeDeploymentTitle.value = "修改定制知识";
      knowledgeDeploymentBtn.value = "确定修改";
      lineValue.ID = item.ID;
      lineValue.Question = item.Question;
      lineValue.Answer = item.Answer;
      lineValue.Enable = item.Enable;
      if (item.qa_types.length > 0) {
        lineValue.qa_types = item.qa_types;
        modalSelTabs.value = item.qa_types[0].QType;
        qa_types_ID.value = item.qa_types[0].ID;
      } else {
        lineValue.qa_types = [
          {
            ID: null,
            KbType: 2,
            QType: "",
            RefCount: 0,
          },
        ];
      }
      knowledgeDeploymentModal.value = true;
    };
    // tabs发生变化
    const tabsChange = (num) => {
      selTabs.value = num;
      tableData.length = 0;
      searchTableData.length = 0;
      if (num != -1) {
        searchTableData.push(
          ...groupingSearch(resArr, "QType", tabsArr[num].QType)
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
        keyWord: "2",
      };
      let res = await getTypesList(params);
      if (res.code == 0) {
        tabsArr.push(...res.data.list);
        tabsArr.forEach((item) => {
          tabsAllNum.value += item.RefCount;
        });
      }
    };
    // 新增tabs
    const subTabs = async () => {
      if (qa_types.QType == "") {
        Message.error("分组名称不能为空");
        return;
      }
      let params = {
        KbType: 2,
        QType: qa_types.QType,
      };
      let res;
      if (tabsBtn.value == "确定添加") {
        res = await addTypeList(params);
      } else if (tabsBtn.value == "保存") {
        params.ID = qa_types.ID;
        res = await updateTypeList(params);
      }
      if (res) {
        getTabsFn();
        tabsModal.value = false;
        qa_types.ID = null;
        qa_types.KbType = 2;
        qa_types.QType = "";
        qa_types.RefCount = 0;
      }
    };
    // 删除tabs
    const delTabs = async (item) => {
      if (item.RefCount > 0) {
        Message.error("列表中还有与之相关的数据，删除之后才能删除该选项");
        return;
      }
      let params = {
        ID: item.ID,
      };
      let res = await delTypeList(params);
      if (res) {
        getTabsFn();
      }
    };
    // 新增/修改列表数据
    const subKnowledgeBase = async () => {
      let params = {};
      let res;
      if (lineValue.Question == "") {
        Message.error("知识类别不能为空");
        return;
      }
      if (lineValue.Answer == "") {
        Message.error("知识内容不能为空");
        return;
      }
      if (knowledgeDeploymentTitle.value == "修改定制知识") {
        params = {
          ID: lineValue.ID,
          qa_types: lineValue.qa_types,
          answer: lineValue.Answer,
          Enable: lineValue.Enable,
          kbType: 2,
          question: lineValue.Question,
          updatedBy: JSON.parse(sessionStorage.getItem("userInfo")).nickName
            ? JSON.parse(sessionStorage.getItem("userInfo")).nickName
            : "",
          shopId: shopId,
        };
        res = await updateList(params);
      } else if (knowledgeDeploymentTitle.value == "添加定制知识") {
        params.biz_qa = {
          qa_types: lineValue.qa_types,
          answer: lineValue.Answer,
          kbType: 2,
          question: lineValue.Question,
          updatedBy: JSON.parse(sessionStorage.getItem("userInfo")).nickName
            ? JSON.parse(sessionStorage.getItem("userInfo")).nickName
            : "",
          shopId: shopId,
          Enable: "1",
        };
        btnLoading.value = true;
        res = await addList(params);
      }
      if (res) {
        knowledgeDeploymentModal.value = false;
        getListFn();
        getTabsFn();
        btnLoading.value = false;
      } else {
        btnLoading.value = false;
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
    // 删除行数据
    const del = async (type, id) => {
      let params = {};
      let res;
      if (type == "only") {
        params.ID = id;
        res = await delList(params);
      } else if (type == "more") {
        tableData.forEach(async (item) => {
          let ids = "";
          if (item.isChecked) {
            if (ids == "") {
              ids = item.ID;
            } else {
              ids += "," + item.ID;
            }
          }
        });
      }
      if (res) {
        Message.success("删除成功");
        getListFn();
        getTabsFn();
      }
    };
    // 获取表格数据
    const getListFn = async () => {
      tableData.length = 0;
      resArr.length = 0;
      let params = {
        keyword: "2",
        page: 1,
        pageSize: 10000,
        shopId: shopId,
      };
      let res = await getList(params);
      if (res.code == 0) {
        resArr.push(...res.data.list);
        resArr.forEach((item) => {
          item.isChecked = false;
        });
        search.total = res.data.total;
        tableData.length = 0;
        tableData.push(...resArr.slice(0, search.pageSize));
        search.total = res.data.total;
        loading.value = true;
      } else {
        Message.error("页面加载失败，请稍后重试");
      }
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
        changePageSize(search.pageSize);
        search.total = resArr.length;
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
      btnLoading,
      qa_types_ID,
      modalSelTabs,
      checkedTableAll,
      qa_types,
      tabsModal,
      selTabs,
      tabsAllNum,
      search,
      tableData,
      tabsArr,
      knowledgeDeploymentModal,
      lineValue,
      knowledgeDeploymentTitle,
      knowledgeDeploymentBtn,
      tabsBtn,
      loading,
      changeStatus,
      getTabsFn,
      getListFn,
      tabsChange,
      changeLine,
      openTabsModal,
      openKnowledgeModal,
      checkedLine,
      allChecked,
      subKnowledgeBase,
      subTabs,
      selTabsFn,
      del,
      delTabs,
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
      display: flex;
      align-items: center;
      .tabsAll {
        padding: 7px 16px;
        text-align: center;
      }
      ::v-deep .arco-btn-size-medium {
        height: 36px;
        padding: 0;
      }
      ::v-deep .arco-btn-group .arco-btn:first-child {
        padding-left: 16px;
      }
      ::v-deep .arco-btn-group .arco-btn:last-child {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        margin: 0 6px;
      }
      ::v-deep .arco-btn-group .arco-btn:last-child:hover {
        background-color: #dbe5f8;
      }
      ::v-deep .arco-tabs-tab-active {
        background-color: #e7f0ff;
        color: var(--main-btnBackgroundColor);
        border-radius: var(--main-borderRadio);
        font-weight: bold;
      }
      ::v-deep .arco-btn-size-medium {
        background-color: transparent;
        border: none;
      }
      ::v-deep .arco-tabs-tab {
        padding: 0;
        margin: 0 8px 0 0;
        &:hover {
          border-radius: var(--main-borderRadio);
          background: #e7f0ff;
        }
      }
      .icon-add {
        width: 36px;
        height: 36px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--main-borderRadio);
        &:hover {
          background-color: var(--main-btnHoverColor);
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
  .tableLength0 {
    width: 100%;
    height: calc(100% - 70px);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -70px;
    .option {
      width: 560px;
      height: 184px;
      text-align: center;
      .icon-empty {
        font-size: 48px;
        color: var(--main-fontColor3);
      }
      .text1 {
        font-weight: bold;
        font-size: 18px;
        line-height: 22px;
        margin: 24px 0 8px 0;
      }
      .text2 {
        font-size: 14px;
        line-height: 22px;
        color: var(--main-fontColor3);
      }
      .btn {
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
        .icon {
          height: 16px;
          color: #f53f3f;
          margin-right: 4px;
        }
      }
      .value {
        color: var(--main-fontColor2);
      }
      .input {
        background-color: var(--main-backgroundColor);
        margin-top: 8px;
        &:hover {
          background-color: var(--main-btnHoverColor);
        }
      }
      .textarea {
        font-size: 14px;
        margin-top: 8px;
      }
      ::v-deep .arco-textarea {
        min-height: 300px;
        background-color: var(--main-backgroundColor);
        resize: none;
        &:hover {
          background-color: var(--main-btnHoverColor);
        }
      }
      ::v-deep .arco-textarea-wrapper {
        background-color: var(--main-btnHoverColor);
        border: none;
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
      min-width: 60px;
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
.tabsModal {
  .title {
    font-size: 16px;
    font-weight: bold;
  }
  .content {
    padding: 0 4px;
    .input {
      width: 100%;
      background-color: var(--main-backgroundColor);
      &:hover {
        background-color: var(--main-btnHoverColor);
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
      min-width: 60px;
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