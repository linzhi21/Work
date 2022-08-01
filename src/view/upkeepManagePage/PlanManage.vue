// 保养
<template>
  <div>
    <el-row>
      <!-- 头部功能区 -->
      <tpms-header
        ref="tpmsHeader"
        :formData="equipmentFormList"
        @inquireTableData="inquireTableData"
        label-width="75px"
        @onValueChanged="onValueChanged"
      />
      <el-row class="buttom-group" type="flex" justify="end" align="middle">
        <el-button @click="releaseMore" class="button-more" size="small"
          >批量发布</el-button
        >
        <el-button @click="deleteMore" class="button-more" size="small"
          >批量删除</el-button
        >
        <el-button @click="exportPlans" class="button-more" size="small"
          >导出</el-button
        >
        <el-button class="button-more" type="primary" size="small" @click="add"
          >新增计划</el-button
        >
      </el-row>
      <!-- 底部表格 -->
      <tpms-table
        ref="tpmsTable"
        :total="total"
        :data="equipmentTableData"
        :columns="[
          { type: 'selection' },
          { props: 'no', label: '保养计划编号', width: '160px' },
          { props: 'name', label: '保养名称' },
          { props: 'status', label: '状态' },
          { props: 'creatorName', label: '制定人' },
          { props: 'lastChangeDate', label: '最新编辑时间', width: '200px' },
          {
            label: '操作',
            slotName: 'operation',
            fixed: 'right',
            width: '240px',
          },
        ]"
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
            >审批</span
          >
          <span
            class="button cursor"
            @click="viewWorkOrder(scope.row)"
            v-if="scope.row.status == '已发布' || scope.row.status == '已取消'"
            >查看工单</span
          >
          <span
            class="button cursor"
            @click="edit(scope.row)"
            v-if="scope.row.buttons.includes('launch')"
            >编辑</span
          >
          <span
            class="button cursor"
            @click="del(scope.row)"
            v-if="scope.row.buttons.includes('delete')"
            >删除</span
          >
          <span
            class="button cursor"
            @click="release(scope.row)"
            v-if="scope.row.buttons.includes('release')"
            >发布</span
          >
          <span
            class="button cursor"
            @click="cancel(scope.row)"
            v-if="scope.row.buttons.includes('canceled')"
            >取消计划</span
          >
          <span
            class="button cursor"
            @click="newApproval(scope.row)"
            v-if="scope.row.buttons.includes('launch')"
            >重新发起审批</span
          >
          <span class="button cursor" @click="exportFile(scope.row)">导出</span>
        </template>
      </tpms-table>
    </el-row>

    <!-- 查看工单 -->
    <el-dialog
      width="90%"
      title="查看工单"
      :visible.sync="oneWorkOrderIsShow"
      center
      append-to-body
    >
      <tpms-table
        ref="oneWorkOrderTable"
        height="50vh"
        :data="oneWorkOrderData.data"
        :total="oneWorkOrderData.totalElements || 0"
        :columns="[
          { props: 'no', label: '工单编号' },
          { props: 'planNo', label: '保养计划编号' },
          { props: 'planName', label: '保养计划名称' },
          { props: 'createDate', label: '生成日期' },
          { props: 'status', label: '状态' },
          { props: 'receiverName', label: '接单人' },
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
      <el-row style="margin-top: 40px">
        <el-form
          :model="form"
          ref="form"
          label-width="140px"
          label-position="left"
        >
          <el-row>
            <!-- <el-col :span="11">
              <el-form-item label="类型2" required="required">
                <el-radio-group v-model="form.type">
                  <el-radio label="1">保养计划</el-radio>
                  <el-radio label="3">日常保养</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>-->
            <!-- <el-col :span="11">
              <el-form-item label="车间名称">
                <el-input v-model="form.workshopName" readonly></el-input>
              </el-form-item>
            </el-col> -->
            <!--  <el-col :span="11" :offset="2">
              <el-form-item label="保养计划编号" required="required">
                <el-input v-model="form.no" readonly></el-input>
              </el-form-item>
            </el-col>-->
            <el-col :span="11">
              <el-form-item label="保养名称" required="required">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="导入保养计划">
                <div>
                  <tpms-choosefile
                    plain
                    text="选择文件"
                    isMutiple
                    @getFileData="getFileData($event)"
                  ></tpms-choosefile>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <!-- <el-button type="primary" size="small" @click="uploadFiles(index)">批量导入文件</el-button> -->
              <!-- <tpms-choosefile isMutiple :multiple='true' plain text='批量导入文件' @getFileData='getMutipleFileData($event,index)'></tpms-choosefile> -->
              <!-- <el-button type="primary" plain size="mini" @click="addPlanDevice">新增</el-button> -->
            </el-col>
          </el-row>
          <el-row
            v-for="(item, index) in form.maintainContentColonies"
            :key="index"
            style="background: #f5f5f5; padding: 0.2rem"
          >
            <el-col :span="11" >
              <el-form-item label="设备编号">
                <el-input v-model="item.deviceNos"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2" required="required">
              <el-form-item label="设备(生产线)名称">
                <!-- <el-input v-model="item.deviceName"></el-input> -->
                <!-- <el-select @change="getDeviceId($event,item)" v-model="item.deviceName" placeholder="请选择" style="width:100%">
                  <el-option v-for="(item,i) in deviceInfo" :key="i" :label="item.name" :value="item.name">
                  </el-option>
                </el-select>-->
                <el-input v-model="item.deviceNames"></el-input>
              </el-form-item>
            </el-col>

            <!-- <el-col :span="11">
              <el-form-item label="工位" required="required">
                <el-select v-model="item.stationId" style="width:100%">
                  <el-option v-for="item in stationList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="工段" required="required">
                <el-select v-model="item.sectionId" style="width:100%">
                  <el-option v-for="item in sectionList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>-->
            <!-- <el-col :span="11">
              <el-form-item label="工位(工段)" required="required">
                <el-input v-model="item.sectionOrStationName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="工时" required="required">
                <el-input v-model="item.hour" disabled></el-input>
              </el-form-item>
            </el-col> -->
            
            <el-col :span="5"  >
              <el-form-item label="版本" required="required">
                <el-input v-model="item.version"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="2">
              <el-form-item label="编制人" required="required">
                <!-- <el-date-picker value-format='yyyy-MM-dd' v-model="item.deviceCreatorDate" type="date" placeholder="选择日期"
                style="width: 100%;"></el-date-picker>-->
                <el-input readonly v-model="item.creatorName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="2">
              <el-form-item label="编制日期" required="required">
                <el-input readonly v-model="item.createDate" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="图示">
                <el-upload
                  class="avatar-uploader"
                  list-type="picture-card"
                  multiple
                  :file-list="item.maintainPlanPictures || []"
                  :action="uploadImgUrl"
                  :headers="uploadHeaders"
                  accept=".jpg, .png, .jpeg"
                  :on-success="(res, file) => handleAvatarSuccess(res, file, item)"
                  :on-remove=" (file, fileList) => handleRemove(file, fileList, item)"
                  :before-upload="beforeAvatarUpload"
                >
                  <el-button size="small" type="file">点击上传图示</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
            <!-- 表格区 -->
            <el-table
              :data="item.maintainPlanContents"
              style="width: 100%"
              border
              default-expand-all
              :tree-props="{
                children: 'childmaintainPlanContents',
                hasChildren: 'hasChildren',
              }"
            >
              <el-table-column
                align="center"
                type="index"
                label="项目"
                width="80"
              ></el-table-column>
              <el-table-column align="center" label="保养部件" width="150">
                <template slot-scope="scope">
                  <el-input
                    v-show="scope.row.editShow"
                    v-model="scope.row.executionPart"
                  ></el-input>
                  <span v-show="!scope.row.editShow"
                   :style="{
                      'text-decoration':
                        scope.row.deleted === true ? 'line-through' : '',
                    }">{{
                    scope.row.executionPart
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="保养位置" width="150">
                <template slot-scope="scope">
                  <el-input
                    v-show="scope.row.editShow"
                    v-model="scope.row.executionNode"
                  ></el-input>
                  <span v-show="!scope.row.editShow"
                   :style="{
                      'text-decoration':
                        scope.row.deleted === true ? 'line-through' : '',
                    }">{{
                    scope.row.executionNode
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="内容">
                <template slot-scope="scope">
                  <el-input
                    v-show="scope.row.editShow"
                    v-model="scope.row.content"
                  ></el-input>
                  <span v-show="!scope.row.editShow"
                   :style="{
                      'text-decoration':
                        scope.row.deleted === true ? 'line-through' : '',
                    }">{{
                    scope.row.content
                  }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column align="center" label="工时(s)">
                <template slot-scope="scope">
                  <el-input
                    v-show="scope.row.editShow"
                    v-model="scope.row.hour"
                    @change="calcTime(item)"
                  ></el-input>
                  <span v-show="!scope.row.editShow">{{scope.row.hour}}</span>
                </template>
              </el-table-column> -->
              <!-- <el-table-column align="center" label="方法">
                <template slot-scope="scope">
                  <el-input v-show="scope.row.editShow" v-model="scope.row.method"></el-input>
                  <span v-show="!scope.row.editShow">{{scope.row.method}}</span>
                </template>
              </el-table-column> -->
              <el-table-column align="center" label="周期" width="110">
                <template slot-scope="scope">
                  <span v-if="!scope.row.editShow">{{ scope.row.cycleName }}</span>
                  <el-select
                    v-model="scope.row.cycleName"
                    style="width: 100%"
                    v-if="scope.row.editShow"
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
                    style="width: 100%"
                    :disabled="!scope.row.editShow"
                  >
                    <el-option
                      v-for="itemSort in item.maintainPlanContents.length"
                      :key="itemSort"
                      :label="itemSort"
                      :value="itemSort"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <!-- <el-table-column align="center" prop="photoDisplay" label="图示">
                <template slot-scope="scope">
                  <img
                    v-if="scope.row.accessoryUrl"
                    style="width: 40px;height: 40px;"
                    :src="`${apiConfig.accessoryFile+scope.row.accessoryUrl}`"
                    class="avatar"
                  />
                </template>
              </el-table-column> -->
              <el-table-column
                align="center"
                width="300"
                label="操作"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button size="small" @click="scope.row.editShow = true"
                    >编辑</el-button
                  >
                  <el-button size="small" @click="scope.row.editShow = false"
                    >保存</el-button
                  >
                  <el-button
                    size="small"
                    @click.native.prevent="
                      scope.row.deleted = true,
                      deleteRow(scope.$index, item.maintainPlanContents),
                      calcTime(item)
                    "
                    :disabled="scope.row.deleted"
                    style="margin-right: 10px"
                    >删除</el-button
                  >
                  <!-- <div style="display: inline-block;" @click="uploadImg(index,scope.$index)">
                    <el-upload
                      class="avatar-uploader"
                      :action="uploadImgUrl"
                      :headers="uploadHeaders"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload"
                    >
                      <el-button size="small" type="file">上传图示</el-button>
                    </el-upload>
                  </div> -->
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <el-col :span="7" :offset="17" style="margin-top: 20px">
            <el-form-item>
              <el-button
                v-if="newAddDialogTitle === '新增'"
                type="primary"
                @click="submitForm()"
                >提交</el-button
              >
              <el-button
                v-if="newAddDialogTitle === '编辑'"
                type="primary"
                @click="changePlan()"
                >保存</el-button
              >
              <el-button @click="newAddDialog = false">取 消</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-dialog>
    <!-- 查看详情 -->
    <el-dialog :visible.sync="orderDetailIsShow" width="80%" title="查看">
      <el-row>
        <ShowPlanManage :orderDetail="orderDetail" />
      </el-row>
    </el-dialog>
    <!-- 提交审批 -->
    <el-dialog
      width="30%"
      title="审批"
      :visible.sync="approvalIsShow"
      center
      append-to-body
    >
      <el-form :model="form">
        <el-form-item label="审批理由" prop="reason">
          <el-input
            v-model="form.reason"
            placeholder="审批驳回必须填写理由"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button type="primary" @click="adopt()">审批通过</el-button>
        <el-button type="primary" @click="reject()">审批驳回</el-button>
      </div>
    </el-dialog>
    <!-- 批量导入文件 -->
    <el-dialog
      width="50%"
      title="批量导入文件"
      :visible.sync="uploadFileIsShow"
      center
      append-to-body
    >
      <div>
        <el-upload
          class="upload-demo"
          ref="upload"
          :on-change="handleChange"
          multiple
          action="#"
          :file-list="fileList"
          accept=".xls, .xlsx"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary"
            >选取文件</el-button
          >
          <el-button
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
            >上传到服务器</el-button
          >
          <div slot="tip" class="el-upload__tip">
            只能上传.xls/.xlsx文件，且不超过30M
          </div>
        </el-upload>
      </div>
    </el-dialog>

    <el-dialog
      width="50%"
      title="提示"
      :visible.sync="showRejectMoal"
      center
      append-to-body
    >
      <div>
        <el-form>
          <el-row>
            <el-col :span="24">
              <el-form-item label-width="100px" label="拒绝理由">
                <el-input v-model="form.reason" type="textarea" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="14">
              <el-form-item>
                <el-button @click="showRejectMoal = false">取消</el-button>
                <el-button type="primary" @click="rejectConfirm"
                  >确认</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { tpmsHeader, tpmsTable, tpmsChoosefile } from "../../components";
