// 巡检
<template>
  <div>
    <el-row>
      <el-card class="equipment-manage">
        <!-- 头部功能区 -->
        <tpms-header
          ref="tpmsHeader"
          :formData="equipmentFormList"
          @inquireTableData="inquireTableData"
          label-width="95px"
          @onValueChanged="onValueChanged"
        />
        <el-row class="buttom-group" type="flex" justify="end" align="middle">
          <el-button class="button-more" type="primary" size="small" @click="add">新增计划</el-button>
        </el-row>
        <!-- 底部表格 -->
        <tpms-table
          ref="tpmsTable"
          :column_index="true"
          :total="total"
          :data="equipmentTableData"
          :columns="equipmentTableList"
          @inquireTableData="inquireTableData"
          @getTableData="getTableData"
          @selection-change="handleSelectionChange"
        >
          <template slot="operation" slot-scope="scope">
            <span class="button cursor" @click="view(scope.row)">查看</span>
            <span
              class="button cursor"
              @click="approval(scope.row)"
              v-if="scope.row.buttons.includes('approval')"
            >审批</span>
            <span
              class="button cursor"
              @click="viewWorkOrder(scope.row)"
              v-if="scope.row.status == '已发布' || scope.row.status == '已取消'"
            >查看工单</span>
            <span
              class="button cursor"
              @click="edit(scope.row)"
              v-if="scope.row.buttons.includes('launch')"
            >编辑</span>
            <span
              class="button cursor"
              @click="del(scope.row)"
              v-if="scope.row.buttons.includes('delete')"
            >删除</span>
            <span
              class="button cursor"
              @click="release(scope.row)"
              v-if="scope.row.buttons.includes('release')"
            >发布</span>
            <span
              class="button cursor"
              @click="cancel(scope.row)"
              v-if="scope.row.buttons.includes('canceled')"
            >取消计划</span>
            <span
              class="button cursor"
              @click="newApproval(scope.row)"
              v-if="scope.row.buttons.includes('launch')"
            >重新发起审批</span>
            <span class="button cursor" @click="exportFile(scope.row)">导出</span>
          </template>
        </tpms-table>
      </el-card>
    </el-row>

    <!-- 查看工单 -->
    <el-dialog width="90%" title="查看工单" :visible.sync="oneWorkOrderIsShow" center append-to-body>
      <tpms-table
        ref="oneWorkOrderTable"
        height="50vh"
        :data="oneWorkOrderData.data"
        :total="oneWorkOrderData.totalElements||0"
        :columns="[
          {props:'no',label:'工单编号'},
          {props:'planNo',label:'巡检计划编号'},
          {props:'planName',label:'巡检计划名称'},
          {props:'createDate',label:'生成日期'},
          {props:'status',label:'状态'},
          {props:'receiverName',label:'接单人'}
        ]"
        @getTableData="viewWorkOrder"
      />
    </el-dialog>

    <!-- 新增|编辑对话框 -->
    <el-dialog
      v-loading="loading"
      element-loading-text="文件导入中"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :title="newAddDialogTitle"
      :visible.sync="newAddDialog"
      width="80%"
      :before-close="handleClose"
    >
      <!-- 头部表单 -->
      <el-row style="margin-top:40px">
        <el-form :model="form" ref="form" label-width="140px" label-position="left">
          <el-row>
            <el-col :span="11" >
              <el-form-item label="巡检名称" required="required">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item label="导入设备巡检计划">
                <div>
                  <tpms-choosefile plain text="选择文件" isMutiple @getFileData="getFileData($event)"></tpms-choosefile>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
            </el-col>
          </el-row>
          <el-row
            v-for="(item,index) in form.planDevices"
            :key="index"
            style="background: #f5f5f5;padding: 0.2rem"
          >
            <el-col :span="11">
              <el-form-item label="版本" required="required">
                <el-input v-model="item.version"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="设备(生产线)名称" required="required">
                <el-input v-model="item.deviceNos"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="工位(工段)">
                <el-input v-model="item.sectionOrStationName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="总工时">
                <el-input v-model="item.hour" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="编制人" required="required">
                <el-input readonly v-model="item.creatorName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="编制日期" required="required">
                <el-input readonly v-model="item.createDate"></el-input>
              </el-form-item>
            </el-col>
            <!-- 表格区 -->
            <el-table
              :data="item.planContents"
              style="width:100%"
              border
              default-expand-all
              :tree-props="{children: 'childPlanContents', hasChildren: 'hasChildren'}"
            >
              <el-table-column align="center" type="index" label="项目" width="80"></el-table-column>
              <el-table-column align="center" label="时间/部件" width="150">
                <template slot-scope="scope">
                  <el-input v-show="scope.row.editShow" v-model="scope.row.executionNode"></el-input>
                  <span v-show="!scope.row.editShow">{{scope.row.executionNode}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="内容" width="300">
                <template slot-scope="scope">
                  <el-input v-show="scope.row.editShow" v-model="scope.row.content"></el-input>
                  <span v-show="!scope.row.editShow">{{scope.row.content}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="工时(s)">
                <template slot-scope="scope">
                  <el-input
                    v-show="scope.row.editShow"
                    v-model="scope.row.hour"
                    @change="calcTime(item)"
                  ></el-input>
                  <span v-show="!scope.row.editShow">{{scope.row.hour}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="方法">
                <template slot-scope="scope">
                  <el-input v-show="scope.row.editShow" v-model="scope.row.method"></el-input>
                  <span v-show="!scope.row.editShow">{{scope.row.method}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="周期" width="110">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.cycleId"
                    style="width:100%"
                    :disabled="!scope.row.editShow"
                  >
                    <el-option
                      v-for="item in cycleList"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="顺序" width="110">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.sort"
                    style="width:100%"
                    :disabled="!scope.row.editShow"
                  >
                    <el-option
                      v-for="itemSort in item.planContents.length"
                      :key="itemSort"
                      :label="itemSort"
                      :value="itemSort"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" width="300" label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-button size="small" @click="scope.row.editShow = true">编辑</el-button>
                  <el-button size="small" @click="scope.row.editShow = false">保存</el-button>
                  <el-button
                    size="small"
                    @click.native.prevent="deleteRow(scope.$index, item.planContents),calcTime(item)"
                    style="margin-right:10px"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="center">
              <i
                class="el-icon-circle-plus"
                style="font-size: 30px; color: #0077DC;"
                @click="addTableRow(item.planContents)"
              ></i>
            </el-row>
          </el-row>
          <el-col :span="7" :offset="17" style="margin-top:20px">
            <el-form-item>
              <el-button v-if="newAddDialogTitle==='新增'" type="primary" @click="submitForm()">提交</el-button>
              <el-button v-if="newAddDialogTitle==='编辑'" type="primary" @click="changePlan()">保存</el-button>
              <el-button @click="newAddDialog = false">取 消</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-dialog>
    <!-- 查看详情 -->
    <el-dialog :visible.sync="orderDetailIsShow" width="80%" title="查看">
      <el-row>
        <el-form :model="orderDetail" label-position="left" label-width="120px">
          <el-row>
            <el-col :span="11">
              <el-form-item label="巡检计划编号">
                <el-input v-model="orderDetail.no" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            v-for="(item,index) in orderDetail.planDevices"
            :key="index"
            style="background: #f5f5f5;padding: 0.2rem"
          >
            <el-col :span="11">
              <el-form-item label="版本">
                <el-input v-model="item.version" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="工位/工段">
                <el-input v-model="item.sectionOrStationName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="总工时">
                <el-input v-model="item.hour" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="设备(生产线)名称">
                <el-input v-model="item.deviceNos" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="编制人">
                <el-input v-model="item.creatorName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="编制日期">
                <el-input v-model="item.createDate" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="图示">
                <div>
                  <el-image
                    v-for="(img) in item.planPictures"
                    :key="img.accessoryId"
                    :src="img.url"
                    fit="fill"
                  ></el-image>
                </div>
              </el-form-item>
            </el-col>
            <!-- 表格区 -->
            <el-table
              :data="item.planContents"
              style="width:100%"
              border
              default-expand-all
              :tree-props="{children: 'childPlanContents', hasChildren: 'hasChildren'}"
            >
              <el-table-column align="center" type="index" label="项目" width="50"></el-table-column>
              <el-table-column align="center" prop="executionNode" label="时间/部件" width="150"></el-table-column>
              <el-table-column align="center" prop="content" label="内容" width="300"></el-table-column>
              <el-table-column align="center" prop="hour" label="工时(s)"></el-table-column>
              <el-table-column align="center" prop="method" label="方法"></el-table-column>
              <el-table-column align="center" prop="cycleName" label="周期" width="110"></el-table-column>
              <el-table-column align="center" prop="photoDisplay" label="图示">
                <template slot-scope="scope">
                  <img
                    v-if="scope.row.accessoryUrl"
                    style="width: 40px;height: 40px;"
                    :src="`${apiConfig.accessoryFile+scope.row.accessoryUrl}`"
                    class="avatar"
                  />
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-form>
      </el-row>
    </el-dialog>
    <!-- 提交审批 -->
    <el-dialog width="30%" title="审批" :visible.sync="approvalIsShow" center append-to-body>
      <el-form :model="form">
        <el-form-item label="审批理由" prop="reason">
          <el-input v-model="form.reason" placeholder="审批驳回必须填写理由"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: center;">
        <el-button type="primary" @click="adopt()">审批通过</el-button>
        <el-button type="primary" @click="reject()">审批驳回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { tpmsHeader, tpmsTable, tpmsChoosefile } from "../../components";
import { uploadAccessory } from "../../lib/api/accessory";
import apiConfig from "../../lib/api/apiConfig";
import { device } from "@/lib/api/device.js";
import {
  planList,
  oneWorkorders,
  queryPlan,
  addChildPlan,
  postChildPlan,
  workshopSectionSelect,
  workStationSelect,
  planStatusSelect,
  delPlan,
  workshopAreaManage,
  workshopManage,
  planNewNo,
  cycleSelect,
  updatePlanPicture,
  importURLPlanFile,
  exportExcel
} from "../../lib/api/checkPlan";
import { parseTime } from "@/utils";
import axios from "axios";
import {
  factoryManage,
  workshopManage as workshopManageAll,
  workStationManage,
  workshopSectionManage
} from "../../lib/api/workshopSettingsManage";
export default {
  data() {
    // 类型列表
    const typeList = [
      {
        id: "1",
        label: "巡检计划"
      },
      {
        id: "3",
        label: "日常保养"
      }
    ];
    // 获取头部搜索组下拉选择的list
    let getListFuncs = [
      workStationSelect, //工位
      workshopSectionSelect, //工段
      planStatusSelect, //状态
      factoryManage.getNames, //工厂
      workshopManageAll.getNames //车间
    ];
    let [
      stationList,
      sectionList,
      statusList,
      factoryList,
      workshopList
    ] = getListFuncs.map(getListFunc => {
      let arr = [];
      getListFunc(null).then(res => {
        arr.push(...res.data);
      });
      return arr;
    });
    return {
      newAddDialogTitle: "",
      apiConfig,
      planDevicesIndex: 0,
      planContentsIndex: 0,
      showRejectMoal: false,
      User_info: JSON.parse(localStorage.getItem("user_info")),
      uploadHeaders: {
        Authorization: "Bearer " + localStorage.getItem("access_token")
      },
      uploadImgUrl: apiConfig.uploadAccessory + "/128",
      cycleList: [], // 周期列表
      typeList: typeList, //巡检类型列表
      deviceList: [], //设备列表
      stationList: stationList, //工位列表
      sectionList: sectionList, //工段列表
      statusList: statusList, //状态列表
      //  渲染头部功能区的列表
      equipmentFormList: [
        { label: "名称", props: "name", value: "" },
        {
          label: "工厂",
          props: "factoryId",
          value: "",
          type: "radio",
          checkList: factoryList
        },
        {
          label: "车间",
          props: "workshopId",
          value: "",
          type: "radio",
          checkList: []
        },
        { label: "工位/工段", props: "positionName", value: "" },
        { label: "设备名称", props: "deviceName", value: "" },
        { label: "设备(生产线)", props: "deviceNos", value: "" },
        {
          label: "状态",
          props: "status",
          value: "",
          type: "radio",
          checkList: statusList
        }
      ],
      total: 0,
      // 表格的数据
      equipmentTableData: [],
      // 渲染表格的表头
      equipmentTableList: [
        { type: "selection" },
        {
          props: "no",
          label: "巡检计划编号",
          width: "160px"
        },
        {
          props: "type",
          label: "类型"
        },
        {
          props: "name",
          label: "巡检名称"
        },
        {
          props: "hour",
          label: "总工时"
        },
        {
          props: "creatorName",
          label: "制定人"
        },
        {
          props: "createDate",
          label: "制定日期",
          width: "200px"
        },
        {
          props: "status",
          label: "状态"
        },
        {
          label: "操作",
          slotName: "operation",
          fixed: "right",
          width: "240px"
        }
      ],
      oneWorkOrderIsShow: false, //查看巡检工单列表弹窗
      oneWorkOrderData: [], //查看巡检工单列表数据
      syncPicture: false,
      newAddDialog: false, //新增巡检计划弹窗
      //新增巡检计划表单
      form: {
        type: "7", //巡检计划
        no: "", //巡检计划编号
        name: "", //巡检名称
        workshopId: "", //车间ID
        workshopName: "", //车间名称
        areaName: "", //区域名称
        reason: "", //拒绝原因
        planDevices: [
          {
            id: "",
            version: "", //版本
            stationId: "", //工位
            sectionId: "", //工段
            hour: "", //工时
            creatorName: JSON.parse(localStorage.getItem("user_info")).principal
              .name, //编制人
            createDate: parseTime(new Date()), //编制日期
            deviceId: "1", //设备(生产线)名称ID
            creatorName: "",
            createDate: "",
            sectionOrStationName: "",
            planContents: [
              {
                id: "",
                editShow: false,
                executionNode: "", //时间/部件
                content: "", //  内容
                hour: "", //工时（s）
                cycleId: "", //周期
                accessoryUrl: "111", //图示
                accessoryId: "1", //图示ID
                method: "", //方法
                childPlanContents: [
                  //可展开的子节点
                ]
              }
            ]
          }
        ]
      },
      planDevicesIndex: "",
      orderDetailIsShow: false, //查看巡检计划详情弹窗
      orderDetail: {}, //查看巡检计划详情数据
      approvalIsShow: false,
      importFileData: {
        workshopName: "PFMA"
      },
      uploadFileIsShow: false,
      importURLFileUrl: apiConfig.importURLPlanFile,
      fileList: [],
      deviceList: [],
      deviceInfo: [], //设备下拉框信息
      planId: "",
      loading: false
    };
  },
  components: {
    tpmsHeader,
    tpmsTable,
    tpmsChoosefile
  },
  created() {},
  mounted() {
    this.getTableData();
    this.getCycleList();
    this.getDeviceList();
  },
  methods: {
    /** 导出单个计划 */
    exportFile({ id }) {
      let url = `${apiConfig.exportExcel}/${id}/download`; //请求下载文件的地址
      let token = localStorage.getItem("access_token"); //获取token
      axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + token
          },
          responseType: "blob"
        })
        .then(res => {
          if (!res) return;

          let fileName = "plan.zip";
          const disposition = res.headers["content-disposition"];
          if (disposition) {
            const name = disposition.split(";")[1].split("filename=")[1];
            fileName = decodeURI(name);
          }

          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.setAttribute("download", fileName); // 下载的文件
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    /** 导出符合所有搜索条件的计划 */
    exportPlans() {
      const searchData = this.$refs.tpmsHeader.getData();
      let url = apiConfig.exportPlans; //请求下载文件的地址
      let token = localStorage.getItem("access_token"); //获取token
      axios
        .get(url, {
          params: { ...searchData, type: "7" },
          headers: {
            Authorization: "Bearer " + token
          },
          responseType: "blob"
        })
        .then(res => {
          if (!res) return;

          let fileName = "plans.zip";
          const disposition = res.headers["content-disposition"];
          if (disposition) {
            const name = disposition.split(";")[1].split("filename=")[1];
            fileName = decodeURI(name);
          }

          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.setAttribute("download", fileName); // 下载的文件
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    handleSelectionChange(e) {
      let arr = [];
      for (var i = 0; i < e.length; i++) {
        arr.push(e[i].id);
      }
      this.planId = arr.join(",");
    },
    getDeviceId(e, item) {
      for (var i = 0; i < this.deviceInfo.length; i++) {
        if (this.deviceInfo[i].name == e) {
          item.deviceId = this.deviceInfo[i].id;
          break;
        }
      }
    },
    getDeviceList() {
      let option = {};
      device(option).then(res => {
        // console.log(res)
        this.deviceInfo = res.data.content;
      });
    },
    /**
     * @description 导入单个文件
     * @param {Object} e 文件对象
     * @param {Object} index 导入的form.planDevices数组下标
     */
    getFileData(files) {
      this.loading = true;
      let formData = new FormData();
      let workshopName = localStorage.getItem("workshopName");
      files.map(file => formData.append("file", file));
      formData.append("module", 3); //{1:'点检',2:'日常保养',3:'巡检',4:'保养'};
      importURLPlanFile(formData)
        .then(res => {
          // console.log(res,item)
          let datas = res.data;
          datas.forEach(data => {
            data.creatorName = JSON.parse(
              localStorage.getItem("user_info")
            ).principal.name; //编制人
            data.createDate = parseTime(new Date()); //编制日期
            data.planContents.forEach(item => (item.editShow = false));
            delete data.planPictures;
          });
          // Object.assign(data,{
          //   creatorName: JSON.parse(localStorage.getItem('user_info')).principal.name, //编制人
          //   createDate: parseTime(new Date()), //编制日期
          // })
          // data.planContents = data.planContents.map(item => {
          //   return Object.assign(item, {
          //     editShow: false
          //   })
          // })
          this.form.planDevices = datas;
          this.loading = false;
          // console.log(this.form)
        })
        .catch(err => {
          this.loading = false;
        });
    },
    /** 获取周期列表 */
    getCycleList() {
      var workshopId = this.User_info.principal.workshopId;
      const data = {
        module: 3 //{1:'点检',2:'日常保养',3:'巡检',4:'保养'};
      };
      cycleSelect(data, workshopId + "/cycle/names").then(res => {
        // console.log("周期列表", res);
        this.cycleList = res.data;
      });
    },
    /**查询*/
    inquireTableData() {
      // 重置table页为第一页
      this.$refs.tpmsTable.resetCurrentPage();
      this.getTableData();
    },
    /** 加载页面表格数据 */
    getTableData() {
      // 获取头部搜索组数据
      let data = this.$refs.tpmsHeader.getData();
      let pageData = this.$refs.tpmsTable.getData();
      planList({ ...data, ...pageData, type: "7" }).then(res => {
        // console.log({ ...data, ...pageData})
        this.total = res.data.totalElements;
        this.equipmentTableData = res.data.content;
      });
    },
    /** 头部value变更回调 */
    onValueChanged({ props, value }) {
      if (props === "factoryId") {
        // 选择工厂，重置车间
        workshopManageAll.getNames({ factoryId: value }).then(res => {
          this.equipmentFormList.forEach(item => {
            if (item.props === "workshopId") {
              item.checkList = res.data;
              item.value = "";
            }
          });
        });
      }
    },
    /** 查看巡检计划详情  */
    view(row) {
      queryPlan(null, row.id).then(res => {
        res.data.planDevices.map(item => {
          item.planPictures &&
            item.planPictures.forEach(ever => {
              ever.name = ever.accessoryId;
              ever.url = this.apiConfig.accessoryFile + ever.accessoryUrl;
            });
        });
        this.orderDetail = res.data;
      });
      this.orderDetailIsShow = true;
    },
    /** 关闭所有对话框 */
    handleClose() {
      const _this = this;
      _this.newAddDialog = false;
      _this.oneWorkOrderIsShow = false;
      _this.approvalIsShow = false;
    },

    /**  新增巡检计划按钮*/
    add() {
      this.newAddDialog = true;
      this.newAddDialogTitle = "新增";
      this.form = {
        type: "7", //巡检计划
        no: "", //巡检计划编号
        name: "", //巡检名称
        workshopId: "", //车间ID
        workshopName: "", //车间名称
        areaName: "", //区域名称
        reason: "", //审核拒绝原因
        planDevices: [
          {
            id: "",
            version: "", //版本
            stationId: "", //工位
            sectionId: "", //工段
            hour: "", //工时
            creatorName: JSON.parse(localStorage.getItem("user_info")).principal
              .name, //编制人
            createDate: parseTime(new Date()), //编制日期
            deviceId: "", //设备(生产线)名称ID
            planContents: [
              {
                id: "",
                editShow: false,
                executionNode: "", //时间/部件
                content: "", //  内容
                hour: "", //工时（s）
                cycleId: "", //周期
                accessoryUrl: "", //图示
                accessoryId: "", //图示id
                method: "", //方法
                childPlanContents: [
                  //可展开的子节点
                ],
                sort: 1
              }
            ]
          }
        ]
      };
      this.getWorkshopAreaManage();
    },
    /**  导入文件成功 */
    importFileSuccess(res, file) {
      var index = this.planDevicesIndex;
      console.log(index);
      this.form.planDevices[index] = res.data[0];
      console.log(this.form);
    },
    //打开批量导入文件弹窗
    uploadFiles(index) {
      this.planDevicesIndex = index;
      this.uploadFileIsShow = true;
    },
    /**  批量导入文件*/
    submitUpload() {
      console.log(this.fileList);
      if (this.fileList.length === 0) {
        this.$message.warning("请选取文件");
        return false;
      }
      const data = {
        file: this.fileList,
        workshopName: "PFMB"
      };
      importURLPlanFile(data).then(res => {
        console.log(res);
      });
    },
    // 选择单个文件
    handleChange(fileList) {
      this.fileList.push(fileList);
    },
    // 删除单个文件
    handleRemove(file, fileList, item) {
      if (file.id) {
        item.planPictures = item.planPictures.filter(ever => {
          return ever.accessoryId !== file.response.id;
        });
      } else {
        item.planPictures = item.planPictures.filter(ever => {
          return ever.name !== file.name;
        });
      }
    },
    /**  获取区域名称 */
    getWorkshopAreaManage() {
      workshopAreaManage(null, this.User_info.principal.workshopAreaId).then(
        res => {
          // console.log(res);
          this.form.areaName = res.data.name;
          var areaNo = res.data.no;
          this.getWorkshopManage(areaNo);
        }
      );
    },
    /**  获取车间名称 */
    getWorkshopManage(areaNo) {
      workshopManage(null, this.User_info.principal.workshopId).then(res => {
        console.log("workshopName", res.data.name);
        this.form.workshopName = res.data.name;
        this.importFileData.workshopName = res.data.name;
        this.form.workshopId = res.data.id;
        var workshopNo = res.data.no;
        // this.getPlanNewNo(workshopNo, areaNo);
      });
    },
    /**  获取巡检计划编号 */
    getPlanNewNo(workshopNo, areaNo) {
      var data = {
        type: this.form.type,
        workshopNo: workshopNo,
        areaNo: areaNo
      };
      // console.log(data);
      planNewNo(data).then(res => {
        // console.log(res);
        this.form.no = res.data;
      });
    },
    /** 编辑巡检计划 */
    edit(row) {
      // console.log(row);
      this.newAddDialogTitle = "编辑";
      queryPlan(null, row.id).then(res => {
        console.log(res);
        let data = res.data;
        for (var j = 0; j < data.planDevices.length; j++) {
          for (var i = 0; i < data.planDevices[j].planContents.length; i++) {
            data.planDevices[j].planContents[i].editShow = false;
          }
        }
        res.data.planDevices.map(item => {
          item.planPictures &&
            item.planPictures.forEach(ever => {
              ever.name = ever.accessoryId;
              ever.url = this.apiConfig.accessoryFile + ever.accessoryUrl;
            });
        });
        this.form.status = "";
        this.form = data;
      });
      this.newAddDialog = true;
    },
    /** 提交巡检计划 */
    submitForm() {
      delete this.form.status;
      var form = this.form;
      form.type = 7;
      const validateDevices = form.planDevices.filter(item => {
        if (!item.version) return true;
        if (!item.deviceNos) return true;
        const validateee = item.planContents.filter(itemm => {
          if (!itemm.executionNode) return true;
          if (!itemm.content) return true;
          if (!itemm.hour) return true;
          // if (!itemm.cycleId) return true; // 子计划不设置周期
          if (!itemm.method) return true;
          return false;
        });
        if (validateee.length) {
          this.$message.warning("缺少必填项!");
          return true;
        }
        return false;
      });

      if (validateDevices.length) {
        this.$message.warning("缺少必填项!");
        return;
      }
      const validate = form.planDevices.some(({ planContents }) => {
        const arr = planContents.map(({ sort }) => sort);
        return new Set(arr).size !== arr.length;
      });
      if (validate) {
        this.$message.warning("工作内容顺序重复，请修改");
        return;
      }
      console.log(JSON.stringify(form));
      addChildPlan(form).then(res => {
        // console.log(res);
        this.$message.success("操作成功");
        this.newAddDialog = false;
        this.getTableData();
      });
    },

    /** 修改计划 */
    changePlan() {
      const validate = this.form.planDevices.some(({ planContents }) => {
        const arr = planContents.map(({ sort }) => sort);
        return new Set(arr).size !== arr.length;
      });
      if (validate) {
        this.$message.warning("工作内容顺序重复，请修改");
        return;
      }
      console.log(JSON.stringify(this.form));
      delete this.form.status;
      postChildPlan(this.form, this.form.id).then(res => {
        this.newAddDialog = false;
        this.getTableData();
      });
    },

    /** 表格添加一行 */
    addTableRow(table) {
      console.log(table);
      table.push({
        id: "",
        editShow: false,
        executionNode: "", //时间/部件
        content: "", //  内容
        hour: "", //工时（s）
        cycleId: "", //周期
        accessoryUrl: "", //图示
        accessoryId: "", //图示id
        method: "", //方法
        childPlanContents: [
          //可展开的子节点
        ],
        sort: table.length + 1
      });
    },

    /**  新增巡检计划的 planDevices */
    addPlanDevice() {
      this.form.planDevices.push({
        version: "", //版本
        stationId: "", //工位
        sectionId: "", //工段
        hour: "", //工时
        workshopId: "", //设备(生产线)名称
        creatorName: JSON.parse(localStorage.getItem("user_info")).principal
          .name, //编制人
        createDate: parseTime(new Date()), //编制日期
        planContents: [
          {
            id: "",
            editShow: false,
            executionNode: "", //时间/部件
            content: "", //  内容
            hour: "", //工时（s）
            cycleId: "", //周期
            accessoryUrl: "111", //图示
            accessoryId: "1", //图示id
            method: "", //方法
            childPlanContents: [
              //可展开的子节点
            ],
            sort: 1
          }
        ]
      });
    },
    //删除planContents里的一条数据
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    /** 计算工时 */
    calcTime(item) {
      console.log(item);
      const { planContents } = item;
      window.planContents = planContents;
      const sum = planContents
        .map(row => row.hour)
        .reduce((a, b) => {
          const pre = parseInt(a) || 0;
          const next = parseInt(b) || 0;
          return pre + next;
        });
      item.hour = sum;
    },
    //审批巡检计划
    approval(row) {
      // console.log(row);
      queryPlan(null, row.id).then(res => {
        // console.log(res);
        this.form = res.data;
      });
      this.approvalIsShow = true;
    },
    //审批通过
    adopt() {
      this.form.status = 2;
      postChildPlan(this.form, this.form.id).then(res => {
        // console.log(res);
        this.getTableData();
        this.$message({
          type: "success",
          message: "已同意审批!"
        });
        this.approvalIsShow = false;
      });
    },
    //审批驳回
    reject() {
      this.form.status = 3;
      postChildPlan(this.form, this.form.id).then(res => {
        // console.log(res);
        this.getTableData();
        this.$message({
          type: "success",
          message: "已同意审批!"
        });
        this.approvalIsShow = false;
      });
    },
    // 审核驳回确认
    rejectConfirm() {
      console.log(this.form);
      postChildPlan(this.form, this.form.id).then(res => {
        // console.log(res);
        this.showRejectMoal = false;
        this.approvalIsShow = false;
        this.getTableData();
        this.$message({
          type: "success",
          message: "已驳回审批!"
        });
      });
    },
    //发起审批巡检计划
    newApproval(row) {
      // console.log(row);
      this.$confirm("重新发起审批, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          queryPlan(null, row.id).then(res => {
            // console.log(res);
            this.form = res.data;
          });
          this.form.status = 1;
          postChildPlan(this.form, row.id).then(res => {
            // console.log(res);
            this.getTableData();
            this.$message({
              type: "success",
              message: "重新发起审批成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消重新发起审批!"
          });
        });
    },
    //  查看巡检工单
    viewWorkOrder(row) {
      this.oneWorkOrderIsShow = true;
      this.$nextTick(() => {
        let id = "";
        if (row && row.id) {
          id = row.id;
        } else {
          id = this.oneWorkOrderData.planId;
        }
        const pageData = this.$refs.oneWorkOrderTable.getData();
        oneWorkorders(pageData, id + "/workorders").then(res => {
          this.oneWorkOrderData = {
            data: res.data.content,
            planId: id,
            totalElements: res.data.totalElements
          };
        });
      });
    },
    //删除巡检计划
    del(row) {
      // console.log(row);
      this.$confirm("此操作将删除巡检计划, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delPlan(null, row.id).then(res => {
            // console.log(res);
            this.getTableData();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //发布巡检计划
    release(row) {
      // console.log(row);
      this.$confirm("发布巡检计划, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.form.status = 5;
          postChildPlan(this.form, row.id).then(res => {
            // console.log(res);
            this.getTableData();
            this.$message({
              type: "success",
              message: "发布成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消发布"
          });
        });
    },
    //取消巡检计划
    cancel(row) {
      // console.log(row);
      this.$confirm("取消巡检计划, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          queryPlan(null, row.id).then(res => {
            // console.log(res);
            this.form = res.data;
          });
          this.form.status = 6;
          postChildPlan(this.form, row.id).then(res => {
            // console.log(res);
            this.getTableData();
            this.$message({
              type: "success",
              message: "取消巡检计划成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消取消巡检计划"
          });
        });
    },
  }
};
</script>
<style lang="scss" scoped>
.sync-picture {
  position: absolute;
  right: 20px;
}
.buttom-group {
  padding: 20px 30px 20px 0;
  div {
    margin-left: 10px;
  }
}
</style>
