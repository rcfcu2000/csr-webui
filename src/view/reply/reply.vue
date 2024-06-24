<!-- 
  自动回复管理
 -->
 <template>
  <div class="general">
    <div class="tableBox">
      <div class="top">
        <div class="numIssue">共 {{ search.total }} 个自动回复</div>
        <div class="right">
          <a-input-search
            placeholder="搜索关键字"
            class="input"
            v-model="search.Question"
            @press-enter="searchFn"
          />
        </div>
      </div>
      <a-table
        :data="tableData"
        :pagination="false"
        :sticky-header="100"
        class="table"
      >
        <template #columns>
          <a-table-column
            title="触发关键字"
            data-index="Question"
          ></a-table-column>
          <a-table-column title="回复内容" data-index="Answer">
            <template #cell="{ record }">
              <div v-if="record.Answer == ''" class="answerPlaceholder">
                未配置
              </div>
              <div v-else>{{ record.Answer }}</div>
            </template>
          </a-table-column>
          <a-table-column title="最后更新时间" data-index="UpdateTime">
          </a-table-column>
          <a-table-column title="修改人" data-index="UpdatedBy">
          </a-table-column>
          <a-table-column title="状态" data-index="Status">
            <template #cell="{ record }">
              <div v-if="record.Status == 1" class="status">
                <span style="background: #00b42a"></span>
                正常
              </div>
              <div v-if="record.Status != 1" class="status">
                <span style="background: #f53f3f"></span>
                已停用
              </div>
            </template>
          </a-table-column>
          <a-table-column title="操作" data-index="option">
            <template #cell="{ record }">
              <a-button type="text" class="btn" @click="edit(record)"
                >配置</a-button
              >
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
                  v-if="record.Status == 1"
                >
                  停用
                </a-button>
              </a-popconfirm>
              <a-button
                type="text"
                class="btn"
                v-if="record.Status != 1"
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
          :total="search.total"
          :page-size="search.pageSize"
          @page-size-change="changePageSize"
          @change="changePage"
          show-total
          show-jumper
          show-page-size
        />
      </div>
    </div>
  </div>
  <a-modal v-model:visible="modal" :width="648" class="modal">
    <template #title>
      <div class="title">配置自动回复</div>
    </template>
    <div class="content">
      <div class="item">
        <div class="label">触发关键字</div>
        <div class="value">{{ lineValue.Question }}</div>
      </div>
      <div class="item">
        <div class="label">
          <div class="icon">*</div>
          回复内容
        </div>
        <a-textarea
          :show-word-limit="true"
          v-model="lineValue.Answer"
          :max-length="500"
          placeholder="请输入回复内容"
          class="textarea"
        />
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <a-button class="sub" @click="sub">保存</a-button>
        <a-button class="cancel" @click="modal = false"> 取消 </a-button>
      </div>
    </template>
  </a-modal>
</template>
  
  <script>
import { ref, reactive, onMounted } from "vue";
import { fuzzySearch, formDate } from "../../utils/public";
import { getList, updateReply } from "../../api/reply/reply";
import { Message } from "@arco-design/web-vue";

export default {
  name: "replyPage",
  setup() {
    // 变量
    //修改所属角色弹窗
    const modal = ref(false);
    //搜索参数
    const search = reactive({
      total: 0,
      page: 1,
      pageSize: 20,
      Question: "",
    });
    // 选中的当行数据
    const lineValue = reactive({
      ID: "",
      Question: "",
      Answer: "",
      UpdatedBy: "",
      Status: "",
    });
    //表格数据
    const tableData = reactive([]);
    // 后台返回数据
    const resArr = reactive([]);
    // 搜索之后的数据
    const searchTableData = reactive([]);
    // 获取shopId
    const shopId = sessionStorage.getItem("userInfo")
      ? JSON.parse(sessionStorage.getItem("userInfo")).shopId
      : 0;

    // 方法

    // 编辑自动回复
    const edit = (item) => {
      lineValue.ID = item.ID;
      lineValue.Question = item.Question;
      lineValue.Answer = item.Answer;
      lineValue.UpdatedBy = JSON.parse(
        sessionStorage.getItem("userInfo")
      ).userName;
      lineValue.Status = item.Status;
      modal.value = true;
    };
    // 修改自动回复状态
    const changeStatus = async (item) => {
      let params = {
        ID: item.ID,
        Status: item.Status == 1 ? 0 : 1,
      };
      let res = await updateReply(params);
      if (res) {
        Message.success("修改成功");
        getReplyList();
      } else {
        Message.error("修改失败,请稍后重试");
      }
    };
    // 保存修改
    const sub = async () => {
      if (lineValue.Answer == "") {
        Message.error("回复内容不能为空");
        return;
      }
      let res = await updateReply(lineValue);
      if (res) {
        Message.success("配置成功");
        modal.value = false;
        getReplyList();
      } else {
        Message.error("配置失败,请稍后重试");
      }
    };
    // 获取所有自动回复列表
    const getReplyList = async () => {
      tableData.length = 0;
      resArr.length = 0;
      let params = {
        page: 1,
        pageSize: 10000,
        shopId: shopId,
      };
      let res = await getList(params);
      if (res.code == 0) {
        // 获取后台数据
        resArr.push(...res.data.list);
        resArr.forEach((item) => {
          item.UpdateTime = formDate(item.UpdateTime, "2");
        });
        search.total = res.data.total;
        tableData.length = 0;
        tableData.push(...resArr.slice(0, search.pageSize));
      } else {
        Message.error("获取数据失败,请刷新页面重试");
      }
    };
    // 列表搜索查询
    const searchFn = () => {
      tableData.length = 0;
      searchTableData.length = 0;
      if (search.Question != "") {
        searchTableData.push(
          ...fuzzySearch(resArr, "Question", search.Question)
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
      getReplyList();
    });
    return {
      shopId,
      resArr,
      searchTableData,
      lineValue,
      tableData,
      search,
      modal,
      sub,
      changeStatus,
      edit,
      getReplyList,
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
            margin-left: 4px;
          }
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
      .answerPlaceholder {
        color: var(--main-fontColor3);
        font-size: 14px;
      }
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
      .textarea {
        font-size: 14px;
        margin-top: 8px;
      }
      ::v-deep .arco-textarea {
        min-height: 300px;
        background-color: var(--main-backgroundColor);
        &:hover {
          background-color: var(--main-btnHoverColor);
        }
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