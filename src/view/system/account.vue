<!-- 
  通用问答知识库
 -->
<template>
  <div class="general">
    <div class="tableBox">
      <div class="top">
        <div class="numIssue">共 {{ search.total }} 个账号</div>
        <div class="right">
          <a-input-search
            placeholder="搜索账号名称"
            class="input"
            v-model="search.nickName"
            @press-enter="searchFn"
          />
        </div>
      </div>
      <a-table :data="tableData" :pagination="false" :sticky-header="100" class="table">
        <template #columns>
          <a-table-column :width="50">
            <template #cell="{ record }">
              <a-checkbox
                :model-value="record.isChecked"
                @click="checkedLine(record)"
                v-if="record.authorityId != '888'"
              ></a-checkbox>
            </template>
          </a-table-column>
          <a-table-column
            title="账号名称"
            data-index="nickName"
          ></a-table-column>
          <a-table-column title="所属角色" data-index="authority.authorityName">
            <template #cell="{ record }">
              <div v-if="record.authority.authorityName == ''">-</div>
              <div v-else>{{ record.authority.authorityName }}</div>
            </template>
          </a-table-column>
          <a-table-column title="创建时间" data-index="CreatedAt">
          </a-table-column>
          <a-table-column title="账号状态" data-index="enable">
            <template #cell="{ record }">
              <div v-if="record.enable == 1" class="enable">
                <span style="background: #00b42a"></span>正常
              </div>
              <div v-if="record.enable != 1">
                <span style="background: #f53f3f"></span>已停用
              </div>
            </template>
          </a-table-column>
          <a-table-column title="操作" data-index="option">
            <template #cell="{ record }">
              <a-button
                type="text"
                class="btn"
                @click="changePassword()"
                v-if="uuid == record.uuid"
                >修改密码</a-button
              >
              <a-button
                type="text"
                class="btn"
                @click="editRole(record)"
                v-if="record.authorityId == '' && uuid != record.uuid"
                >分配角色</a-button
              >
              <a-button
                type="text"
                class="btn"
                @click="editRole(record)"
                v-if="record.authorityId != '' && uuid != record.uuid"
                >修改所属角色</a-button
              >
              <a-popconfirm
                content="停用后可重新启用，确认要停用吗？"
                type="warning"
                position="tr"
                @ok="del('only', record.ID)"
                v-if="uuid != record.uuid"
              >
                <a-button
                  type="text"
                  class="btn"
                  style="color: #ff1600"
                  v-if="uuid != record.uuid && record.enable == 1"
                >
                  停用
                </a-button>
              </a-popconfirm>
              <a-button
                type="text"
                class="btn"
                @click="editRole(record)"
                v-if="uuid != record.uuid && record.enable != 1"
                >启用</a-button
              >
            </template>
          </a-table-column>
        </template>
      </a-table>
      <div class="tableOption">
        <div class="left">
          <a-checkbox :model-value="checkedTableAll" @click="allChecked"
            >全选</a-checkbox
          >
          <a-popconfirm
            content="确定要停用吗?"
            type="warning"
            position="right"
            @ok="del('move', '')"
          >
            <a-button class="btn">停用选中项</a-button>
          </a-popconfirm>
        </div>
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
  <a-modal v-model:visible="passwordModel" :width="400" class="model">
    <template #title>
      <div class="title">修改密码</div>
    </template>
    <div class="content">
      <div class="item">
        <div class="lable">
          <div class="icon">*</div>
          <div class="text">原密码</div>
        </div>
        <a-input
          v-model="passWord.password"
          placeholder="请输入原密码"
          class="input"
        />
      </div>
      <div class="item">
        <div class="lable">
          <div class="icon">*</div>
          <div class="text">新密码</div>
        </div>
        <a-input
          v-model="passWord.newPassword"
          placeholder="请输入新密码"
          class="input"
        />
      </div>
      <div class="item">
        <div class="lable">
          <div class="icon">*</div>
          <div class="text">确认新密码</div>
        </div>
        <a-input placeholder="请再次输入新密码" class="input" />
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <a-button class="sub" @click="subChangePassword">确定修改</a-button>
        <a-button class="cancel" @click="passwordModel = false">取消</a-button>
      </div>
    </template>
  </a-modal>
  <a-modal v-model:visible="roleModel" :width="400" class="model">
    <template #title>
      <div class="title">所属角色</div>
    </template>
    <div class="content">
      <div class="item">
        <div class="lable">
          <div class="icon">*</div>
          <div class="text">选择所属角色</div>
        </div>
        <a-select
          v-model="changeRoleList.authorityId"
          placeholder="请选择所属角色"
        >
          <a-option
            v-for="item in roleList"
            :key="item.authorityId"
            :value="item.authorityId"
            :label="item.authorityName"
          >
          </a-option>
        </a-select>
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <a-button class="sub" @click="changeRole">确定修改</a-button>
        <a-button class="cancel" @click="roleModel = false">取消</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import {
  getAccount,
  changePasswordAccount,
  changeAccountRole,
  delAccount,
} from "../../api/system/account";
import { getRole } from "../../api/system/role";
import { formDate } from "../../utils/public";
import { fuzzySearch } from "../../utils/public";
import { Message } from "@arco-design/web-vue";

