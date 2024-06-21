<!-- 
  尺码表管理
 -->
 <template>
  <div class="general">
    <div class="tableBox">
      <div class="top">
        <div class="numIssue">共 {{ search.total }} 个尺码对照表</div>
        <div class="right">
          <a-input-search
            placeholder="搜索对照表名称"
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
            title="对照表名称"
            data-index="Question"
          ></a-table-column>
          <a-table-column title="类别" data-index="Answer"> </a-table-column>
          <a-table-column title="绑定商品量" data-index="Answer">
          </a-table-column>
          <a-table-column
            title="最后更新时间"
            data-index="UpdateTime"
            :width="200"
          >
          </a-table-column>
          <a-table-column
            title="最后更新账号"
            data-index="UpdatedBy"
            :width="150"
          >
          </a-table-column>
          <a-table-column title="状态" data-index="Status" :width="100">
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
          <a-table-column title="操作" data-index="option" :width="200">
            <template #cell="{ record }">
              <a-button type="text" class="btn" @click="edit(record)">
                配置
              </a-button>
              <a-button type="text" class="btn" @click="bindCommodity(record)">
                绑定商品
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
  <!-- 配置尺码表 -->
  <a-modal v-model:visible="modal" :width="768" class="modal">
    <template #title>
      <div class="title">配置尺码对照表</div>
    </template>
    <div class="content" style="height: 530px">
      <div class="top">
        <div class="item" style="margin-right: 240px">
          <div class="label">对照表名称</div>
          <div class="value">修生款</div>
        </div>
        <div class="item">
          <div class="label">类别</div>
          <div class="value">女装</div>
        </div>
      </div>
      <div class="sizeTable">
        <div class="label">尺码值</div>
        <div class="value">
          <template v-for="(item, index) in sizeTable" :key="index">
            <div class="tr">
              <div>{{ item.label }}</div>
              <div class="tdBox">
                <template v-for="(item1, index1) in item.value" :key="index1">
                  <div class="td">
                    <!-- 现在的这个判断是基于写死的数据，之后扩展的话只需要把这个ifelse去掉，只使用 -->
                    <div v-if="index == 0">{{ item1 }}</div>
                    <a-input
                      :default-value="item1"
                      class="input"
                      placeholder="S/M/L/XL"
                      @blur="blurSize(index, index1, $event)"
                      v-else
                    />
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <a-button class="sub" @click="subSize">保存</a-button>
        <a-button class="cancel" @click="modal = false"> 取消 </a-button>
      </div>
    </template>
  </a-modal>
  <!-- 配置商品 -->
  <a-modal v-model:visible="configCommodityModal" :width="600" class="modal">
    <template #title>
      <div class="title">绑定商品</div>
    </template>
    <div class="content">
      <a-transfer
        show-search
        one-way
        @change="changeTransfer"
        :data="commodityData"
        :default-value="selCommodityData"
        :source-input-search-props="{
          placeholder: '搜索商品简称',
        }"
        :target-input-search-props="{
          placeholder: '搜索商品简称',
        }"
        class="transfer"
      >
        <template
          #source-title="{
            checked,
            indeterminate,
            onSelectAllChange,
            countTotal,
            countSelected,
          }"
        >
          <div class="noSelCommodity">
            <div class="left">
              <a-checkbox
                :model-value="checked"
                :indeterminate="indeterminate"
                @change="onSelectAllChange"
              />
              <div class="text">未绑定的商品</div>
            </div>
            <div class="sel_noSel">{{ countSelected }}/{{ countTotal }}</div>
          </div>
        </template>
        <template #target-title>
          <div class="noSelCommodity">
            <div class="left">
              <div class="text">绑定的商品</div>
            </div>
            <div class="delLogo"><icon-delete /></div>
          </div>
        </template>
      </a-transfer>
    </div>
    <template #footer>
      <div class="footer">
        <a-button class="sub" @click="sub">保存</a-button>
        <a-button class="cancel" @click="configCommodityModal = false">
          取消
        </a-button>
      </div>
    </template>
  </a-modal>
</template>
    
<script>
import { ref, reactive, onMounted } from "vue";
import { fuzzySearch, formDate } from "../../utils/public";
import { getList, updateReply } from "../../api/reply/reply";
import { Message } from "@arco-design/web-vue";
import { getShopList } from "../../api/shopLibrary/shopList";