import { uploadAccessory } from "../../lib/api/accessory";
import apiConfig from "../../lib/api/apiConfig";
import {
  maintainPlan, //查看计划详情
  checkPlanDetail, //查看保养计划详情
  addmaintainPlan, //新增保养计划
  deletePlanDetail, //删除保养计划
  checkWorkorders, // 查看保养计划生成的工单
  importFile, //导入文件
  updatePlanDetail,
  deletePlanMore, //批量删除
  releasedMore,  //批量发布
} from "../../lib/api/upkeepManagePage.js";
import {
  updatePlanPicture,
  importURLPlanFile,
  workshopSectionSelect,
  workStationSelect,
  planStatusSelect,
  workshopAreaManage,
  workshopManage,
  cycleSelect,
} from "../../lib/api/checkPlan";
import { parseTime } from "@/utils";
import axios from "axios";
import {
  factoryManage,
  workshopManage as workshopManageAll,
  workStationManage,
  workshopSectionManage,
} from "../../lib/api/workshopSettingsManage";

import ShowPlanManage from "./comp/ShowPlanManage";
export default {
  data() {
    // const statusList =[
    //   { label: "待审批", id: 1, },
    //   { label: "审批中", id: 2, },
    //   { label: "已退回", id: 3, },
    //   { label: "待发布", id: 4, },
    //   { label: "已发布", id: 5, },
    //   { label: "已取消", id: 6, },
    // ];
    // 获取头部搜索组下拉选择的list
    let getListFuncs = [
      planStatusSelect, //状态
      factoryManage.getNames, //工厂
    ];
    let [statusList, factoryList] = getListFuncs.map((getListFunc) => {
      let arr = [];
      getListFunc(null).then((res) => {
        arr.push(...res.data);
      });
      return arr;
    });
    return {
      newAddDialogTitle: "",
      apiConfig,
      maintainContentColoniesIndex: 0,
      maintainPlanContentsIndex: 0,
      showRejectMoal: false,
      User_info: JSON.parse(localStorage.getItem("user_info")),
      uploadHeaders: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      uploadImgUrl: apiConfig.uploadAccessory + "/128",
      cycleList: [], // 周期列表
      deviceList: [], //设备列表
      //  渲染头部功能区的列表
      equipmentFormList: [
        { label: "名称", props: "name", value: "" },
        {
          label: "工厂",
          props: "factoryId",
          value: "",
          type: "radio",
          checkList: factoryList,
        },
        {
          label: "车间",
          props: "workshopId",
          value: "",
          type: "radio",
          checkList: [],
        },
        { label: "设备名称", props: "deviceName", value: "" },
        { label: "资产编号", props: "deviceAssetNo", value: "" },
        {
          label: "状态",
          props: "status",
          value: "",
          type: "radio",
          checkList: statusList,
        },
      ],
      total: 0,
      // 表格的数据
      equipmentTableData: [],
      oneWorkOrderIsShow: false, //查看保养工单列表弹窗
      oneWorkOrderData: [], //查看保养工单列表数据
      syncPicture: false,
      newAddDialog: false, //新增保养计划弹窗
      //新增保养计划表单
      form: {
        tyepe:1,
        no: "", //保养计划编号
        name: "", //保养名称
        workshopId: "", //车间ID
        workshopName: "", //车间名称
        areaName: "", //区域名称
        reason: "", //拒绝原因
        maintainContentColonies: [
          {
            id: "",
            tyepe:1,
            version: "", //版本
            // stationId: "", //工位
            // sectionId: "", //工段
            // hour: "", //工时
            creatorName: JSON.parse(localStorage.getItem("user_info")).principal
              .name, //编制人
            createDate: parseTime(new Date()), //编制日期
            deviceId: "", //设备(生产线)名称ID
            creatorName: "",
            createDate: "",
            sectionOrStationName: "",
            maintainPlanContents: [
              {
                id: "",
                tyepe:1,
                editShow: false,
                executionNode: "", //时间/部件
                executionPart: "", //保养部件
                content: "", //  内容
                hour: "", //工时（s）
                cycleId: "", //周期
                accessoryUrl: "111", //图示
                accessoryId: "1", //图示ID
                method: "", //方法
                childmaintainPlanContents: [
                  //可展开的子节点
                ],
              },
            ],
          },
        ],
      },
      maintainContentColoniesIndex: "",
      orderDetailIsShow: false, //查看保养计划详情弹窗
      orderDetail: {}, //查看保养计划详情数据
      approvalIsShow: false,
      importFileData: {
        workshopName: "PFMA",
      },
      uploadFileIsShow: false,
      importURLFileUrl: apiConfig.importURLPlanFile,
      fileList: [],
      deviceList: [],
      deviceInfo: [], //设备下拉框信息
      planId: "",
      loading: false,
    };
  },
  components: {
    tpmsHeader,
    tpmsTable,
    tpmsChoosefile,
    ShowPlanManage,
  },
  created() {},
  mounted() {
    this.getTableData();
    this.getCycleList();
    // this.getDeviceList();
  },
  methods: {
    /** 导出单个计划 */
    exportFile({ id }) {
      let url = `${apiConfig.exportMaintainPlan}/${id}/download`; //请求下载文件的地址
      let token = localStorage.getItem("access_token"); //获取token
      axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + token,
          },
          responseType: "blob",
        })
        .then((res) => {
          if (!res) return;

          let fileName = "plan.zip";
          const disposition = res.headers["content-disposition"];
          if (disposition) {
            const name = disposition.split(";")[1].split("filename=")[1];
            fileName = decodeURI(name);
          }

          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8",
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
        .catch((error) => {
          this.$message.error(error || '')
        });
    },
    /** 导出符合所有搜索条件的计划 */
    exportPlans() {
      const searchData = this.$refs.tpmsHeader.getData();
      let url = apiConfig.exportMaintainPlans; //请求下载文件的地址
      let token = localStorage.getItem("access_token"); //获取token
      axios
        .get(url, {
          params: searchData,
          headers: {
            Authorization: "Bearer " + token,
          },
          responseType: "blob",
        })
        .then((res) => {
          if (!res) return;

          let fileName = "plans.zip";
          const disposition = res.headers["content-disposition"];
          if (disposition) {
            const name = disposition.split(";")[1].split("filename=")[1];
            fileName = decodeURI(name);
          }

          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8",
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
        .catch((error) => {
          this.$message.error(error);
        });
    },
    handleSelectionChange(e) {
      // console.log(e)
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
      device(option).then((res) => {
        // console.log(res)
        this.deviceInfo = res.data.content;
      });
    },
    /**
     * @description 导入单个文件
     */
    getFileData(files) {
      this.loading = true;
      let formData = new FormData();
      files.forEach((file) => formData.append("file", file));
      const _this = this;
      let datas = [];
      importFile(formData)
        .then((res) => {
          datas = res.data;
          datas.forEach((data) => {
            data.creatorName = JSON.parse(localStorage.getItem("user_info")).principal.name; //编制人
            data.createDate = parseTime(new Date()); //编制日期
            data.maintainPlanContents.forEach(
              (item) => {
                item.editShow = false
              }
            );
          });
        })
        .catch((err) => {
          this.loading = false;
        });

      const time = setTimeout(() => {
        _this.form.maintainContentColonies = datas;
        console.log(datas)
        this.loading = false;
      }, 10000)
    },
    getMutipleFileData(files, index) {
      this.loading = true;
      let formData = new FormData();
      files.forEach(function (file) {
        formData.append("file", file, file.name);
      });

      // formData.append('file',file);
      formData.append("workshopName", "PFMB");
      importURLPlanFile(formData).then((res) => {
        // console.log(res)
        this.loading = false;
        let data = res.data;
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].maintainPlanContents.length; j++) {
            data[i].maintainPlanContents[j].editShow = false;
          }
        }
        this.form.maintainContentColonies.splice(index, 1);
        this.form.maintainContentColonies.splice(index, 1, ...data);
        // let len=index+res.data.length
        // for(var j=index;j<len;j++){
        //   this.form.maintainContentColonies[j]=res.data[len-j-index];
        //   this.$set(this.form.maintainContentColonies,j,res.data[len-j-index])
        // }
        // this.$forceUpdate()
        // this.$set(this.form.maintainContentColonies,index,res.data[0])
      });
    },
    /** 获取周期列表 */
    getCycleList() {
      var workshopId = this.User_info.principal.workshopId;
      const data = {
        module: 4, //{1:'点检',2:'日常保养',3:'巡检',4:'保养'};
      };
      cycleSelect(data, workshopId + "/cycle/names").then((res) => {
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
      maintainPlan({ ...data, ...pageData }).then((res) => {
        // console.log({ ...data, ...pageData})
        this.total = res.data.totalElements;
        this.equipmentTableData = res.data.content;
      });
    },
    /** 头部value变更回调 */
    onValueChanged({ props, value }) {
      if (props === "factoryId") {
        // 选择工厂，重置车间
        workshopManageAll.getNames({ factoryId: value }).then((res) => {
          this.equipmentFormList.forEach((item) => {
            if (item.props === "workshopId") {
              item.checkList = res.data;
              item.value = "";
            }
          });
        });
      }
    },
    /** 查看保养计划详情  */
    view(row) {
      checkPlanDetail(null, row.id).then((res) => {
        res.data.maintainContentColonies.map((item) => {
          item.maintainPlanPictures &&
            item.maintainPlanPictures.forEach((ever) => {
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

    /**  新增保养计划按钮*/
    add() {
      this.newAddDialog = true;
      this.newAddDialogTitle = "新增";
      this.form = {
        no: "", //保养计划编号
        name: "", //保养名称
        status: "",
        workshopId: "", //车间ID
        workshopName: "", //车间名称
        areaName: "", //区域名称
        reason: "", //审核拒绝原因
        maintainContentColonies: [
          {
            id: "",
            version: "", //版本
            // stationId: "", //工位
            // sectionId: "", //工段
            // hour: "", //工时
            creatorName: JSON.parse(localStorage.getItem("user_info")).principal
              .name, //编制人
            createDate: parseTime(new Date()), //编制日期
            deviceId: "", //设备(生产线)名称ID
            deviceNames: "",
            deviceNos: "",
            maintainPlanContents: [
              {
                id: "",
                editShow: false,
                executionNode: "", //时间/部件
                content: "", //  内容
                // hour: "", //工时（s）
                cycleId: "", //周期
                accessoryUrl: "", //图示
                accessoryId: "", //图示id
                method: "", //方法
                childmaintainPlanContents: [
                  //可展开的子节点
                ],
                sort: 1,
              },
            ],
          },
        ],
      };
      this.getWorkshopAreaManage();
    },
    // 同步图示库
    syncPictureFun() {
      updatePlanPicture(this.form).then((res) => {
        this.form = res.data;
      });
    },
    // 获取点击的导入文件的index
    getIndex(index) {
      this.maintainContentColoniesIndex = index;
    },
    /**  导入文件成功 */
    importFileSuccess(res, file) {
      var index = this.maintainContentColoniesIndex;
      console.log(index);
      this.form.maintainContentColonies[index] = res.data[0];
      console.log(this.form);
    },
    //打开批量导入文件弹窗
    uploadFiles(index) {
      this.maintainContentColoniesIndex = index;
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
        workshopName: "PFMB",
      };
      importURLPlanFile(data).then((res) => {
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
        item.maintainPlanPictures = item.maintainPlanPictures.filter((ever) => {
          return ever.accessoryId !== file.response.id;
        });
      } else {
        item.maintainPlanPictures = item.maintainPlanPictures.filter((ever) => {
          return ever.name !== file.name;
        });
      }
    },
    /**  获取区域名称 */
    getWorkshopAreaManage() {
      workshopAreaManage(null, this.User_info.principal.workshopAreaId).then(
        (res) => {
          // console.log(res);
          this.form.areaName = res.data.name;
          var areaNo = res.data.no;
          this.getWorkshopManage(areaNo);
        }
      );
    },
    /**  获取车间名称 */
    getWorkshopManage(areaNo) {
      workshopManage(null, this.User_info.principal.workshopId).then((res) => {
        console.log("workshopName", res.data.name);
        this.form.workshopName = res.data.name;
        this.importFileData.workshopName = res.data.name;
        this.form.workshopId = res.data.id;
        var workshopNo = res.data.no;
      });
    },
    /** 编辑保养计划 */
    edit(row) {
      // console.log(row);
      this.newAddDialogTitle = "编辑";
      checkPlanDetail(null, row.id).then((res) => {
        console.log(res);
        let data = res.data;
        for (var j = 0; j < data.maintainContentColonies.length; j++) {
          for (
            var i = 0;
            i < data.maintainContentColonies[j].maintainPlanContents.length;
            i++
          ) {
            data.maintainContentColonies[j].maintainPlanContents[
              i
            ].editShow = false;
          }
        }
        res.data.maintainContentColonies.map((item) => {
          item.maintainPlanPictures &&
            item.maintainPlanPictures.forEach((ever) => {
              ever.name = ever.accessoryId;
              ever.url = this.apiConfig.accessoryFile + ever.accessoryUrl;
            });
        });
        this.form.status = "";
        this.form = data;
      });
      this.newAddDialog = true;
    },
    /** 提交保养计划 */
    submitForm() {
      delete this.form.status;
      var form = this.form;
      form.type = 3;
      var newType = false;
      // if (!form.name) {
      //   this.$message.warning("缺少必填项!");
      //   return false;
      // }
      // const validate = form.maintainContentColonies.filter((item) => {
      //   if (!item.version) return true;
      //   if (!item.deviceId) return true;
      //   if (!item.stationId) return true;
      //   if (!item.hour) return true;
      //   if (!item.qrPicId) return true;
      //   if (!item.repairTimes) return true;
      //   const validateee = item.maintainPlanContents.filter((itemm) => {
      //     if (!itemm.executionNode) return true;
      //     if (!itemm.content) return true;
      //     if (!itemm.hour) return true;
      //     if (!itemm.cycleId) return true;
      //     if (!itemm.photoDisplay) return true;
      //   });
      //   if (validateee.length) {
      //     this.$message.warning("缺少必填项!");
      //     return true;
      //   }
      // });

      // if (validate.length) {
      //   this.$message.warning("缺少必填项!");
      //   return;
      // }
      const validate = form.maintainContentColonies.some(
        ({ maintainPlanContents }) => {
          const arr = maintainPlanContents.map(({ sort }) => sort);
          return new Set(arr).size !== arr.length;
        }
      );
      if (validate) {
        this.$message.warning("工作内容顺序重复，请修改");
        return;
      }
      console.log(JSON.stringify(form));
      addmaintainPlan(form).then((res) => {
        // console.log(res);
        this.$message.success("操作成功");
        this.newAddDialog = false;
        this.getTableData();
      });
    },

    /** 修改计划 */
    changePlan() {
      const validate = this.form.maintainContentColonies.some(
        ({ maintainPlanContents }) => {
          const arr = maintainPlanContents.map(({ sort }) => sort);
          return new Set(arr).size !== arr.length;
        }
      );
      if (validate) {
        this.$message.warning("工作内容顺序重复，请修改");
        return;
      }
      const validateDevices = this.form.maintainContentColonies.filter(item => {
        const validateee = item.maintainPlanContents.filter(itemm => {
          if(!itemm.executionNode) return true;
          if(!itemm.content) return true;
          if(!itemm.executionPart) return true;
          // if(!itemm.cycleId) return true;
          return false;
        });
        if (validateee.length) {
          this.$message.warning("缺少必填项!");
          return true;
        }
        return false
      })
      if (validateDevices.length) {
        return;
      }
      console.log(JSON.stringify(this.form));
      delete this.form.status;
      updatePlanDetail(this.form, this.form.id).then((res) => {
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
        childmaintainPlanContents: [
          //可展开的子节点
        ],
        sort: table.length + 1,
      });
    },

    /**  新增保养计划的 maintainContentColonies */
    addPlanDevice() {
      this.form.maintainContentColonies.push({
        version: "", //版本
        // stationId: "", //工位
        // sectionId: "", //工段
        // hour: "", //工时
        workshopId: "", //设备(生产线)名称
        creatorName: JSON.parse(localStorage.getItem("user_info")).principal
          .name, //编制人
        createDate: parseTime(new Date()), //编制日期
        maintainPlanContents: [
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
            childmaintainPlanContents: [
              //可展开的子节点
            ],
            sort: 1,
          },
        ],
      });
    },
    /**
     * 删除maintainPlanContents里的一条数据
     */ 
    deleteRow(row, rows) {
      // rows.splice(index, 1);
      
      console.log(this.form);
      debugger
    },
    /** 计算工时 */
    calcTime(item) {
      console.log(item);
      const { maintainPlanContents } = item;
      const sum = maintainPlanContents
        .filter((row => row.deleted == false))
        .map((row) => row.hour)
        .reduce((a, b) => {
          const pre = parseInt(a) || 0;
          const next = parseInt(b) || 0;
          return pre + next;
        },0);
      item.hour = sum;
    },
    //审批保养计划
    approval(row) {
      // console.log(row);
      checkPlanDetail(null, row.id).then((res) => {
        // console.log(res);
        this.form = res.data;
      });
      this.approvalIsShow = true;
    },
    //审批通过
    adopt() {
      this.form.status = 2;
      updatePlanDetail(this.form, this.form.id).then((res) => {
        // console.log(res);
        this.getTableData();
        this.$message({
          type: "success",
          message: "已同意审批!",
        });
        this.approvalIsShow = false;
      });
    },
    //审批驳回
    reject() {
      this.form.status = 3;
      updatePlanDetail(this.form, this.form.id).then((res) => {
        // console.log(res);
        this.getTableData();
        this.$message({
          type: "success",
          message: "已同意审批!",
        });
        this.approvalIsShow = false;
      });
    },
    // 审核驳回确认
    rejectConfirm() {
      console.log(this.form);
      updatePlanDetail(this.form, this.form.id).then((res) => {
        // console.log(res);
        this.showRejectMoal = false;
        this.approvalIsShow = false;
        this.getTableData();
        this.$message({
          type: "success",
          message: "已驳回审批!",
        });
      });
    },
    //发起审批保养计划
    newApproval(row) {
      // console.log(row);
      this.$confirm("重新发起审批, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          checkPlanDetail(null, row.id).then((res) => {
            // console.log(res);
            this.form = res.data;
          });
          this.form.status = 1;
          updatePlanDetail(this.form, row.id).then((res) => {
            // console.log(res);
            this.getTableData();
            this.$message({
              type: "success",
              message: "重新发起审批成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消重新发起审批!",
          });
        });
    },
    //  查看保养工单
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
        checkWorkorders(pageData, id).then((res) => {
          this.oneWorkOrderData = {
            data: res.data.content,
            planId: id,
            totalElements: res.data.totalElements,
          };
        });
      });
    },
    //删除保养计划
    del(row) {
      // console.log(row);
      this.$confirm("此操作将删除保养计划, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletePlanDetail(null, row.id).then((res) => {
            // console.log(res);
            this.getTableData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //发布保养计划
    release(row) {
      // console.log(row);
      this.$confirm("发布保养计划, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.form.status = 5;
          updatePlanDetail(this.form, row.id).then((res) => {
            // console.log(res);
          this.getTableData();
            this.$message({
              type: "success",
              message: "发布成功!",
            });
          this.getTableData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消发布",
          });
        });
      this.getTableData();
    },
    //取消保养计划
    cancel(row) {
      // console.log(row);
      this.$confirm("取消保养计划, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          checkPlanDetail(null, row.id).then((res) => {
            // console.log(res);
            this.form = res.data;
          });
          this.form.status = 6;
          updatePlanDetail(this.form, row.id).then((res) => {
            // console.log(res);
            this.getTableData();
            this.$message({
              type: "success",
              message: "取消保养计划成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消取消保养计划",
          });
        });
    },
    //获取图片上传按钮的index
    uploadImg(index, num) {
      console.log(index, num);

      this.maintainContentColoniesIndex = index;
      this.maintainPlanContentsIndex = num;
    },
    // 图片上传成功
    handleAvatarSuccess(res, file, item) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      // console.log(res,file)
      // this.form.maintainContentColonies[this.maintainContentColoniesIndex].maintainPlanContents[this.maintainPlanContentsIndex].=`${apiConfig.accessoryFile}/${res.path}${res.name}`
      // this.form.maintainContentColonies[this.maintainContentColoniesIndex].maintainPlanContents[
      //   this.maintainPlanContentsIndex
      // ].accessoryId = res.id;
      // this.form.maintainContentColonies[this.maintainContentColoniesIndex].maintainPlanContents[
      //   this.maintainPlanContentsIndex
      // ].accessoryUrl = `/${res.path + res.name}`;
      const img = {
        accessoryId: res.id,
        accessoryUrl: `/${res.path + res.name}`,
        // 这是element组件回显用的
        name: res.id,
        url: `${this.apiConfig.accessoryFile}/${res.path + res.name}`,
      };
      item.maintainPlanPictures = item.maintainPlanPictures || [];
      item.maintainPlanPictures.push(img);
      this.$message.success("上传完成");
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      // console.log(file);
      const isLt10M = file.size / 1024 / 1024 < 10;

      var testmsg = file.name.substring(file.name.lastIndexOf('.')+1)
      const extension = testmsg === 'png'
      const extension2 = testmsg === 'jpeg'
      const extension3 = testmsg === 'jpg'

      if(!extension && !extension2 && !extension3) {
        this.$message({
            message: '上传文件只能是 png、jpeg、jpg格式的文件',
            type: 'warning'
        });
      }
      
      if (!isLt10M) {
        this.$message.error("上传头像图片大小不能超过 10M!");
      }
      return (extension || extension2 || extension3) && isLt10M;
    },
    /**
     * 批量删除保养计划
     */
    deleteMore() {
      const selected = this.$refs.tpmsTable.getSelectionList();
      const ids = selected.map((item) => item.id);
      if (ids.length === 0) {
        this.$message.warning("请先选择需要删除的计划");
        return;
      }
      this.$confirm("此操作将删除保养计划, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletePlanMore(ids)
            .then((res) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "删除失败",
              });
            });
          this.getTableData();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /**
     * 批量发布保养计划
     */
    releaseMore() {
      const selected = this.$refs.tpmsTable.getSelectionList();
      const ids = selected.map((item) => item.id);
      if (ids.length === 0) {
        this.$message.warning("请先选择需要发布的计划");
        return;
      }
      this.$confirm("发布保养计划, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          releasedMore(ids)
            .then((res) => {
              this.getTableData();
              this.$message({
                type: "success",
                message: "发布成功!",
              });
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "发布失败",
              });
            });
          this.getTableData();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消发布",
          });
        });
    },
  },
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