export default {
  name: "diyPage",
  setup() {
    // 变量
    // 编辑账号所属角色暂存当行id
    const lineId = ref();
    // 编辑账号所属角色数据暂存
    const changeRoleList = reactive({
      authorityId: null,
      authorityName: "",
    });
    // 角色列表
    const roleList = reactive([]);
    //我的uuid
    const uuid = sessionStorage.getItem("userInfo")
      ? JSON.parse(sessionStorage.getItem("userInfo")).uuid
      : null;
    //表格全选
    const checkedTableAll = ref(false);
    //修改密码弹窗
    const passwordModel = ref(false);
    //修改所属角色弹窗
    const roleModel = ref(false);
    //弹窗详情title
    const modelTitle = ref("问答详情");
    //弹窗按钮名称
    const modelBtnText = ref("确定修改");
    //搜索参数
    const search = reactive({
      total: 0,
      page: 1,
      pageSize: 20,
      nickName: "",
    });
    // 修改密码参数
    const passWord = reactive({
      newPassword: "",
      password: "",
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

    // 表格单选
    const checkedLine = (item) => {
      item.isChecked = !item.isChecked;
      let num = 0;
      tableData.forEach((item) => {
        if (item.isChecked) {
          num++;
        }
      });
      if (num == tableData.length - 1) {
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
          if (item.authorityId != "888") {
            item.isChecked = true;
          }
        });
      } else {
        tableData.forEach((item) => {
          item.isChecked = false;
        });
      }
    };
    // 修改密码弹窗
    const changePassword = () => {
      passwordModel.value = true;
    };
    // 修改密码提交
    const subChangePassword = async () => {
      let res = await changePasswordAccount(passWord);
      if (res.code == 0) {
        passwordModel.value = false;
        passWord.newPassword = "";
        passWord.password = "";
        getRoleList();
      }
    };
    // 编辑角色
    const editRole = (item) => {
      changeRoleList.authorityId =
        item.authorityId == 0 ? "" : item.authorityId;
      changeRoleList.authorityName = item.authorityName;
      lineId.value = item.ID;
      roleModel.value = true;
    };
    // 删除
    const del = async (type, id) => {
      let params = {
        id,
      };
      if (type == "move") {
        let arr = [];
        tableData.forEach((item) => {
          if (item.isChecked) {
            arr.push(item.ID);
          }
        });
        if (arr.length == 0) {
          Message.error("请先选择停用项！");
          return;
        }
      } else if (type == "only") {
        let res = await delAccount(params);
        if (res.code == 0) {
          getAccountFn();
        }
      }
    };
    // 提交编辑/修改所属角色
    const changeRole = async () => {
      let params = {
        authorityIds: [changeRoleList.authorityId],
        id: lineId.value,
      };
      let res = await changeAccountRole(params);
      if (res.code == 0) {
        roleModel.value = false;
        getAccountFn();
      }
    };
    // 获取账号列表
    const getAccountFn = async () => {
      tableData.length = 0;
      resArr.length = 0;
      let params = {
        page: 1,
        pageSize: 10000,
        shopId: shopId,
      };
      let res = await getAccount(params);
      if (res.code == 0) {
        resArr.push(...res.data.list);
        resArr.forEach((item) => {
          item.CreatedAt = formDate(item.CreatedAt, "2");
          item.isChecked = false;
        });
        search.total = res.data.total;
        tableData.length = 0;
        tableData.push(...resArr.slice(0, search.pageSize));
      } else {
        Message.error("页面加载失败，请稍后重试");
      }
    };
    // 获取所有角色列表
    const getRoleList = async () => {
      let params = {
        page: 1,
        pageSize: 100,
      };
      let res = await getRole(params);
      if (res.code == 0) {
        roleList.push(...res.data.list);
        for (let i = 0; i < roleList.length; i++) {
          if (roleList[i].authorityId == 888) {
            roleList.splice(i, 1);
          }
        }
      }
    };
    // 列表搜索查询
    const searchFn = () => {
      tableData.length = 0;
      searchTableData.length = 0;
      if (search.nickName != "") {
        searchTableData.push(
          ...fuzzySearch(resArr, "nickName", search.nickName)
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
      getAccountFn();
      getRoleList();
    });
    return {
      shopId,
      resArr,
      searchTableData,
      lineId,
      changeRoleList,
      roleList,
      uuid,
      passWord,
      checkedTableAll,
      tableData,
      search,
      passwordModel,
      roleModel,
      modelTitle,
      modelBtnText,
      changePassword,
      del,
      allChecked,
      editRole,
      changeRole,
      getAccountFn,
      subChangePassword,
      getRoleList,
      checkedLine,
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
      .enable {
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
      ::v-deep .arco-select-view-single {
        background-color: var(--main-backgroundColor) !important;
      }
      ::v-deep .arco-select-view-single:hover {
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