export default {
  name: "sizePage",
  setup() {
    // 变量
    //修改所属角色弹窗
    const modal = ref(false);
    // 配置商品弹窗
    const configCommodityModal = ref(false);
    // 商品数组
    const commodityData = reactive([]);
    // 选中的商品数组
    const selCommodityData = reactive([1, 2, 3]);
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
    // 尺码表table
    const sizeTable = reactive([
      {
        label: "体重/身高",
        value: [
          "小于100",
          "101-105",
          "106-110",
          "111-115",
          "116-120",
          "121-125",
          "126-130",
          "大于130",
        ],
      },
      {
        label: "小于160cm",
        value: ["", "", "", "", "", "", "", ""],
      },
      {
        label: "160-165cm",
        value: ["", "", "", "", "", "", "", ""],
      },
      {
        label: "166-170cm",
        value: ["", "", "", "", "", "", "", ""],
      },
      {
        label: "170-175cm",
        value: ["", "", "", "", "", "", "", ""],
      },
      {
        label: "大于175cm",
        value: ["", "", "", "", "", "", "", ""],
      },
    ]);

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
    // 选中的商品数据
    const changeTransfer = (value) => {
      // value是选中的值的下标
      selCommodityData.length = 0;
      value.forEach((item) => {
        selCommodityData.push(commodityData[item].value);
      });
    };
    // 绑定商品-打开弹窗
    const bindCommodity = (item) => {
      lineValue.ID = item.ID;
      configCommodityModal.value = true;
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
      // log的这个数组就是选中的商品数组
      console.log(selCommodityData);

      // let res = await updateReply(lineValue);
      // if (res) {
      //   Message.success("配置成功");
      //   modal.value = false;
      //   getReplyList();
      // } else {
      //   Message.error("配置失败,请稍后重试");
      // }
    };
    // 尺码表弹窗获取输入框内容
    const blurSize = (index, index1, item) => {
      sizeTable[index].value[index1] = item.target._value;
    };
    // 保存尺码表配置
    const subSize = () => {
      console.log(sizeTable);
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
    // 获取商品列表
    const getShop = async () => {
      let params = {
        page: 1,
        pageSize: 10000,
        shopId: shopId,
      };
      let res = await getShopList(params);
      if (res.code == 0) {
        commodityData.length = 0;
        res.data.list.forEach((item) => {
          let list = {
            label: item.name,
            value: item.merchantId,
          };
          commodityData.push(list);
        });
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
      getShop();
      getReplyList();
    });
    return {
      sizeTable,
      selCommodityData,
      commodityData,
      shopId,
      resArr,
      searchTableData,
      lineValue,
      tableData,
      search,
      modal,
      configCommodityModal,
      blurSize,
      subSize,
      bindCommodity,
      changeTransfer,
      sub,
      changeStatus,
      edit,
      getReplyList,
      searchFn,
      changePageSize,
      changePage,
      getShop,
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
    .transfer {
      .noSelCommodity {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: var(--main-backgroundColor);
        .left {
          display: flex;
          align-items: center;
          .text {
            color: var(--main-fontColor1);
            font-family: PingFang SC;
            font-weight: 500;
            margin-left: 8px;
          }
        }
        .sel_noSel {
          font-family: PingFang SC;
          font-size: 12px;
          color: var(--main-fontColor3);
        }
        .delLogo {
          font-size: 12px;
          color: var(--main-fontColor3);
          cursor: pointer;
        }
      }
      ::v-deep .arco-input-wrapper {
        background-color: var(--main-backgroundColor);
        &:hover {
          background-color: var(--main-btnHoverColor);
        }
      }
      ::v-deep .arco-transfer-list-item:hover {
        background-color: var(--main-btnHoverColor);
      }
      ::v-deep .arco-transfer-view {
        height: 480px;
        width: 240px;
      }
    }
    .top {
      display: flex;
      align-items: center;
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
    .sizeTable {
      .label {
        color: var(--main-fontColor2);
        font-weight: bold;
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }
      .value {
        display: flex;
        .tr {
          flex-shrink: 0;
          width: 121px;
          height: 48px;
          line-height: 48px;
          text-align: center;
          background: #f7f8fc;
          font-weight: bold;
          font-size: 14px;
          color: var(--main-fontColor1);
          border-top: 1px solid var(--main-borderColor);
          border-left: 1px solid var(--main-borderColor);
          &:last-child {
            border-right: 1px solid var(--main-borderColor);
            width: 122px;
            .tdBox > .td {
              border-right: 1px solid var(--main-borderColor);
            }
          }
          &:first-child > .tdBox > .td {
            background: #f7f8fc;
          }
          .tdBox {
            .td {
              width: 120px;
              height: 48px;
              line-height: 48px;
              text-align: center;
              border-top: 1px solid var(--main-borderColor);
              border-left: 1px solid var(--main-borderColor);
              &:last-child {
                border-bottom: 1px solid var(--main-borderColor);
              }
              .input {
                width: 96px;
                height: 32px;
                line-height: 32px;
                background: #f7f8fc;
                &:hover {
                  background: #f7f8fc;
                }
              }
            }
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