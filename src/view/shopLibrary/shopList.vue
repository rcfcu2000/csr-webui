<!-- 
  通用问答知识库
 -->
<template>
  <div class="general">
    <div class="dataNone" v-if="isNone">
      <div class="icon-empty"></div>
      <div class="text1">暂未添加任何商品</div>
      <div class="text2">
        添加商品后，AI即可读取商品信息从而更精准地生成回复
      </div>
      <div class="option">
        <a-button type="primary" class="btn" @click="open('添加商品')"
          >手动添加</a-button
        >
        <a-button type="primary" class="btn" @click="open('Excel')"
          >Excel添加</a-button
        >
      </div>
    </div>
    <div class="tableBox" v-else>
      <div class="top">
        <div class="left">
          <a-radio-group type="button" v-model="viewType" class="radioGroup">
            <a-radio value="0">卡片视图</a-radio>
            <a-radio value="1">表格视图</a-radio>
          </a-radio-group>
          <div class="numIssue">共 {{ search.total }} 个商品</div>
        </div>
        <div class="right">
          <a-input-search
            placeholder="搜索商品标题/系列/标签"
            v-model="search.name"
            @press-enter="searchFn"
            class="input"
          />
          <!-- <div class="btnBox">
            <a-button class="btn" @click="openAiListModal">
              <template #icon>
                <div class="icon-AI"></div>
              </template>
              <template #default>AI识别队列</template>
            </a-button>
          </div> -->
          <a-dropdown class="dropdown">
            <a-button>添加商品<icon-down /></a-button>
            <template #content>
              <a-doption @click="open('添加商品')">
                <template #icon>
                  <div class="icon-manual"></div>
                </template>
                <template #default>手动添加</template>
              </a-doption>
              <a-doption @click="open('Excel')">
                <template #icon>
                  <div class="icon-Excel"></div>
                </template>
                <template #default>Excel添加</template>
              </a-doption>
              <!-- <a-doption @click="open('AI识别添加')">AI识别添加</a-doption> -->
            </template>
          </a-dropdown>
        </div>
      </div>
      <a-table
        :data="tableData"
        :pagination="false"
        class="table"
        :sticky-header="100"
        v-if="viewType == '1'"
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
          <a-table-column title="商品" data-index="name">
            <template #cell="{ record }">
              <div class="record">
                <a-image :src="record.pictureLink" class="img">
                  <template #error-icon>
                    <img src="../../image/imgError.png" class="imgError" />
                  </template>
                </a-image>
                <div class="shopName">{{ record.name }}</div>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="商品链接" data-index="link">
            <template #cell="{ record }">
              <div>
                <a-link
                  :href="'https://item.taobao.com/item.htm?id=' + item.taobaoId"
                  target="_blank"
                  class="link"
                  v-for="(item, index) in record.merchantLinks"
                  :key="index"
                >
                  https://item.taobao.com/item.htm?id={{ item.taobaoId }}
                </a-link>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="操作" data-index="option" :width="180">
            <template #cell="{ record }">
              <a-button type="text" class="btn" @click="detail(record)"
                >详情</a-button
              >
              <a-button type="text" class="btn" @click="edit(record)"
                >编辑</a-button
              >
              <a-popconfirm
                content="删除之后不可恢复，确定要删除吗？"
                type="warning"
                position="tr"
                @ok="del('tableLine', record.merchantId)"
              >
                <a-button type="text" class="btn" style="color: #ff1600">
                  删除
                </a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>

        <!-- <template #detail>
          <div class="tableTitle">
            <div class="name">商品卡详细度</div>
            <a-tooltip
              content="商品卡信息越详细，AI助手生成的文案越精准"
              :content-style="{
                width: '200px',
                fontSize: '12px',
                borderRadius: '4px',
              }"
            >
              <icon-question-circle class="icon" />
            </a-tooltip>
          </div>
        </template>
        <template #detailValue="{ record }">
          <a-progress
            :percent="record.detail"
            :show-text="false"
            :width="268"
            :stroke-width="8"
            :animation="true"
            :status="
              record.detail < 0.33
                ? 'danger'
                : record.detail < 0.66
                ? 'warning'
                : 'success'
            "
          />
        </template>
        <template #tag="{ record }">
          <div class="tagBox">
            <div v-for="(item, index) in record.tag" :key="index" class="item">
              {{ item }}
            </div>
          </div>
        </template> -->
      </a-table>
      <div class="cardBox" v-if="viewType == '0'">
        <div class="cardItem" v-for="(item, index) in tableData" :key="index">
          <div class="left">
            <a-image :src="item.pictureLink" class="image">
              <template #error-icon>
                <img src="../../image/imgError.png" class="imgError" />
              </template>
            </a-image>
          </div>
          <div class="right">
            <div class="title">{{ item.name }}</div>
            <div class="option">
              <a-button type="text" class="btn" @click="detail(item)"
                >详情</a-button
              >
              <a-button type="text" class="btn" @click="edit(item)"
                >编辑</a-button
              >
              <a-popconfirm
                content="删除之后不可恢复，确定要删除吗？"
                type="warning"
                position="tr"
                @ok="del('card', item.merchantId)"
              >
                <a-button type="text" class="btn" style="color: #ff1600">
                  删除
                </a-button>
              </a-popconfirm>
            </div>
          </div>
        </div>
      </div>
      <div class="tableOption">
        <div class="left">
          <a-checkbox
            :model-value="checkedTableAll"
            @click="allChecked"
            v-if="viewType == '1'"
            >全选</a-checkbox
          >
          <a-popconfirm
            content="确定要删除吗?"
            type="warning"
            position="right"
            @ok="del('move', '')"
            v-if="viewType == '1'"
          >
            <a-button class="btn">删除选中项</a-button>
          </a-popconfirm>
        </div>
        <a-pagination
          @page-size-change="changePageSize"
          @change="changePage"
          :total="search.total"
          :page-size="search.pageSize"
          :current="search.page"
          show-total
          show-jumper
          show-page-size
        />
      </div>
    </div>
  </div>
  <!-- 手动上传 -->
  <a-modal
    v-model:visible="artificialModel"
    :width="800"
    class="artificialModel"
  >
    <template #title>
      <div class="title">{{ artificialTitle }}</div>
    </template>
    <div class="content">
      <a-alert class="alert" v-if="artificialTitle != '编辑商品'">
        <div class="text">添加商品之前，请务必先下载并阅读说明文档！</div>
        <a-button type="text" @click="download('pdf')">
          <div class="icon-download"></div>
          <div class="text">下载说明文档</div>
        </a-button>
      </a-alert>
      <div class="itemGather">
        <div class="item">
          <div class="label">
            <div class="icon">*</div>
            <div class="text">商品简称</div>
          </div>
          <a-input
            class="input input1"
            placeholder="请输入商品标题"
            v-model="lineValue.name"
          />
        </div>
        <div class="item">
          <div class="label">
            <div class="text">商品封面图</div>
          </div>
          <a-upload :custom-request="uploadShopImg" :show-file-list="false">
            <template #upload-button>
              <a-image
                :src="lineValue.pictureLink"
                v-if="lineValue.pictureLink != ''"
                class="image"
              />
              <div class="arco-upload-picture-card-text" v-else>
                <IconPlus />
              </div>
            </template>
          </a-upload>
        </div>
      </div>
      <div class="item">
        <div class="label">
          <div class="icon">*</div>
          <div class="text">商品链接</div>
        </div>
        <div class="inputs">
          <div
            class="inputBox"
            v-for="(item, index) in lineValue.merchantLinks"
            :key="index"
          >
            <a-input
              placeholder="请输入商品链接"
              class="input"
              v-model="item.link"
              @blur="isLink(index)"
              allow-clear
            />
            <icon-delete
              class="del"
              @click="delLinks(index)"
              v-if="lineValue.merchantLinks.length > 1"
            />
          </div>
          <a-button class="cancel" type="dashed" @click="addLinks">
            <template #icon>
              <icon-plus />
            </template>
            添加链接
          </a-button>
        </div>
      </div>
      <div class="item">
        <div class="label">
          <div class="text">商品信息</div>
        </div>
        <a-textarea
          class="textarea"
          placeholder="请输入商品信息"
          v-model="lineValue.info"
          @blur="blurTextarea"
        />
      </div>
      <!-- <div class="itemGather">
        <div class="item">
          <div class="label">
            <div class="text">商品系列</div>
          </div>
          <a-input
            placeholder="请输入商品系列"
            class="input input2"
            allow-clear
          />
        </div>
        <div class="item">
          <div class="label">
            <div class="text">商品标签</div>
          </div>
          <a-select placeholder="请输入商品标签" multiple>
            <a-option>Beijing</a-option>
            <a-option>Shanghai</a-option>
          </a-select>
        </div>
      </div>
      <div class="item">
        <div class="label">
          <div class="text">商品参数</div>
        </div>
        <div class="itemSub">
          <div class="labelSub">材质：</div>
          <a-input placeholder="请输入材质" class="input input3" allow-clear />
        </div>
        <div class="itemSub">
          <div class="labelSub">尺寸：</div>
          <a-input placeholder="请输入尺寸" class="input input3" allow-clear />
        </div>
        <div class="itemSub">
          <div class="labelSub">风格：</div>
          <a-input placeholder="请输入风格" class="input input3" allow-clear />
        </div>
        <div class="itemSub">
          <div class="labelSub">功能：</div>
          <a-input placeholder="请输入功能" class="input input3" allow-clear />
        </div>
        <div class="itemSub">
          <div class="labelSub">适用空间：</div>
          <a-input
            placeholder="请输入适用空间"
            class="input input3"
            allow-clear
          />
        </div>
        <div class="itemSub">
          <div class="labelSub">品牌：</div>
          <a-input placeholder="请输入品牌" class="input input3" allow-clear />
        </div>
        <div class="itemSub">
          <div class="labelSub">清洁方式：</div>
          <a-input
            placeholder="请输入清洁方式"
            class="input input3"
            allow-clear
          />
        </div>
        <div class="itemSub">
          <div class="labelSub">维护方式：</div>
          <a-input
            placeholder="请输入维护方式"
            class="input input3"
            allow-clear
          />
        </div>
        <div
          class="itemSub"
          v-for="(item, index) in shopParameters"
          :key="index"
        >
          <a-input placeholder="参数名" class="input input4" allow-clear />
          <a-input
            placeholder="请输入参数值"
            class="input input3"
            allow-clear
          />
        </div>
        <a-button class="cancel" type="dashed" @click="addLinks">
          <template #icon>
            <icon-plus />
          </template>
          添加参数
        </a-button>
        <div class="tips">
          注：添加参数有助于AI更加精准的生成回复文案，推荐填写。
        </div>
      </div>
      <div class="item">
        <div class="label">
          <div class="text">商品卖点</div>
        </div>
        <a-textarea
          auto-size
          placeholder="请输入商品卖点"
          :max-length="200"
          class="textarea"
        />
      </div> -->
    </div>
    <template #footer>
      <div class="footer">
        <a-button class="sub" @click="subEdit">{{ modelBtnText }}</a-button>
        <a-button class="cancel" @click="artificialModel = false"
          >取消</a-button
        >
      </div>
    </template>
  </a-modal>
  <!-- AI上传 -->
  <!-- <a-modal
    v-model:visible="AIRecognitionModel"
    :width="800"
    class="AIRecognitionModel"
  >
    <template #title>
      <div class="title">{{ AIRecognitionTitle }}</div>
    </template>
    <div class="content">
      <a-alert>
        识别将于每日 06:00、20:00 进行两轮，预估识别时间为2小时。
      </a-alert>
      <div class="item">
        <div class="label">
          <div class="text">商品详情图</div>
        </div>
        <a-upload
          draggable
          :multiple="true"
          :custom-request="uploadAIImg"
          :limit="30"
          :show-file-list="false"
        >
          <template #upload-button>
            <div class="upload1" v-if="aiImgArr.length == 0">
              <div class="option">
                <icon-plus class="icon" />
                <div class="text">点击或拖拽图片到此处上传</div>
                <div class="tips">
                  支持 .jpg、.png、.jpeg 格式图片，单张不超过 2MB
                </div>
              </div>
            </div>
            <div class="upload1 upload2" v-else>
              <div class="option">
                <icon-plus class="icon" />
                <div class="text">添加</div>
              </div>
            </div>
          </template>
        </a-upload>
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <a-button class="sub" @click="submit">{{ modelBtnText }}</a-button>
        <a-button class="cancel" @click="artificialModel = false"
          >取消</a-button
        >
      </div>
    </template>
  </a-modal> -->
  <!-- AI上传队列 -->
  <!-- <a-modal
    v-model:visible="AIListModel"
    :width="990"
    :footer="false"
    class="AIListModel"
  >
    <template #title>
      <div class="title">AI识别队列</div>
    </template>
    <div class="content">
      <a-table
        :columns="AIRecognitionColumns"
        :data="AIRecognitionData"
        class="table"
      >
        <template #state="{ record }">
          <div>
            <a-badge color="red" :text="record.state" />
            <a-badge color="gold" :text="record.state" />
            <a-badge color="green" :text="record.state" />
          </div>
        </template>
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
                style="color: #ff1600; margin-left: 16px"
              >
                取消识别
              </a-button>
            </a-popconfirm>
          </a-table-column>
        </template>
      </a-table>
    </div>
  </a-modal> -->
  <!-- excel上传 -->
  <a-modal v-model:visible="excelModel" :width="648" class="excelModel">
    <template #title>
      <div class="title">添加商品</div>
    </template>
    <div class="content">
      <a-alert class="alert">
        <div class="text">添加商品之前，请务必先下载并阅读说明文档！</div>
        <a-button type="text" @click="download('pdf')">
          <div class="icon-download"></div>
          <div class="text">下载说明文档</div>
        </a-button>
        <a-button type="text" @click="download('excel')">
          <div class="icon-download"></div>
          <div class="text">下载模板</div>
        </a-button>
      </a-alert>
      <a-upload
        draggable
        :multiple="true"
        :file-list="excelList"
        :auto-upload="false"
        @change="uploadFile"
        :limit="1"
      >
        <template #upload-button>
          <div class="upload1">
            <div class="option">
              <icon-plus class="icon" />
              <div class="text">添加商品</div>
              <div class="tips">
                点击或拖拽到这里上传，文件格式为.xlsx，不超过5MB
              </div>
            </div>
          </div>
        </template>
      </a-upload>
    </div>
    <template #footer>
      <div class="footer">
        <a-button class="sub" @click="subUpload">立即添加</a-button>
        <a-button class="cancel" @click="artificialModel = false">
          取消
        </a-button>
      </div>
    </template>
  </a-modal>
  <!-- 商品详情 -->
  <a-modal v-model:visible="detailModel" :width="648" class="detailModel">
    <template #title>
      <div class="title">商品详情</div>
    </template>
    <div class="content">
      <div class="left">
        <a-image :src="lineValue.pictureLink" class="img" />
      </div>
      <div class="right">
        <div class="item">
          <div class="label">商品简称</div>
          <div class="value">{{ lineValue.name }}</div>
        </div>
        <div class="item">
          <div class="label">商品链接</div>
          <a-link
            :href="'https://item.taobao.com/item.htm?id=' + item.taobaoId"
            target="_blank"
            class="link"
            v-for="(item, index) in lineValue.merchantLinks"
            :key="index"
          >
            https://item.taobao.com/item.htm?id={{ item.taobaoId }}
          </a-link>
        </div>
        <div class="item">
          <div class="label">商品信息</div>
          <a-textarea
            v-model="lineValue.info"
            auto-size
            disabled
            class="textarea"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <a-popconfirm
          content="删除之后不可恢复，确定要删除吗？"
          type="warning"
          position="tr"
          @ok="del('detailModal', lineValue.merchantId)"
        >
          <a-button type="text" class="btn delSty">
            <icon-delete class="icon" />
            删除
          </a-button>
        </a-popconfirm>
        <a-button class="sub" @click="edit(lineValue)">
          <div class="icon-edit icon"></div>
          编辑
        </a-button>
      </div>
    </template>
  </a-modal>
  <!-- excel上传加载中 -->
  <a-modal
    v-model:visible="excelLoadingModal"
    :width="362"
    :footer="false"
    :hide-title="true"
    class="excelLoadingModal"
  >
    <div class="content">
      <a-spin dot class="spin" />
      <div class="text">系统解析中，可能需要几十秒，请耐心等待</div>
    </div>
  </a-modal>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { Message } from "@arco-design/web-vue";
