<!-- 
  通用问答知识库
 -->
<template>
  <div class="role">
    <div class="tableBox">
      <div class="top">
        <div class="numIssue">共 {{ search.total }} 个角色</div>
        <div class="right">
          <a-button class="btn" @click="open('添加角色')">
            <div class="icon-add"></div>
            添加角色
          </a-button>
        </div>
      </div>
      <a-table :data="tableData" :pagination="false" class="table">
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
          <a-table-column title="角色名称" data-index="authorityName">
          </a-table-column>
          <a-table-column
            title="创建时间"
            data-index="CreatedAt"
          ></a-table-column>
          <a-table-column title="操作" data-index="option">
            <template #cell="{ record }">
              <a-button
                type="text"
                class="btn"
                @click="openJurisdiction(record)"
                v-if="record.authorityId != '888'"
                >分配权限</a-button
              >
              <a-button
                type="text"
                class="btn"
                @click="editRole(record)"
                v-if="record.authorityId != '888'"
                >编辑</a-button
              >
              <a-popconfirm
                content="删除之后不可恢复，确定要删除吗？"
                type="warning"
                position="tr"
                @ok="del('only', record.authorityId)"
                v-if="record.authorityId != '888'"
              >
                <a-button type="text" class="btn" style="color: #ff1600">
                  删除
                </a-button>
              </a-popconfirm>
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
            content="确定要删除吗?"
            type="warning"
            position="right"
            @ok="del('move', '')"
          >
            <a-button class="btn">删除选中项</a-button>
          </a-popconfirm>
        </div>
        <a-pagination
          :total="search.total"
          v-model:page-size="search.pageSize"
          @page-size-change="changePageSize"
          @change="changePage"
          show-total
          show-jumper
          show-page-size
        />
      </div>
    </div>
  </div>
  <!-- 配置权限 -->
  <a-modal v-model:visible="jurisdictionModel" :width="800" class="model">
    <template #title>
      <div class="title">分配权限</div>
    </template>
    <div class="content">
      <div class="item" v-for="item in menuList" :key="item.id">
        <div class="lable">{{ item.meta.title }}</div>
        <div class="valueModel" v-for="item1 in item.children" :key="item1.id">
          <a-checkbox class="left" v-model="item1.isChecked">{{
            item1.meta.title
          }}</a-checkbox>
          <div class="right" v-if="item1.children && item1.children.length > 0">
            <a-checkbox
              :model-value="item1.isChecked"
              @change="changeCheckedAll($event, item1)"
              class="checkbox"
            >
              全选
            </a-checkbox>
            <a-checkbox-group
              v-model="selJurisdictionArr"
              @change="checkedJurisdiction($event, item1)"
            >
              <a-checkbox
                v-for="item2 in item1.children"
                :value="item2.id"
                :key="item2.id"
                class="checkbox"
              >
                {{ item2.name }}
              </a-checkbox>
            </a-checkbox-group>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <a-button class="sub" @click="saveSettings">保存设置</a-button>
        <a-button class="cancel" @click="jurisdictionModel = false">
          取消
        </a-button>
      </div>
    </template>
  </a-modal>
  <a-modal v-model:visible="roleModel" :width="400" class="model">
    <template #title>
      <div class="title">{{ modelTitle }}</div>
    </template>
    <div class="content">
      <div class="item">
        <div class="lable">
          <div class="icon">*</div>
          <div class="text">角色名称</div>
        </div>
        <a-input
          v-model="roleName"
          placeholder="请输入角色名称"
          class="input"
        />
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <a-button class="sub" @click="changeRole">{{ modelBtnText }}</a-button>
        <a-button class="cancel" @click="roleModel = false">取消</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import {
  getRole,
  deployRoleJurisdiction,
  delRole,
  createRole,
  updateRole,
} from "../../api/system/role";
import { getMenu, getAssignUserMenu } from "../../api/menu/index";
import {
  updateCheckedStatus,
  flattenChildren,
  formDate,
} from "../../utils/public";
import { Message } from "@arco-design/web-vue";