import { getShopList, delShop, editShop } from "../../api/shopLibrary/shopList";
import axios from "axios";
import { upload } from "../../utils/upload";
import { fuzzySearch } from "../../utils/public";
export default {
  name: "diyPage",
  setup() {
    // 变量
    // 展示效果，tableData空展示null的界面，反正正常界面
    const isNone = ref(false);
    // 商品详情
    const detailModel = ref(false);
    // 当行商品数据
    const lineValue = reactive({
      CreatedAt: "",
      DeletedAt: "",
      UpdatedAt: "",
      name: "",
      alias: "",
      info: "",
      merchantId: "",
      merchantLinks: [],
      pictureLink: "",
      updatedBy: JSON.parse(sessionStorage.getItem("userInfo")).nickName
        ? JSON.parse(sessionStorage.getItem("userInfo")).nickName
        : "",
    });
    // 内容视图
    const viewType = ref("0");
    // // ai识别列表数据
    // const AIRecognitionData = reactive([
    //   {
    //     imgs: [],
    //     lastSubmissionTime: "2024-6-3 17:00:00",
    //     state: "wait",
    //   },
    //   {
    //     imgs: [],
    //     lastSubmissionTime: "2024-6-3 17:00:00",
    //     state: "wait",
    //   },
    //   {
    //     imgs: [],
    //     lastSubmissionTime: "2024-6-3 17:00:00",
    //     state: "wait",
    //   },
    // ]);
    // // ai识别列表表头
    // const AIRecognitionColumns = reactive([
    //   {
    //     title: "序号",
    //     slotName: "serialNumber",
    //     render: (data) => `${data.rowIndex + 1}`,
    //     width: 60,
    //   },
    //   {
    //     title: "商品详情图",
    //     slotName: "imgs",
    //     width: 470,
    //   },
    //   {
    //     title: "最后提交时间",
    //     dataIndex: "lastSubmissionTime",
    //     width: 170,
    //   },
    //   {
    //     title: "状态",
    //     slotName: "state",
    //     width: 100,
    //   },
    //   {
    //     title: "操作",
    //     slotName: "option",
    //     fixed: "right",
    //     width: 140,
    //   },
    // ]);
    // // ai识别图片数组
    // const aiImgArr = reactive([]);
    // //AI识别添加弹窗
    // const AIRecognitionModel = ref(false);
    // //AI识别列表弹窗
    // const AIListModel = ref(false);
    // //AI识别添加title
    // const AIRecognitionTitle = ref("AI识别添加");
    // 商品参数数组
    const shopParameters = reactive([
      {
        label: "",
        value: "",
      },
    ]);
    //表格全选
    const checkedTableAll = ref(false);
    //手动添加弹窗
    const artificialModel = ref(false);
    //excel添加弹窗
    const excelModel = ref(false);
    // excel添加之后上传中的loading
    const excelLoadingModal = ref(false);
    // excel上传列表
    const excelList = reactive([]);
    //弹窗详情title
    const artificialTitle = ref("添加商品");
    //弹窗按钮名称
    const modelBtnText = ref("确定添加");
    //搜索参数
    const search = reactive({
      total: 0,
      name: "",
      page: 1,
      pageSize: 20,
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
    // 清空弹窗内容
    const clearModal = () => {
      lineValue.CreatedAt = "";
      lineValue.DeletedAt = "";
      lineValue.UpdatedAt = "";
      lineValue.alias = "";
      lineValue.info = "";
      lineValue.merchantId = "";
      lineValue.merchantLinks = [];
      lineValue.pictureLink = "";
      lineValue.name = "";
      lineValue.isChecked = false;
    };
    //打开弹窗
    const open = (type) => {
      clearModal();
      if (type == "添加商品") {
        artificialTitle.value = type;
        artificialModel.value = true;
      } else if (type == "AI识别添加") {
        console.log("ai");
        // AIRecognitionTitle.value = type;
        // AIRecognitionModel.value = true;
      } else if (type == "Excel") {
        excelModel.value = true;
        excelList.length = 0;
      }
      modelBtnText.value = "确定添加";
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
          item.isChecked = true;
        });
      } else {
        tableData.forEach((item) => {
          item.isChecked = false;
        });
      }
    };
    // 详情
    const detail = (item) => {
      lineValue.CreatedAt = item.CreatedAt;
      lineValue.DeletedAt = item.DeletedAt;
      lineValue.UpdatedAt = item.UpdatedAt;
      lineValue.alias = item.alias;
      lineValue.info = item.info;
      lineValue.merchantId = item.merchantId;
      lineValue.merchantLinks = item.merchantLinks;
      lineValue.pictureLink = item.pictureLink;
      lineValue.name = item.name;
      lineValue.isChecked = item.isChecked;
      setTimeout(() => {
        detailModel.value = true;
      });
    };
    // 编辑标签
    const edit = (item) => {
      detailModel.value = false;
      artificialTitle.value = "编辑商品";
      modelBtnText.value = "确定编辑";
      lineValue.CreatedAt = item.CreatedAt;
      lineValue.DeletedAt = item.DeletedAt;
      lineValue.UpdatedAt = item.UpdatedAt;
      lineValue.alias = item.alias;
      lineValue.info = item.info;
      lineValue.merchantId = item.merchantId;
      lineValue.merchantLinks = item.merchantLinks;
      lineValue.pictureLink = item.pictureLink;
      lineValue.name = item.name;
      lineValue.isChecked = item.isChecked;
      artificialModel.value = true;
    };
    // 编辑提交
    const subEdit = async () => {
      if (lineValue.name == "") {
        Message.error("商品名称不能为空");
        return;
      }
      if (lineValue.merchantLinks.length == 0) {
        Message.error("商品链接不能为空");
        return;
      }
      lineValue.shopId = shopId;
      let res = await editShop(lineValue);
      if (res.message == "Merchant deleted successfully" || res) {
        Message.success("修改成功");
        artificialModel.value = false;
        getShopListFn();
      }
    };
    // 删除
    const del = async (type, id) => {
      if (type == "tableLine" || type == "card") {
        let params = {
          merchantId: id,
        };
        let res = await delShop(params);
        if (res.message == "Merchant deleted successfully") {
          Message.success("删除成功");
          getShopListFn();
        }
      }
    };
    // 上传商品图片
    const uploadShopImg = async (option) => {
      const { fileItem } = option;
      let timestamp = Date.now();
      let res = await upload(fileItem.file, `shop/cover/${timestamp}`, ".jpg");
      if (res) {
        lineValue.pictureLink = res.split("?")[0];
      }
    };
    // 手动上传添加一行链接
    const addLinks = () => {
      let arr = [
        {
          CreatedAt: "",
          DeletedAt: null,
          UpdatedAt: "",
          linkId: null,
          name: "",
          taobaoId: null,
          updatedBy: JSON.parse(sessionStorage.getItem("userInfo")).nickName
            ? JSON.parse(sessionStorage.getItem("userInfo")).nickName
            : "",
        },
      ];
      lineValue.merchantLinks.push(...arr);
    };
    // 手动上传删除一行链接
    const delLinks = (index) => {
      lineValue.merchantLinks.splice(index, 1);
    };
    // 手动上传判断链接是否为正常链接
    const isLink = (index) => {
      let arr = lineValue.merchantLinks[index].link.split("=");
      let pattern = /^\d+$/;
      if (
        arr[0] != "https://item.taobao.com/item.htm?id" ||
        !pattern.test(arr[1])
      ) {
        Message.error("请输入正确的链接");
        lineValue.merchantLinks[index].taobaoId = "";
        lineValue.merchantLinks[index].link =
          "https://item.taobao.com/item.htm?id=";
      } else {
        lineValue.merchantLinks[index].taobaoId = arr[1];
      }
    };
    // // ai上传图片
    // const uploadAIImg = (options) => {
    //   const { fileItem } = options;
    //   // let timestamp = Date.now();
    //   // uploadImg(fileItem.file, `ai/yx/${timestamp}`, ".jpg");//yx为当前登陆人的名称/id
    //   aiImgArr.push(fileItem);
    // };
    // // 打开ai识别列表弹窗
    // const openAiListModal = () => {
    //   AIListModel.value = true;
    // };
    // // ai上传提交编辑/修改
    // const submit = () => {};
    // 上传xlsx
    const uploadFile = (options) => {
      const { file } = options[0];
      // 检查文件大小,现阶段为5mb
      if (file.size > 5 * 1024 * 1024) {
        Message.error("文件不能超过5mb，请整理文件后重新上传");
        return; // 停止后续操作
      }
      excelList.push(file);
    };
    // excel上传按钮
    const subUpload = async () => {
      excelLoadingModal.value = true;
      excelModel.value = false;
      // 创建一个 FileReader 对象
      const reader = new FileReader();
      // 读取文件为 ArrayBuffer
      reader.readAsArrayBuffer(excelList[0]);
      // 读取完成后处理
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const blob = new Blob([arrayBuffer], { type: excelList[0].type });
        // 创建一个 FormData 对象来发送文件
        const formData = new FormData();
        formData.append("file", blob, excelList[0].name);
        let shopId = JSON.parse(sessionStorage.getItem("userInfo")).shopId;

        const response = await axios.post(
          `https://www.zhihuige.cc/csrb/api/v1/merchant/upload?shopId=${shopId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              // 注意：在发送 FormData 时，通常不需要手动设置 'Content-Type' 头部，因为浏览器会自动处理
            },
            timeout: 600000, // 设置请求超时的默认值
          }
        );
        if (response.data.message == "Merchants uploaded successfully") {
          Message.success("上传成功");
          excelLoadingModal.value = false;
          getShopListFn();
        } else {
          Message.error("上传失败，请稍后重试");
          excelLoadingModal.value = false;
        }
      };
    };
    // 下载文档/excel
    const download = (type) => {
      let url;
      if (type == "pdf") {
        url =
          "https://csr-pictures.oss-cn-hangzhou.aliyuncs.com/download/%E5%95%86%E5%93%81%E4%B8%8A%E4%BC%A0%E8%AF%B4%E6%98%8E%E6%96%87%E6%A1%A3.pdf";
      } else if (type == "excel") {
        url =
          "https://csr-pictures.oss-cn-hangzhou.aliyuncs.com/download/Excel%E6%B7%BB%E5%8A%A0%E5%95%86%E5%93%81%E6%A8%A1%E7%89%88.xlsx";
      }
      // 创建一个隐藏的链接元素
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.pdf"); // 设置下载文件的名称，可选
      // 触发点击事件
      document.body.appendChild(link); // 需要添加到 DOM 中才能触发点击
      link.click();
      // 清理
      document.body.removeChild(link);
    };
    //文本域
    const blurTextarea = (value) => {
      console.log(value);
    };
    // 获取表格数据
    const getShopListFn = async () => {
      let params = {
        page: 1,
        pageSize: 10000,
        shopId: shopId,
      };
      let res = await getShopList(params);
      if (res.code == 0) {
        // 获取后台数据
        resArr.push(...res.data.list);
        search.total = res.data.total;
        tableData.length = 0;
        tableData.push(...resArr.slice(0, search.pageSize));
        tableData.forEach((item) => {
          item.isChecked = false;
          if (item.merchantLinks && item.merchantLinks.length > 0) {
            for (let i = 0; i < item.merchantLinks.length; i++) {
              item.merchantLinks[i].link =
                "https://item.taobao.com/item.htm?id=" +
                item.merchantLinks[i].taobaoId;
            }
          }
        });
        if (tableData.length == 0) {
          isNone.value = true;
        } else {
          isNone.value = false;
        }
      }
    };
    // 列表搜索查询
    const searchFn = () => {
      tableData.length = 0;
      searchTableData.length = 0;
      if (search.name != "") {
        searchTableData.push(...fuzzySearch(resArr, "name", search.name));
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
      getShopListFn();
    });
    return {
      shopId,
      searchTableData,
      isNone,
      resArr,
      excelList,
      lineValue,
      detailModel,
      viewType,
      excelModel,
      // AIRecognitionData,
      // AIRecognitionColumns,
      // AIListModel,
      // aiImgArr,
      // AIRecognitionTitle,
      // AIRecognitionModel,
      shopParameters,
      checkedTableAll,
      tableData,
      search,
      artificialModel,
      artificialTitle,
      modelBtnText,
      excelLoadingModal,
      uploadFile,
      edit,
      del,
      allChecked,
      open,
      uploadShopImg,
      detail,
      addLinks,
      delLinks,
      isLink,
      // submit,
      // uploadAIImg,
      // openAiListModal,
      blurTextarea,
      download,
      checkedLine,
      getShopListFn,
      clearModal,
      changePageSize,
      changePage,
      subUpload,
      subEdit,
      searchFn,
    };
  },
};
</script>
<style lang='scss' scoped>
.general {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--main-borderRadio);
  .dataNone {
    width: 350px;
    height: 184px;
    .icon-empty {
      font-size: 48px;
      color: var(--main-fontColor3);
      text-align: center;
    }
    .text1 {
      text-align: center;
      color: var(--main-fontColor2);
      font-weight: bold;
      font-size: 18px;
    }
    .text2 {
      text-align: center;
      color: var(--main-fontColor3);
      font-size: 14px;
      margin: 8px 0 24px 0;
    }
    .option {
      display: flex;
      align-items: center;
      justify-content: center;
      .btn {
        width: 140px;
        height: 36px;
        background-color: var(--main-btnBackgroundColor);
        &:first-child {
          margin-right: 12px;
        }
        &:hover {
          background-color: var(--main-btnHoverColor1);
        }
      }
    }
  }
  .tableBox {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: var(--main-borderRadio) !important;
    .top {
      width: 100%;
      height: 70px;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        .numIssue {
          color: var(--main-fontColor3);
          font-size: 14px;
        }
        .radioGroup {
          margin-right: 24px;
          background-color: var(--main-backgroundColor);
        }
      }
      .right {
        display: flex;
        align-items: center;
        .input {
          width: 220px;
          height: 36px;
          background-color: var(--main-backgroundColor) !important;
        }
        ::v-deep .arco-trigger-popup {
          background-color: red;
        }
        ::v-deep .arco-dropdown-option-content {
          display: flex;
        }
        ::v-deep .arco-btn-secondary {
          width: 116px;
          height: 36px;
          line-height: 36px;
          color: rgba(255, 255, 255, 1);
          font-size: 14px;
          margin-left: 12px;
          background-color: var(--main-btnBackgroundColor);
        }
        ::v-deep .arco-dropdown-open .arco-icon-down {
          transform: rotate(180deg);
        }
        ::v-deep .arco-btn-size-medium svg {
          margin-left: 16px;
        }
        .btn {
          background-color: var(--main-backgroundColor) !important;
          color: var(--main-fontColor1);
        }
        .btnBox {
          ::v-deep .arco-btn-secondary:hover {
            background-color: var(--main-btnHoverColor) !important;
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
      .record {
        display: flex;
        align-items: center;
        .img {
          flex-shrink: 0;
          width: 64px;
          height: 64px;
          border: 1px solid var(--main-borderColor);
          margin-right: 8px;
          cursor: pointer;
          ::v-deep .arco-image-img {
            max-width: 100%;
            height: 100%;
            margin-left: 50%;
            transform: translate(-50%);
          }
          .imgError {
            width: 64px;
            height: 64px;
            position: absolute;
            left: 0;
            top: 0;
            border-radius: var(--main-borderRadio);
          }
        }
        .shopName {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }
      }
      .link {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
      }
      .tableTitle {
        display: flex;
        align-items: center;
        .name {
          margin-right: 2px;
        }
        .icon {
          cursor: pointer;
        }
      }
      .tagBox {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        align-content: space-between;
        .item {
          font-size: 12px;
          height: 24px;
          line-height: 24px;
          background-color: #f2f3f4;
          padding: 0 8px;
          margin: 4px;
        }
      }
      .shopName {
        font-weight: bold;
      }
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
        padding: 8px 0;
      }
      ::v-deep .arco-link:hover {
        background-color: transparent;
      }
    }
    .cardBox {
      width: calc(100% - 48px);
      max-height: calc(100% - 150px);
      overflow-y: auto;
      margin-left: 24px;
      display: grid;
      grid-template-columns: repeat(4, 1fr); /* 四列，每列宽度相等 */
      grid-gap: 24px; /* 可选：网格项之间的间距 */
      .cardItem {
        height: 104px;
        border-radius: var(--main-borderRadio);
        border: 1px solid var(--main-borderColor);
        padding: 12px;
        background-color: var(--main-backgroundColor);
        display: flex;
        &:hover {
          background-color: var(--main-btnHoverColor);
        }
        .left {
          flex-shrink: 0;
          width: 80px;
          height: 80px;
          border-radius: var(--main-borderRadio);
          border: 1px solid var(--main-borderColor);
          display: flex;
          align-items: center;
          justify-content: center;
          .image {
            flex-shrink: 0;
            max-width: 100%;
            height: 100%;
            border: 1px solid var(--main-borderColor);
            cursor: pointer;
            .imgError {
              width: 80px;
              height: 80px;
              position: absolute;
              left: -40px;
              top: 0;
              border-radius: var(--main-borderRadio);
              ::v-deep .arco-image-img {
                width: 80px;
                height: 80px;
              }
            }
            ::v-deep .arco-image-img {
              max-width: 80px;
              height: 100%;
            }
          }
        }

        .right {
          width: calc(100% - 94px);
          margin-left: 12px;
          position: relative;
          .title {
            width: 100%;
            line-height: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
          }
          .option {
            width: 100%;
            position: absolute;
            bottom: 0;
            .btn {
              padding: 0;
              height: 16px;
              margin-right: 8px;
              &:active {
                background-color: transparent;
              }
            }
          }
        }
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
.artificialModel {
  .title {
    font-size: 16px;
    font-weight: bold;
  }
  .content {
    padding: 0 4px;
    .alert {
      margin-bottom: 24px;
      .icon-download {
        margin-right: 8px;
      }
      ::v-deep .arco-alert-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      ::v-deep .arco-btn-text {
        padding: 0;
      }
      ::v-deep .arco-btn-text:hover {
        background-color: transparent;
      }
      ::v-deep .arco-btn-text:active {
        background-color: transparent;
      }
    }
    .itemGather {
      display: flex;
    }
    .item {
      width: 100%;
      margin-bottom: 24px;
      &:last-child {
        margin-bottom: 0;
      }
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
      .textarea {
        width: 100%;
        height: 400px;
        background-color: var(--main-backgroundColor);
      }
      ::v-deep .arco-textarea {
        resize: none;
      }
      .inputs {
        .inputBox {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          .del {
            color: #ff1600;
            margin-left: 8px;
            cursor: pointer;
          }
        }
      }

      .cancel {
        width: 100%;
        height: 36px;
        background-color: var(--main-backgroundColor);
      }
      ::v-deep .arco-btn-dashed:hover {
        background-color: var(--main-btnHoverColor);
      }
      .itemSub {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
        .labelSub {
          width: 80px;
          color: var(--main-fontColor3);
        }
        .input3 {
          width: calc(100% - 80px);
        }
        .input4 {
          flex-shrink: 0;
          width: 70px;
        }
      }
      .tips {
        font-size: 12px;
        color: var(--main-fontColor3);
      }
      ::v-deep .arco-upload {
        background-color: var(--main-backgroundColor);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .uploadImg,
      .image {
        width: 36px;
        height: 36px;
        ::v-deep .arco-image-img {
          max-width: 100%;
          height: 100%;
          margin-left: 50%;
          transform: translate(-50%);
        }
      }
      .input {
        width: 100%;
        height: 36px;
        line-height: 36px;
        background-color: var(--main-backgroundColor);
      }
      .input1 {
        width: 352px;
        height: 36px;
        line-height: 36px;
      }
      .input2 {
        width: 352px;
      }
      .input3 {
        width: 100%;
        min-height: 500px;
      }
      ::v-deep .arco-select-view-single {
        width: 376px;
        height: 36px;
        line-height: 36px;
        background-color: var(--main-backgroundColor);
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
      ::v-deep .arco-upload-wrapper {
        width: 36px;
        height: 36px;
      }
      ::v-deep .arco-upload {
        width: 36px;
        height: 36px;
      }
      ::v-deep .arco-upload-list-item {
        width: 36px;
        height: 36px;
        margin: 0;
      }
      ::v-deep .arco-upload-picture-card {
        width: 36px;
        min-width: 36px;
        height: 36px;
        border: 1px dashed var(--main-borderColor);
        background-color: var(--main-backgroundColor);
      }
      ::v-deep .arco-upload-picture-card:hover {
        background-color: var(--main-btnHoverColor);
      }
      ::v-deep .arco-textarea-wrapper:hover {
        background-color: var(--main-btnHoverColor);
      }
      ::v-deep .arco-progress-circle-bg {
        display: none;
      }
      ::v-deep .arco-upload-list-picture {
        width: 36px;
        height: 36px;
        margin: 0;
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
/*.AIRecognitionModel {
  .title {
    font-size: 16px;
    font-weight: bold;
  }
  .content {
    padding: 0 4px;
    .item {
      width: 100%;
      margin: 24px 0;
      &:last-child {
        margin-bottom: 0;
      }
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
      .upload1 {
        width: 100%;
        height: 184px;
        border: 1px dashed var(--main-borderColor);
        background-color: var(--main-backgroundColor);
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        .icon,
        .text,
        .tips {
          width: 100%;
          text-align: center;
          color: var(--main-fontColor1);
        }
        .text {
          font-size: 14px;
          margin-top: 24px;
        }
        .tips {
          font-size: 12px;
          color: var(--main-fontColor2);
        }
      }
      .upload1:hover {
        background-color: var(--main-btnHoverColor);
      }
      .upload2 {
        width: 80px;
        height: 80px;
        .text {
          margin-top: 0;
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
.AIListModel {
  .table {
    ::v-deep .btn {
      padding: 0;
    }
  }
}*/
.excelModel {
  .content {
    padding: 0 4px;
    .alert {
      margin-bottom: 24px;
      .icon-download {
        margin-right: 8px;
      }
      ::v-deep .arco-alert-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      ::v-deep .arco-btn-text {
        padding: 0;
      }
      ::v-deep .arco-btn-text:hover {
        background-color: transparent;
      }
      ::v-deep .arco-btn-text:active {
        background-color: transparent;
      }
    }

    .upload1 {
      width: 100%;
      height: 184px;
      border: 1px dashed var(--main-borderColor);
      background-color: var(--main-backgroundColor);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      .icon,
      .text,
      .tips {
        width: 100%;
        text-align: center;
        color: var(--main-fontColor1);
      }
      .text {
        font-size: 14px;
        margin-top: 24px;
      }
      .tips {
        font-size: 12px;
        color: var(--main-fontColor2);
      }
    }
    .upload1:hover {
      background-color: var(--main-btnHoverColor);
    }
    .tips {
      color: var(--main-fontColor2);
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
.detailModel {
  .content {
    padding: 0 4px;
    display: flex;
    .left {
      flex-shrink: 0;
      width: 192px;
      height: 192px;
      border: 1px solid var(--main-borderColor);
      border-radius: var(--main-borderRadio);
      display: flex;
      justify-content: center;
      .img {
        height: 100%;
        ::v-deep .arco-image-img {
          max-width: 100%;
          height: 100%;
        }
      }
    }
    .right {
      width: calc(100% - 216px);
      margin-left: 24px;
      .item {
        width: 100%;
        margin-bottom: 24px;
        .label {
          font-weight: bold;
          color: var(--main-fontColor2);
          margin-bottom: 4px;
        }
        .value {
          width: 100%;
          color: var(--main-fontColor1);
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }
        .link {
          padding: 0;
          width: 100%;
          color: var(--main-btnBackgroundColor);
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          &:hover {
            background-color: transparent;
          }
        }
        .textarea {
          min-height: 150px;
          background-color: transparent;
          &:hover {
            background-color: transparent;
          }
        }
        ::v-deep .arco-textarea {
          padding: 0;
        }
        ::v-deep .arco-textarea[disabled] {
          -webkit-text-fill-color: var(--main-fontColor1);
        }
        ::v-deep .arco-textarea[disabled]:hover {
          cursor: default;
        }
      }
    }
  }
  .footer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row-reverse;
    padding: 0 4px;
    .sub {
      width: 82px;
      height: 32px;
      line-height: 32px;
      color: var(--main-btnBackgroundColor);
      font-size: 14px;
      text-align: center;
      margin-left: 12px;
      background-color: var(--main-backgroundColor);
      .icon {
        margin-right: 8px;
      }
    }
    .delSty {
      color: #cb272d;
      background: #fff7f5;
      margin-left: 8px;
    }
  }
}
.excelLoadingModal {
  .content {
    .spin {
      margin-left: 50%;
      transform: translate(-50%);
    }
    .text {
      margin-top: 24px;
      color: var(--main-fontColor2);
      text-align: center;
    }
  }
}
</style>