export default {
  name: "diyPage",
  setup() {
    // 变量
    // 角色名称
    const roleName = ref("");
    // 选中行id
    const lineId = ref();
    // 所有菜单列表
    const menuList = reactive([]);
    //表格全选
    const checkedTableAll = ref(false);
    //分权弹窗
    const jurisdictionModel = ref(false);
    //修改所属角色弹窗
    const roleModel = ref(false);
    //弹窗详情title
    const modelTitle = ref("问答详情");
    //弹窗按钮名称
    const modelBtnText = ref("确定添加");
    //搜索参数
    const search = reactive({
      total: 0,
      page: 1,
      pageSize: 10,
    });
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
    //表格数据
    const tableData = reactive([]);
    // 后台返回数据
    const resArr = reactive([]);
    // 获取shopId
    const shopId = sessionStorage.getItem("userInfo")
      ? JSON.parse(sessionStorage.getItem("userInfo")).shopId
      : 0;
    // 分配权限当行选中的内容
    const selJurisdictionArr = ref([]);

    // 方法
    //打开弹窗
    const open = (type) => {
      lineId.value = 0;
      modelTitle.value = type;
      modelBtnText.value = "确定添加";
      roleModel.value = true;
    };
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
    // 打开分权配置弹窗
    const openJurisdiction = (item) => {
      lineId.value = item.authorityId;
      getAssignUserMenuFn();
    };
    // 编辑角色
    const editRole = (item) => {
      lineId.value = item.authorityId;
      modelTitle.value = "编辑角色";
      modelBtnText.value = "确定编辑";
      roleName.value = item.authorityName;
      roleModel.value = true;
    };
    // 删除
    const del = async (type, id) => {
      let params = {
        authorityId: id,
      };
      if (type == "move") {
        console.log(123);
      } else if (type == "only") {
        let res = await delRole(params);
        if (res.code == 0) {
          getRoleFn();
        }
      }
    };
    // 提交编辑/修改角色
    const changeRole = async () => {
      let params = {
        AuthorityId: lineId.value,
        authorityName: roleName.value,
        parentId: 0, //现阶段只有一级角色，没有角色的下级
      };
      let res;
      if (modelTitle.value == "添加角色") {
        res = await createRole(params);
      } else {
        res = await updateRole(params);
      }
      if (res.code == 0) {
        getRoleFn();
        roleName.value = "";
        roleModel.value = false;
      }
    };
    // 保存分配权限设置
    const saveSettings = async () => {
      let menus = flattenChildren(menuList);
      for (let i = 0; i < menus.length; i++) {
        if (!menus[i].isChecked) {
          menus.splice(i, 1);
          i--;
        }
      }
      let params = {
        authorityId: lineId.value,
        menus,
      };
      let res = await deployRoleJurisdiction(params);
      if (res.code == 0) {
        getRoleFn();
        jurisdictionModel.value = false;
      }
    };
    // 分配权限全选
    const changeCheckedAll = (e, item) => {
      item.isChecked = e;
      if (e) {
        item.children.forEach((item1) => {
          selJurisdictionArr.value.push(item1.id);
        });
      } else {
        selJurisdictionArr.value = [];
      }
    };
    // 分配权限单选
    const checkedJurisdiction = (e, item) => {
      selJurisdictionArr.value = e;
      if (selJurisdictionArr.value.length == item.children.length) {
        item.isChecked = true;
      } else {
        item.isChecked = false;
      }
    };
    // 获取角色列表
    const getRoleFn = async () => {
      tableData.length = 0;
      resArr.length = 0;
      let params = {
        page: 1,
        pageSize: 1000,
        shopId: shopId,
      };
      let res = await getRole(params);
      if (res.code == 0) {
        resArr.push(...res.data.list);
        resArr.forEach((item) => {
          delete item.children;
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
    // 获取所有菜单
    const getMenuFn = async () => {
      menuList.length = 0;
      let params = {
        page: 1,
        pageSize: 100,
      };
      let res = await getMenu(params);
      if (res.code == 0) {
        menuList.push(...allMenuFn(res.data.menus));
      }
    };
    // 将所有的菜单列表中加入一个键值对
    const allMenuFn = (arr) => {
      return arr.map((item) => {
        const newItem = { ...item, isChecked: false };
        if (Array.isArray(item.children)) {
          newItem.children = allMenuFn(item.children);
        }
        // 返回更新后的对象
        return newItem;
      });
    };
    // 获取指定菜单
    const getAssignUserMenuFn = async () => {
      let params = {
        authorityId: lineId.value,
      };
      let res = await getAssignUserMenu(params);
      if (res.code == 0) {
        if (res.data.menus) {
          const recoverMenuArr = recoverMenu(menuList);
          const arr = updateCheckedStatus(recoverMenuArr, res.data.menus);
          menuList.length = 0;
          menuList.push(...arr);
        } else {
          getMenuFn();
        }
        jurisdictionModel.value = true;
      }
    };
    // 将菜单所有的ischecked变为false
    const recoverMenu = (arr) => {
      const res = arr;
      res.forEach((item) => {
        item.isChecked = false;
        if (item.children && item.children.length > 0) {
          recoverMenu(item.children);
        }
      });
      return res;
    };
    // 分页数量变化
    const changePageSize = (num) => {
      search.pageSize = num;
      tableData.length = 0;
      search.page = 1;
      tableData.push(...resArr.slice(0, search.pageSize));
    };
    // 分页页码变化
    const changePage = (num) => {
      search.page = num;
      tableData.length = 0;
      if (num == 1) {
        tableData.push(...resArr.slice(0, search.pageSize));
      } else {
        let first = (num - 1) * search.pageSize;
        tableData.push(...resArr.slice(first, first + search.pageSize));
      }
    };
    onMounted(() => {
      getRoleFn();
      getMenuFn();
    });
    return {
      resArr,
      shopId,
      roleName,
      lineId,
      menuList,
      checkedTableAll,
      tableData,
      search,
      jurisdictionModel,
      roleModel,
      modelTitle,
      form,
      modelBtnText,
      selJurisdictionArr,
      openJurisdiction,
      del,
      allChecked,
      editRole,
      changeRole,
      open,
      changeCheckedAll,
      checkedJurisdiction,
      getRoleFn,
      getMenuFn,
      saveSettings,
      getAssignUserMenuFn,
      allMenuFn,
      checkedLine,
      changePage,
      changePageSize,
      recoverMenu,
    };
  },
};
</script>
<style lang='scss' scoped>
.role {
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

        ::v-deep .btn:hover {
          background-color: var(--main-btnHoverColor1);
        }
        ::v-deep .btn:active {
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
    ::v-deep .cancel:hover {
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